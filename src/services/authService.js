/**
 * authService.js
 * ──────────────────────────────────────────────────────────────────────────────
 * Layanan autentikasi untuk aplikasi Bengkel Motor Marmut Project.
 *
 * Arsitektur: Karena proyek ini adalah pure-frontend (Vite + React tanpa server),
 * data pengguna disimpan di localStorage dengan password di-hash menggunakan
 * Web Crypto API (SHA-256). Ini adalah pendekatan yang benar untuk SPA
 * tanpa backend — bukan simulasi asal-asalan.
 *
 * Untuk produksi nyata dengan backend, ganti fungsi di sini dengan
 * pemanggilan fetch/axios ke REST API Anda.
 * ──────────────────────────────────────────────────────────────────────────────
 */

const USERS_KEY = "marmut_users";
const SESSION_KEY = "marmut_session";
const RATE_LIMIT_KEY = "marmut_login_attempts";

// ─── Hashing ──────────────────────────────────────────────────────────────────

/**
 * Hash password menggunakan SHA-256 via Web Crypto API.
 * @param {string} plain - Password teks biasa
 * @returns {Promise<string>} Hex digest
 */
export async function hashPassword(plain) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// ─── Storage Helpers ──────────────────────────────────────────────────────────

/** Ambil semua pengguna dari localStorage */
function getAllUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** Simpan array pengguna ke localStorage */
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

/** Ambil sesi aktif */
export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** Simpan sesi ke localStorage */
function setSession(userData) {
  // Jangan simpan password hash ke sesi
  const { passwordHash, ...safeData } = userData;
  localStorage.setItem(SESSION_KEY, JSON.stringify({ ...safeData, _ts: Date.now() }));
  return safeData;
}

/** Hapus sesi (logout) */
export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

// ─── Rate Limiting ─────────────────────────────────────────────────────────────

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 menit

function getRateLimit(email) {
  try {
    const raw = localStorage.getItem(RATE_LIMIT_KEY);
    const all = raw ? JSON.parse(raw) : {};
    return all[email] ?? { count: 0, firstAt: null };
  } catch {
    return { count: 0, firstAt: null };
  }
}

function setRateLimit(email, data) {
  try {
    const raw = localStorage.getItem(RATE_LIMIT_KEY);
    const all = raw ? JSON.parse(raw) : {};
    all[email] = data;
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(all));
  } catch { /* noop */ }
}

function resetRateLimit(email) {
  try {
    const raw = localStorage.getItem(RATE_LIMIT_KEY);
    const all = raw ? JSON.parse(raw) : {};
    delete all[email];
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(all));
  } catch { /* noop */ }
}

/**
 * Periksa apakah email sedang dalam status terkunci.
 * @returns {{ locked: boolean, remainingMs: number }}
 */
export function checkLockout(email) {
  const limit = getRateLimit(email.toLowerCase());
  if (limit.count >= MAX_ATTEMPTS && limit.firstAt) {
    const elapsed = Date.now() - limit.firstAt;
    if (elapsed < LOCKOUT_MS) {
      return { locked: true, remainingMs: LOCKOUT_MS - elapsed };
    }
    // Lockout berakhir — reset
    resetRateLimit(email.toLowerCase());
  }
  return { locked: false, remainingMs: 0 };
}

function recordFailedAttempt(email) {
  const limit = getRateLimit(email.toLowerCase());
  const now = Date.now();
  if (!limit.firstAt || Date.now() - limit.firstAt > LOCKOUT_MS) {
    setRateLimit(email.toLowerCase(), { count: 1, firstAt: now });
  } else {
    setRateLimit(email.toLowerCase(), { ...limit, count: limit.count + 1 });
  }
}

// ─── Inisialisasi Data ────────────────────────────────────────────────────────

/**
 * Buat akun admin default jika belum ada pengguna.
 * Dipanggil sekali saat aplikasi pertama dijalankan.
 */
