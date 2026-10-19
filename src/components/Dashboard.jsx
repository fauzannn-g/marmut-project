import "./Dashboard.css";
import React, { useState } from "react";
import Sparepart from "./Sparepart";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  ClipboardList,
  BarChart3,
  Users,
  Settings,
  Bell,
  Search,
  Wrench,
  ChevronDown,
} from "lucide-react";

export default function Dashboard() {
  const [activePage, setActivePage] = useState("Dashboard");

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <Wrench size={25} />
          <div>
            <strong>Marmut</strong>
            <span>Bengkel Motor</span>
          </div>
        </div>

        <div className="sidebar-label">MENU UTAMA</div>

        <nav className="sidebar-nav">
          <a href="#" className="nav-item active">
            <LayoutDashboard size={19} />
            <span>Dashboard</span>
          </a>

          <a href="#" className="nav-item">
            <ShoppingCart size={19} />
            <span>Transaksi</span>
          </a>

          <a
            href="#"
            className={`nav-item ${activePage === "Data Sparepart" ? "active" : ""}`}
            onClick={(e) => {
                e.preventDefault();
                setActivePage("Data Sparepart");
            }}
            >
            <Package size={19} />
            <span>Data Sparepart</span>
        </a>

          <a href="#" className="nav-item">
            <ClipboardList size={19} />
            <span>Stok Barang</span>
          </a>

          <a href="#" className="nav-item">
            <BarChart3 size={19} />
            <span>Laporan</span>
          </a>

          <a href="#" className="nav-item">
            <Users size={19} />
            <span>Pengguna</span>
          </a>
        </nav>

        <div className="sidebar-bottom">
          <a href="#" className="nav-item">
            <Settings size={19} />
            <span>Pengaturan</span>
          </a>
          <p>© 2026 Marmut Project</p>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="topbar">
          <div>
            <h2>Dashboard</h2>
            <p>Selamat datang di sistem kasir bengkel.</p>
          </div>

          <div className="topbar-actions">
            <button className="icon-button" type="button">
              <Search size={19} />
            </button>
            <button className="icon-button notification" type="button">
              <Bell size={19} />
            </button>
            <div className="user-profile">
              <div className="avatar">A</div>
              <div className="user-info">
                <strong>Administrator</strong>
                <span>Admin</span>
              </div>
              <ChevronDown size={16} />
            </div>
          </div>
        </header>

        {activePage === "Data Sparepart" ? (
        <Sparepart />
        ) : ( 
        <section className="dashboard-content">
          <div className="page-heading">
            <div>
              <h1>Ringkasan Bengkel</h1>
              <p>Pantau aktivitas dan kondisi bengkel hari ini.</p>
            </div>
            <span className="date-badge">
              {new Date().toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon blue">
                <ShoppingCart size={22} />
              </div>
              <p>Total Transaksi</p>
              <h2>0</h2>
              <span>Transaksi hari ini</span>
            </div>

            <div className="stat-card">
              <div className="stat-icon green">
                <BarChart3 size={22} />
              </div>
              <p>Total Penjualan</p>
              <h2>Rp0</h2>
              <span>Penjualan hari ini</span>
            </div>

            <div className="stat-card">
              <div className="stat-icon orange">
                <Package size={22} />
              </div>
              <p>Total Sparepart</p>
              <h2>0</h2>
              <span>Jenis barang terdaftar</span>
            </div>

            <div className="stat-card">
              <div className="stat-icon red">
                <ClipboardList size={22} />
              </div>
              <p>Stok Menipis</p>
              <h2>0</h2>
              <span>Barang perlu diperiksa</span>
            </div>
          </div>

          <div className="dashboard-panels">
            <section className="panel">
              <div className="panel-header">
                <div>
                  <h3>Transaksi Terbaru</h3>
                  <p>Daftar transaksi penjualan terkini.</p>
                </div>
                <button className="text-button" type="button">
                  Lihat semua
                </button>
              </div>

              <div className="empty-state">
                <ShoppingCart size={35} />
                <strong>Belum ada transaksi</strong>
                <span>Transaksi yang tercatat akan muncul di sini.</span>
              </div>
            </section>

            <section className="panel">
              <div className="panel-header">
                <div>
                  <h3>Informasi Stok</h3>
                  <p>Status persediaan sparepart.</p>
                </div>
                <Package size={20} />
              </div>

              <div className="stock-summary">
                <div>
                  <span className="stock-dot green-dot" />
                  <span>Stok tersedia</span>
                  <strong>0</strong>
                </div>
                <div>
                  <span className="stock-dot orange-dot" />
                  <span>Stok menipis</span>
                  <strong>0</strong>
                </div>
                <div>
                  <span className="stock-dot red-dot" />
                  <span>Stok habis</span>
                  <strong>0</strong>
                </div>
              </div>
            </section>
          </div>
        </section>
        )}
      </main>
    </div>
  );
}
