/**
 * Profile.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Halaman Profil Saya dengan logic penuh:
 *   ✓ Data diambil dari AuthContext (pengguna yang sedang login)
 *   ✓ Update profil (nama, email, telepon, alamat, jabatan) via authService
 *   ✓ Avatar inisial otomatis update saat nama berubah
 *   ✓ Validasi backend: email unik, nama tidak kosong, format email
 *   ✓ Ubah password: verifikasi password lama, kebijakan keamanan, hash
 *   ✓ Show/hide toggle untuk semua field password
 *   ✓ Loading state saat request berlangsung
 *   ✓ Error & success notification
 *   ✓ Reset form saat batal edit
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState, useEffect } from "react";
import {
  UserCircle,
  Mail,
  Phone,
  MapPin,
  Camera,
  Save,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import PageHeader from "../components/common/PageHeader";
import FormInput from "../components/common/FormInput";
import Button from "../components/common/Button";
import { useAuth } from "../context/AuthContext";
import "./Profile.css";

// ── Helper: format tanggal bergabung ──────────────────────────────────────────
function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

// ── Helper: inisial nama ──────────────────────────────────────────────────────
function getInitials(name) {
  if (!name) return "?";
  return name.trim().split(" ").map((w) => w[0]?.toUpperCase() ?? "").slice(0, 2).join("");
}

// ─────────────────────────────────────────────────────────────────────────────

export default function Profile() {
  const { user, updateProfile, changePassword } = useAuth();

  // ── State: Profile Form ────────────────────────────────────────────────────
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    telepon: "",
    alamat: "",
    jabatan: "",
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [formErrors, setFormErrors] = useState({});

  // ── State: Password Form ───────────────────────────────────────────────────
  const [pwForm, setPwForm] = useState({ lama: "", baru: "", konfirmasi: "" });
  const [pwErrors, setPwErrors] = useState({});
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");
  const [showPw, setShowPw] = useState({ lama: false, baru: false, konfirmasi: false });

  // ── Sync form saat user berubah (misal setelah update) ────────────────────
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name ?? "",
        email: user.email ?? "",
        telepon: user.telepon ?? "",
        alamat: user.alamat ?? "",
        jabatan: user.jabatan ?? user.role ?? "",
      });
    }
  }, [user]);

  // ── Validasi Frontend Profil ───────────────────────────────────────────────
  function validateProfileForm() {
    const errs = {};
    if (!form.name.trim()) errs.name = "Nama tidak boleh kosong.";
    if (!form.email.trim()) {
      errs.email = "Email wajib diisi.";
    } else if (!/\S+@\S+\.\S+/.test(form.email.trim())) {
      errs.email = "Format email tidak valid.";
    }
    return errs;
  }

  // ── Simpan Profil ──────────────────────────────────────────────────────────
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess("");

    const errs = validateProfileForm();
    setFormErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setProfileLoading(true);
    try {
      const result = await updateProfile({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        telepon: form.telepon.trim(),
        alamat: form.alamat.trim(),
        jabatan: form.jabatan,
      });

      if (result.success) {
        setEditing(false);
        setProfileSuccess("Profil berhasil diperbarui.");
        setTimeout(() => setProfileSuccess(""), 4000);
      } else {
        setProfileError(result.error ?? "Gagal memperbarui profil.");
      }
    } catch {
      setProfileError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setProfileLoading(false);
    }
  };

  // ── Batal Edit ─────────────────────────────────────────────────────────────
  const handleCancelEdit = () => {
    setEditing(false);
    setFormErrors({});
    setProfileError("");
    // Reset ke data user saat ini
    if (user) {
      setForm({
        name: user.name ?? "",
        email: user.email ?? "",
        telepon: user.telepon ?? "",
        alamat: user.alamat ?? "",
        jabatan: user.jabatan ?? user.role ?? "",
      });
    }
  };

  // ── Validasi Password ──────────────────────────────────────────────────────
  function validatePasswordForm() {
    const errs = {};
    if (!pwForm.lama) errs.lama = "Password lama wajib diisi.";
    if (!pwForm.baru) {
      errs.baru = "Password baru wajib diisi.";
    } else if (pwForm.baru.length < 6) {
      errs.baru = "Password baru minimal 6 karakter.";
    }
    if (!pwForm.konfirmasi) {
      errs.konfirmasi = "Konfirmasi password wajib diisi.";
    } else if (pwForm.baru && pwForm.baru !== pwForm.konfirmasi) {
      errs.konfirmasi = "Konfirmasi tidak cocok dengan password baru.";
    }
    return errs;
  }

  // ── Ubah Password ──────────────────────────────────────────────────────────
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwError("");
    setPwSuccess("");

    const errs = validatePasswordForm();
    setPwErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setPwLoading(true);
    try {
      const result = await changePassword(pwForm.lama, pwForm.baru);
      if (result.success) {
        setPwSuccess("Password berhasil diubah.");
        setPwForm({ lama: "", baru: "", konfirmasi: "" });
        setTimeout(() => setPwSuccess(""), 4000);
      } else {
        setPwError(result.error ?? "Gagal mengubah password.");
      }
    } catch {
      setPwError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setPwLoading(false);
    }
  };

  // ── Loading state awal ─────────────────────────────────────────────────────
  if (!user) {
    return (
      <DashboardLayout title="Profil Saya" subtitle="Kelola informasi akun Anda.">
        <div className="profile-loading-state">
          <Loader2 size={28} className="spin-anim" />
          <p>Memuat data profil...</p>
        </div>
      </DashboardLayout>
    );
  }

  // Inisial untuk avatar (selalu dari state form.name jika sedang edit, user.name jika tidak)
  const displayName = editing ? form.name : user.name;
  const initials = getInitials(displayName);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <DashboardLayout title="Profil Saya" subtitle="Kelola informasi akun Anda.">
      <PageHeader title="Profil Saya" description="Lihat dan perbarui informasi akun Anda." />

      <div className="profile-layout">
        {/* ─── Kartu Avatar ─── */}
        <div className="profile-avatar-card">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar-big" title={user.name}>
              {initials}
            </div>
            <button
              className="avatar-camera-btn"
              type="button"
              title="Ubah foto (belum tersedia)"
              onClick={() => alert("Fitur upload foto belum tersedia.")}
            >
              <Camera size={16} />
            </button>
          </div>
          <h2 className="profile-name">{user.name}</h2>
          <p className="profile-role">{user.role ?? user.jabatan ?? "—"}</p>

          <div className="profile-info-list">
            <div className="profile-info-row">
              <Mail size={14} />
              <span>{user.email}</span>
            </div>
            <div className="profile-info-row">
              <Phone size={14} />
              <span>{user.telepon || "—"}</span>
            </div>
            <div className="profile-info-row">
              <MapPin size={14} />
              <span>{user.alamat || "—"}</span>
            </div>
            <div className="profile-info-row">
              <UserCircle size={14} />
              <span>Bergabung {formatDate(user.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* ─── Formulir ─── */}
        <div className="profile-forms">
          {/* Edit Profil */}
          <div className="profile-form-card">
            <div className="profile-form-header">
              <div>
                <h3>Informasi Profil</h3>
                <p>Perbarui data diri dan informasi kontak Anda.</p>
              </div>
              {!editing && (
                <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>
                  Edit Profil
                </Button>
              )}
            </div>

            {profileSuccess && (
              <div className="profile-success-msg" role="status">
                <CheckCircle2 size={15} style={{ flexShrink: 0 }} />
                {profileSuccess}
              </div>
            )}
            {profileError && (
              <div className="profile-error-msg" role="alert">
                <AlertCircle size={15} style={{ flexShrink: 0 }} />
                {profileError}
              </div>
            )}

            <form className="profile-form" onSubmit={handleSaveProfile}>
              <div className="form-row-2">
                <FormInput
                  label="Nama Lengkap"
                  id="prf-nama"
                  name="name"
                  value={form.name}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, name: e.target.value }));
                    if (formErrors.name) setFormErrors((p) => ({ ...p, name: "" }));
                  }}
                  required
                  error={formErrors.name}
                  disabled={!editing}
                />
                <FormInput
                  label="Jabatan"
                  id="prf-jabatan"
                  type="select"
                  name="jabatan"
                  value={form.jabatan}
                  onChange={(e) => setForm((f) => ({ ...f, jabatan: e.target.value }))}
                  options={["Admin", "Kasir", "Mekanik", "Administrator"]}
                  disabled={!editing}
                />
              </div>
              <div className="form-row-2">
                <FormInput
                  label="Email"
                  id="prf-email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, email: e.target.value }));
                    if (formErrors.email) setFormErrors((p) => ({ ...p, email: "" }));
                  }}
                  required
                  error={formErrors.email}
                  disabled={!editing}
                />
                <FormInput
                  label="No. Telepon"
                  id="prf-telp"
                  type="text"
                  name="telepon"
                  value={form.telepon}
                  onChange={(e) => setForm((f) => ({ ...f, telepon: e.target.value }))}
                  disabled={!editing}
                />
              </div>
              <FormInput
                label="Alamat"
                id="prf-alamat"
                type="textarea"
                name="alamat"
                value={form.alamat}
                onChange={(e) => setForm((f) => ({ ...f, alamat: e.target.value }))}
                rows={2}
                disabled={!editing}
              />

              {editing && (
                <div className="profile-form-actions">
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={profileLoading}
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    icon={
                      profileLoading ? (
                        <Loader2 size={15} className="spin-anim" />
                      ) : (
                        <Save size={15} />
                      )
                    }
                    disabled={profileLoading}
                  >
                    {profileLoading ? "Menyimpan..." : "Simpan Perubahan"}
                  </Button>
                </div>
              )}
            </form>
          </div>

          {/* Ubah Password */}
          <div className="profile-form-card">
            <div className="profile-form-header">
              <div>
                <h3>Ubah Password</h3>
                <p>Perbarui password untuk keamanan akun.</p>
              </div>
              <Lock size={20} color="#64748b" />
            </div>

            {pwSuccess && (
              <div className="profile-success-msg" role="status">
                <CheckCircle2 size={15} style={{ flexShrink: 0 }} />
                {pwSuccess}
              </div>
            )}
            {pwError && (
              <div className="profile-error-msg" role="alert">
                <AlertCircle size={15} style={{ flexShrink: 0 }} />
                {pwError}
              </div>
            )}

            <form className="profile-form" onSubmit={handleChangePassword}>
              {/* Password Lama */}
              <div className="pw-field-wrap">
                <FormInput
                  label="Password Lama"
                  id="pw-lama"
                  type={showPw.lama ? "text" : "password"}
                  name="lama"
                  placeholder="Masukkan password lama"
                  value={pwForm.lama}
                  onChange={(e) => {
                    setPwForm((f) => ({ ...f, lama: e.target.value }));
                    if (pwErrors.lama) setPwErrors((p) => ({ ...p, lama: "" }));
                    if (pwError) setPwError("");
                  }}
                  required
                  error={pwErrors.lama}
                  disabled={pwLoading}
                />
                <button
                  type="button"
                  className="pw-toggle-btn"
                  onClick={() => setShowPw((v) => ({ ...v, lama: !v.lama }))}
                  aria-label={showPw.lama ? "Sembunyikan password lama" : "Tampilkan password lama"}
                >
                  {showPw.lama ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>

              <div className="form-row-2">
                {/* Password Baru */}
                <div className="pw-field-wrap">
                  <FormInput
                    label="Password Baru"
                    id="pw-baru"
                    type={showPw.baru ? "text" : "password"}
                    name="baru"
                    placeholder="Min. 6 karakter"
                    value={pwForm.baru}
                    onChange={(e) => {
                      setPwForm((f) => ({ ...f, baru: e.target.value }));
                      if (pwErrors.baru) setPwErrors((p) => ({ ...p, baru: "" }));
                    }}
                    required
                    error={pwErrors.baru}
                    disabled={pwLoading}
                  />
                  <button
                    type="button"
                    className="pw-toggle-btn"
                    onClick={() => setShowPw((v) => ({ ...v, baru: !v.baru }))}
                    aria-label={showPw.baru ? "Sembunyikan" : "Tampilkan"}
                  >
                    {showPw.baru ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>

                {/* Konfirmasi Password Baru */}
                <div className="pw-field-wrap">
                  <FormInput
                    label="Konfirmasi Password"
                    id="pw-konfirmasi"
                    type={showPw.konfirmasi ? "text" : "password"}
                    name="konfirmasi"
                    placeholder="Ulangi password baru"
                    value={pwForm.konfirmasi}
                    onChange={(e) => {
                      setPwForm((f) => ({ ...f, konfirmasi: e.target.value }));
                      if (pwErrors.konfirmasi) setPwErrors((p) => ({ ...p, konfirmasi: "" }));
                    }}
                    required
                    error={pwErrors.konfirmasi}
                    disabled={pwLoading}
                  />
                  <button
                    type="button"
                    className="pw-toggle-btn"
                    onClick={() => setShowPw((v) => ({ ...v, konfirmasi: !v.konfirmasi }))}
                    aria-label={showPw.konfirmasi ? "Sembunyikan" : "Tampilkan"}
                  >
                    {showPw.konfirmasi ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              <div className="profile-form-actions">
                <Button
                  type="submit"
                  icon={
                    pwLoading ? (
                      <Loader2 size={15} className="spin-anim" />
                    ) : (
                      <RefreshCw size={15} />
                    )
                  }
                  disabled={pwLoading}
                >
                  {pwLoading ? "Memproses..." : "Ubah Password"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
