import { useState } from "react";
import {
  ShoppingCart,
  BarChart3,
  Package,
  ClipboardList,
  Users,
  Wrench,
  TrendingUp,
} from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import "./Dashboard.css";

const mockTransactions = [
  { id: "TRX-001", pelanggan: "Budi Santoso", layanan: "Ganti Oli + Filter", total: 185000, tanggal: "09 Okt 2026", status: "selesai" },
  { id: "TRX-002", pelanggan: "Andi Wijaya", layanan: "Tune Up Motor", total: 250000, tanggal: "09 Okt 2026", status: "proses" },
  { id: "TRX-003", pelanggan: "Dewi Lestari", layanan: "Ganti Ban Depan", total: 320000, tanggal: "08 Okt 2026", status: "selesai" },
  { id: "TRX-004", pelanggan: "Roni Setiawan", layanan: "Servis Karburator", total: 175000, tanggal: "08 Okt 2026", status: "menunggu" },
];

const statusStyle = {
  selesai: { color: "#14966b", bg: "#e2f8ee", label: "Selesai" },
  proses: { color: "#0877b3", bg: "#e5f4fd", label: "Proses" },
  menunggu: { color: "#b07d0a", bg: "#fff3dc", label: "Menunggu" },
};

export default function Dashboard() {
  return (
    <DashboardLayout
      title="Dashboard"
      subtitle="Selamat datang di sistem kasir bengkel."
    >
      <div className="dash-page">
        {/* Heading */}
        <div className="dash-heading">
          <div>
            <h1>Ringkasan Bengkel</h1>
            <p>Pantau aktivitas dan kondisi bengkel hari ini.</p>
          </div>
          <span className="dash-date">
            {new Date().toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>

        {/* Stats */}
        <div className="dash-stats">
          <StatCard icon={<ShoppingCart size={22} />} color="blue" label="Total Transaksi" value="24" sub="Transaksi hari ini" />
          <StatCard icon={<BarChart3 size={22} />} color="green" label="Total Penjualan" value="Rp4,2 Jt" sub="Penjualan hari ini" />
          <StatCard icon={<Package size={22} />} color="orange" label="Total Sparepart" value="138" sub="Jenis barang terdaftar" />
          <StatCard icon={<ClipboardList size={22} />} color="red" label="Stok Menipis" value="7" sub="Barang perlu diperiksa" />
        </div>

        {/* Panels */}
        <div className="dash-panels">
          {/* Recent Transactions */}
          <section className="dash-panel">
            <div className="panel-hdr">
              <div>
                <h3>Transaksi Terbaru</h3>
                <p>Daftar transaksi penjualan terkini.</p>
              </div>
              <button className="text-btn" type="button">Lihat semua</button>
            </div>

            <div className="recent-table-wrapper">
              <table className="recent-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Pelanggan</th>
                    <th>Layanan</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockTransactions.map((t) => {
                    const s = statusStyle[t.status];
                    return (
                      <tr key={t.id}>
                        <td className="trx-id">{t.id}</td>
                        <td>{t.pelanggan}</td>
                        <td>{t.layanan}</td>
                        <td className="trx-amount">
                          {t.total.toLocaleString("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 })}
                        </td>
                        <td>
                          <span className="status-pill" style={{ color: s.color, background: s.bg }}>
                            {s.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* Right column */}
          <div className="dash-right-col">
            {/* Stock info */}
            <section className="dash-panel">
              <div className="panel-hdr">
                <div>
                  <h3>Informasi Stok</h3>
                  <p>Status persediaan sparepart.</p>
                </div>
                <Package size={20} color="#64748b" />
              </div>
              <div className="stock-list">
                {[
                  { dot: "green-dot", label: "Stok tersedia", val: 112 },
                  { dot: "orange-dot", label: "Stok menipis", val: 7 },
                  { dot: "red-dot", label: "Stok habis", val: 2 },
                ].map((s) => (
                  <div key={s.label} className="stock-row">
                    <span className={`stock-dot ${s.dot}`} />
                    <span>{s.label}</span>
                    <strong>{s.val}</strong>
                  </div>
                ))}
              </div>
            </section>

            {/* Quick info */}
            <section className="dash-panel">
              <div className="panel-hdr">
                <div>
                  <h3>Info Cepat</h3>
                  <p>Ringkasan singkat hari ini.</p>
                </div>
                <TrendingUp size={20} color="#64748b" />
              </div>
              <div className="quick-list">
                <QuickItem icon={<Users size={16} />} label="Pelanggan Hari Ini" val="8 orang" />
                <QuickItem icon={<Wrench size={16} />} label="Antrian Servis" val="3 motor" />
                <QuickItem icon={<ShoppingCart size={16} />} label="Penjualan Sparepart" val="Rp1,8 Jt" />
              </div>
            </section>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ icon, color, label, value, sub }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon icon-${color}`}>{icon}</div>
      <p className="stat-label">{label}</p>
      <h2 className="stat-value">{value}</h2>
      <span className="stat-sub">{sub}</span>
    </div>
  );
}

function QuickItem({ icon, label, val }) {
  return (
    <div className="quick-item">
      <span className="quick-icon">{icon}</span>
      <span className="quick-label">{label}</span>
      <strong className="quick-val">{val}</strong>
    </div>
  );
}