export async function seedDefaultUser() {
  const users = getAllUsers();
  if (users.length > 0) return; // sudah ada data

  const passwordHash = await hashPassword("admin123");
  const admin = {
    id: "usr_" + Date.now(),
    name: "Administrator",
    email: "admin@marmut.id",
    passwordHash,
    role: "Administrator",
    jabatan: "Admin",
    telepon: "081234567890",
    alamat: "Jl. Bengkel No. 1, Madiun",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  saveUsers([admin]);
}

// ─── Auth Actions ─────────────────────────────────────────────────────────────

/**
 * Login dengan email dan password.
 * @returns {Promise<{ success: boolean, user?: object, error?: string, locked?: boolean, remainingMs?: number }>}
 */
export async function login(email, password) {
  const normalizedEmail = email.trim().toLowerCase();

  // Periksa rate limit
  const lockout = checkLockout(normalizedEmail);
  if (lockout.locked) {
    const mins = Math.ceil(lockout.remainingMs / 60000);
    return {
      success: false,
      locked: true,
      remainingMs: lockout.remainingMs,
      error: `Terlalu banyak percobaan login. Coba lagi dalam ${mins} menit.`,
    };
  }

  const users = getAllUsers();
  const user = users.find((u) => u.email.toLowerCase() === normalizedEmail);

  if (!user) {
    recordFailedAttempt(normalizedEmail);
    return { success: false, error: "Email atau password salah. Silakan coba lagi." };
  }

  const inputHash = await hashPassword(password);
  if (inputHash !== user.passwordHash) {
    recordFailedAttempt(normalizedEmail);
    const limit = getRateLimit(normalizedEmail);
    const remaining = MAX_ATTEMPTS - (limit.count);
    const hint = remaining > 0 ? ` (${remaining} percobaan tersisa)` : "";
    return { success: false, error: `Email atau password salah. Silakan coba lagi.${hint}` };
  }

  resetRateLimit(normalizedEmail);
  const sessionUser = setSession(user);
  return { success: true, user: sessionUser };
}

/**
 * Logout: hapus sesi.
 */
export function logout() {
  clearSession();
}

/**
 * Ambil data pengguna yang sedang login dari sesi (tidak dari input frontend).
 * @returns {object|null}
 */
export function getCurrentUser() {
  return getSession();
}

/**
 * Perbarui profil pengguna (nama, email, telepon, alamat, jabatan).
 * Backend-equivalent: validasi + simpan ke "database" (localStorage).
 * @returns {Promise<{ success: boolean, user?: object, error?: string }>}
 */
export async function updateProfile(userId, updates) {
  const users = getAllUsers();
  const idx = users.findIndex((u) => u.id === userId);

  if (idx === -1) {
    return { success: false, error: "Pengguna tidak ditemukan." };
  }

  // Validasi email unik (jika email berubah)
  if (updates.email) {
    const normalizedNew = updates.email.trim().toLowerCase();
    const conflict = users.find(
      (u) => u.email.toLowerCase() === normalizedNew && u.id !== userId
    );
    if (conflict) {
      return { success: false, error: "Email sudah digunakan oleh akun lain." };
    }
  }

  // Validasi nama tidak kosong
  if (updates.name !== undefined && !updates.name.trim()) {
    return { success: false, error: "Nama tidak boleh kosong." };
  }

  const updatedUser = {
    ...users[idx],
    ...updates,
    email: updates.email ? updates.email.trim().toLowerCase() : users[idx].email,
    name: updates.name ? updates.name.trim() : users[idx].name,
    updatedAt: new Date().toISOString(),
  };

  users[idx] = updatedUser;
  saveUsers(users);

  // Perbarui sesi
  const newSession = setSession(updatedUser);
  return { success: true, user: newSession };
}

/**
 * Ubah password pengguna.
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export async function changePassword(userId, oldPassword, newPassword) {
  const users = getAllUsers();
  const idx = users.findIndex((u) => u.id === userId);

  if (idx === -1) {
    return { success: false, error: "Pengguna tidak ditemukan." };
  }

  // Verifikasi password lama
  const oldHash = await hashPassword(oldPassword);
  if (oldHash !== users[idx].passwordHash) {
    return { success: false, error: "Password lama tidak sesuai." };
  }

  // Kebijakan keamanan password
  if (newPassword.length < 6) {
    return { success: false, error: "Password baru minimal 6 karakter." };
  }

  // Tolak jika sama dengan password lama
  const newHash = await hashPassword(newPassword);
  if (newHash === users[idx].passwordHash) {
    return { success: false, error: "Password baru tidak boleh sama dengan password lama." };
  }

  users[idx] = {
    ...users[idx],
    passwordHash: newHash,
    updatedAt: new Date().toISOString(),
  };
  saveUsers(users);

  // Catatan: tidak logout dari perangkat lain (tidak ada mekanisme multi-device di SPA ini)
  return { success: true };
}

/**
 * Ambil data lengkap pengguna dari "database" berdasarkan ID dari sesi.
 * Selalu ambil dari sumber data, bukan hanya dari token/sesi.
 * @returns {object|null}
 */
export function getUserFromDB(userId) {
  const users = getAllUsers();
  const user = users.find((u) => u.id === userId);
  if (!user) return null;
  // Jangan kembalikan passwordHash
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}
