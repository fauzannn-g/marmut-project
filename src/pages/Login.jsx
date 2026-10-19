/**
 * Login.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Halaman login Bengkel Motor Marmut Project.
 *
 * Fitur yang diimplementasikan:
 *   ✓ Validasi frontend (email format, field wajib)
 *   ✓ Kirim ke authService (validasi "backend" + hash comparison)
 *   ✓ Loading state + disable form saat proses login
 *   ✓ Error message tanpa mengungkap apakah email terdaftar
 *   ✓ Email tidak terhapus saat login gagal
 *   ✓ Show/hide password toggle
 *   ✓ Rate limiting (maks 5 percobaan, kunci 15 menit)
 *   ✓ Notifikasi Google OAuth belum dikonfigurasi
 *   ✓ Redirect ke dashboard setelah login berhasil
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wrench, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "../App.css";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // ── Validasi Frontend ──────────────────────────────────────────────────────
  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = "Email wajib diisi.";
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      errs.email = "Format email tidak valid.";
    }
    if (!password) {
      errs.password = "Password wajib diisi.";
    }
    return errs;
  };

  // ── Submit Handler ─────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Cegah pengiriman berulang saat loading
    if (isLoading) return;

    // Bersihkan error server sebelumnya
    setServerError("");

    // Validasi frontend
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsLoading(true);

    try {
      const result = await login(email.trim(), password);

      if (result.success) {
        navigate("/dashboard", { replace: true });
      } else {
        // Jangan hapus email jika gagal
        setPassword(""); // hapus password saja untuk keamanan
        setServerError(result.error || "Terjadi kesalahan. Silakan coba lagi.");
        if (result.locked) {
          setIsLocked(true);
        }
      }
    } catch {
      setServerError(
        "Gagal terhubung. Periksa koneksi internet Anda dan coba lagi."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ── Google Login ───────────────────────────────────────────────────────────
  const handleGoogleLogin = () => {
    setServerError(
      "Login dengan Google belum dikonfigurasi. Hubungi administrator untuk mengaktifkan OAuth Google."
    );
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <main className="login-page">
      {/* ─── Panel Kiri ─── */}
      <section className="left-panel">
        <div className="circle circle-top" />
        <div className="circle circle-bottom" />

        <div className="project-brand">
          <Wrench size={25} strokeWidth={2.8} />
          <span>Bengkel Motor Marmut Project</span>
        </div>

        <div className="hero-content">
          <h1>
            Kasir dan stok bengkel,
            <br />
            semua dalam satu
            <br />
            sistem.
          </h1>
          <p>
            Catat transaksi, pantau stok sparepart, dan lihat
            <br />
            laporan penjualan tanpa nota kertas manual.
          </p>
        </div>

        <div className="left-footer">© 2026 Bengkel Motor Marmut Project</div>
      </section>

      {/* ─── Panel Kanan ─── */}
      <section className="right-panel">
        <div className="login-container">
          <div className="login-heading">
            <h2>Selamat Datang</h2>
            <p>Masuk untuk mengakses sistem kasir</p>
          </div>

          {/* Error dari server / autentikasi */}
          {serverError && (
            <div className="login-server-error" role="alert">
              <AlertCircle size={16} />
              <span>{serverError}</span>
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="form-group">
              <label htmlFor="login-email">Email</label>
              <div
                className={`input-wrapper ${errors.email ? "input-error-border" : ""}`}
              >
                <Mail size={20} />
                <input
                  id="login-email"
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((p) => ({ ...p, email: "" }));
                    if (serverError) setServerError("");
                  }}
                  disabled={isLoading || isLocked}
                  autoComplete="email"
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
              </div>
              {errors.email && (
                <p id="email-error" className="login-error" role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="login-password">Password</label>
              <div
                className={`input-wrapper ${errors.password ? "input-error-border" : ""}`}
              >
                <Lock size={20} />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((p) => ({ ...p, password: "" }));
                    if (serverError) setServerError("");
                  }}
                  disabled={isLoading || isLocked}
                  autoComplete="current-password"
                  aria-describedby={errors.password ? "password-error" : undefined}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="login-error" role="alert">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Tombol Masuk */}
            <button
              type="submit"
              className="login-button"
              disabled={isLoading || isLocked}
            >
              {isLoading ? (
                <span className="login-btn-loading">
                  <Loader2 size={18} className="spin-icon" />
                  Memproses...
                </span>
              ) : (
                "Masuk"
              )}
            </button>

            <div className="divider">
              <span />
              <p>atau</p>
              <span />
            </div>

            {/* Tombol Google */}
            <button
              type="button"
              className="google-button"
              onClick={handleGoogleLogin}
              disabled={isLoading || isLocked}
            >
              <span className="google-icon">G</span>
              <span>Masuk dengan Gmail</span>
            </button>
          </form>

          {/* Info akun default (hanya untuk development) */}
          {/* <div className="login-dev-hint">
            <strong>Demo:</strong> admin@marmut.id / admin123
          </div> */}
        </div>
      </section>
    </main>
  );
}
