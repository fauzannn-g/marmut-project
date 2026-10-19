/**
 * ProtectedRoute.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Guard untuk halaman internal aplikasi.
 * - Jika sesi masih diperiksa (loading), tampilkan layar loading.
 * - Jika belum terautentikasi, redirect ke /login.
 * - Jika sudah terautentikasi, render children.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  // Tampilkan loading screen saat memeriksa sesi awal
  // (mencegah flash redirect ke login sebelum sesi diverifikasi)
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "#f8fafc",
          fontFamily: "Inter, sans-serif",
          color: "#64748b",
          fontSize: "14px",
          gap: "12px",
        }}
      >
        <div
          style={{
            width: "22px",
            height: "22px",
            border: "3px solid #e2e8f0",
            borderTop: "3px solid #0861bd",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <span>Memverifikasi sesi...</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Simpan URL tujuan agar bisa redirect kembali setelah login
    return <Navigate to="/login" replace />;
  }

  return children;
}
