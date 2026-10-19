/**
 * Sidebar.jsx
 * Navigasi samping dengan link ke semua halaman.
 * Tombol Keluar memanggil AuthContext logout.
 */
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  Tags,
  Wrench,
  ClipboardList,
  FileText,
  UserCircle,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import "./Sidebar.css";

const menuItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Data Pengguna", path: "/users", icon: Users },
  { label: "Kategori Barang", path: "/categories", icon: Tags },
  { label: "Inventaris & Stok", path: "/inventory", icon: Package },
  { label: "Jasa Servis", path: "/services", icon: Wrench },
  { label: "Transaksi", path: "/transactions", icon: ClipboardList },
  { label: "Laporan", path: "/reports", icon: FileText },
];

const bottomItems = [
  { label: "Profil Saya", path: "/profile", icon: UserCircle },
  // { label: "Pengaturan", path: "/settings", icon: Settings },
];

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <Wrench size={25} />
        <div>
          <strong>Marmut</strong>
          <span>Bengkel Motor</span>
        </div>
      </div>

      <div className="sidebar-section-label">Menu Utama</div>

      <nav className="sidebar-nav">
        {menuItems.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-section-label" style={{ marginBottom: "8px" }}>
          Akun
        </div>
        <nav className="sidebar-nav">
          {bottomItems.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}

          {/* Tombol Keluar */}
          <button
            type="button"
            className="sidebar-link sidebar-logout-btn"
            onClick={handleLogout}
            title="Keluar dari aplikasi"
          >
            <LogOut size={18} />
            <span>Keluar</span>
          </button>
        </nav>
        <p className="sidebar-footer-text">© 2026 Marmut Project</p>
      </div>
    </aside>
  );
}
