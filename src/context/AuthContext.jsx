/**
 * AuthContext.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Menyediakan state autentikasi global ke seluruh aplikasi.
 * Komponen-komponen menggunakan hook `useAuth()` untuk:
 *   - Mengakses data pengguna aktif
 *   - Memanggil login / logout
 *   - Mengetahui status loading autentikasi
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  login as authLogin,
  logout as authLogout,
  getSession,
  getUserFromDB,
  seedDefaultUser,
  updateProfile as authUpdateProfile,
  changePassword as authChangePassword,
} from "../services/authService";

const AuthContext = createContext(null);

/**
 * Hook untuk mengakses context autentikasi.
 * Harus digunakan di dalam komponen yang dibungkus <AuthProvider>.
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus digunakan di dalam AuthProvider");
  return ctx;
}

/**
 * Provider yang membungkus seluruh aplikasi.
 * Menginisialisasi sesi dari localStorage saat pertama kali dimuat.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true saat memeriksa sesi awal

  // ── Inisialisasi: seed user default & pulihkan sesi ────────────────────────
  useEffect(() => {
    async function initialize() {
      await seedDefaultUser();
      const session = getSession();
      if (session) {
        // Selalu verifikasi sesi dengan mengambil data terbaru dari "DB"
        const freshUser = getUserFromDB(session.id);
        if (freshUser) {
          setUser(freshUser);
        } else {
          // Sesi tidak valid (akun dihapus, dll.) — hapus sesi
          authLogout();
        }
      }
      setLoading(false);
    }
    initialize();
  }, []);

  // ── Login ──────────────────────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    const result = await authLogin(email, password);
    if (result.success) {
      // Ambil data fresh dari DB (bukan hanya dari sesi)
      const freshUser = getUserFromDB(result.user.id);
      setUser(freshUser ?? result.user);
    }
    return result;
  }, []);

  // ── Logout ─────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    authLogout();
    setUser(null);
  }, []);

  // ── Update Profile ─────────────────────────────────────────────────────────
  const updateProfile = useCallback(async (updates) => {
    if (!user) return { success: false, error: "Tidak ada sesi aktif." };
    const result = await authUpdateProfile(user.id, updates);
    if (result.success) {
      const freshUser = getUserFromDB(result.user.id);
      setUser(freshUser ?? result.user);
    }
    return result;
  }, [user]);

  // ── Change Password ────────────────────────────────────────────────────────
  const changePassword = useCallback(async (oldPassword, newPassword) => {
    if (!user) return { success: false, error: "Tidak ada sesi aktif." };
    return authChangePassword(user.id, oldPassword, newPassword);
  }, [user]);

  const value = {
    user,           // null jika belum login, object jika sudah
    loading,        // true saat memeriksa sesi awal
    isAuthenticated: !!user,
    login,
    logout,
    updateProfile,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
