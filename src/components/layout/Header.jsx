/**
 * Header.jsx
 * Topbar dengan data pengguna aktif dari AuthContext.
 * Avatar dan nama diambil dari sesi nyata, bukan hardcode.
 */
import { useState, useEffect, useRef } from "react";
import { Bell, Search, ChevronDown, LogOut, UserCircle, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Header.css";

export default function Header({ title, subtitle }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  // Inisial dari nama pengguna (maks 2 karakter)
  const initials = user?.name
    ? user.name.trim().split(" ").map((w) => w[0].toUpperCase()).slice(0, 2).join("")
    : "?";

  return (
    <header className="topbar">
      <div className="topbar-title">
        <h2>{title || "Dashboard"}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>

      <div className="topbar-actions">
        <button className="icon-button" type="button" aria-label="Cari">
          <Search size={19} />
        </button>

        <button className="icon-button notification" type="button" aria-label="Notifikasi">
          <Bell size={19} />
        </button>

        {/* User profile dropdown */}
        <div
          className="user-profile"
          ref={dropdownRef}
          onClick={() => setShowDropdown((v) => !v)}
          aria-haspopup="true"
          aria-expanded={showDropdown}
        >
          <div className="avatar" title={user?.name}>
            {initials}
          </div>
          <div className="user-info">
            <strong>{user?.name || "Pengguna"}</strong>
            <span>{user?.role || user?.jabatan || "—"}</span>
          </div>
          <ChevronDown size={16} className={`chevron ${showDropdown ? "chevron-up" : ""}`} />

          {showDropdown && (
            <div className="user-dropdown" role="menu">
              <button
                role="menuitem"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/profile");
                  setShowDropdown(false);
                }}
              >
                <UserCircle size={15} />
                Profil Saya
              </button>
              <button
                role="menuitem"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/settings");
                  setShowDropdown(false);
                }}
              >
                <Settings size={15} />
                Pengaturan
              </button>
              <hr />
              <button
                className="logout-item"
                role="menuitem"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLogout();
                }}
              >
                <LogOut size={15} />
                Keluar
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
