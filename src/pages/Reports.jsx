import { useState } from "react";
import { FileText, Download, Calendar, TrendingUp, ShoppingCart, BarChart3 } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import PageHeader from "../components/common/PageHeader";
import Button from "../components/common/Button";
import StatusBadge from "../components/common/StatusBadge";
import "./Reports.css";

const mockReport = [
  { id: "TRX-001", tanggal: "09 Okt 2026", pelanggan: "Budi Santoso", layanan: "Ganti Oli + Filter", total: 185000, status: "selesai" },
  { id: "TRX-002", tanggal: "09 Okt 2026", pelanggan: "Andi Wijaya", layanan: "Tune Up Motor", total: 250000, status: "proses" },
  { id: "TRX-003", tanggal: "08 Okt 2026", pelanggan: "Dewi Lestari", layanan: "Ganti Ban Depan", total: 320000, status: "selesai" },
  { id: "TRX-004", tanggal: "08 Okt 2026", pelanggan: "Roni Setiawan", layanan: "Servis Karburator", total: 175000, status: "menunggu" },
  { id: "TRX-005", tanggal: "07 Okt 2026", pelanggan: "Sari Putri", layanan: "Servis Rem", total: 120000, status: "selesai" },
  { id: "TRX-006", tanggal: "07 Okt 2026", pelanggan: "Hendra Gunawan", layanan: "Cek & Isi Aki", total: 35000, status: "selesai" },
];

const statusMap = {
  selesai: "success",
  proses: "info",
  menunggu: "warning",
};

export default function Reports() {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [filterStatus, setFilterStatus] = useState("semua");

  const filtered = mockReport.filter((r) => {
    if (filterStatus !== "semua" && r.status !== filterStatus) return false;
    return true;
  });

  const totalPendapatan = filtered.filter((r) => r.status === "selesai").reduce((s, r) => s + r.total, 0);
  const totalTransaksi = filtered.length;
  const selesai = filtered.filter((r) => r.status === "selesai").length;
  const rataRata = selesai > 0 ? Math.round(totalPendapatan / selesai) : 0;

  return (
    <DashboardLayout title="Laporan" subtitle="Ringkasan dan laporan transaksi bengkel.">
      <PageHeader
        title="Laporan Transaksi"
        description="Pantau pendapatan dan statistik transaksi bengkel."
        action={
          <Button variant="secondary" icon={<Download size={16} />}>
            Unduh Laporan
          </Button>
        }
      />

      {/* Stats */}
      <div className="rpt-stats">
        <RptStat icon={<ShoppingCart size={20} />} color="blue" label="Total Transaksi" val={totalTransaksi} />
        <RptStat icon={<TrendingUp size={20} />} color="green" label="Total Pendapatan" val={`Rp${(totalPendapatan / 1000).toFixed(0)} Rb`} />
        <RptStat icon={<BarChart3 size={20} />} color="orange" label="Transaksi Selesai" val={selesai} />
        <RptStat icon={<FileText size={20} />} color="purple" label="Rata-rata Nilai" val={`Rp${(rataRata / 1000).toFixed(0)} Rb`} />
      </div>

      {/* Filter */}
      <div className="rpt-filters">
        <div className="rpt-filter-group">
          <label htmlFor="rpt-from"><Calendar size={14} /> Dari Tanggal</label>
          <input id="rpt-from" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="rpt-date-input" />
        </div>
        <div className="rpt-filter-group">
          <label htmlFor="rpt-to"><Calendar size={14} /> Sampai Tanggal</label>
          <input id="rpt-to" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="rpt-date-input" />
        </div>
        <div className="rpt-filter-group">
          <label htmlFor="rpt-status">Status</label>
          <select id="rpt-status" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="rpt-date-input">
            <option value="semua">Semua Status</option>
            <option value="selesai">Selesai</option>
            <option value="proses">Proses</option>
            <option value="menunggu">Menunggu</option>
          </select>
        </div>
        <Button variant="secondary" className="rpt-filter-btn">Terapkan Filter</Button>
      </div>

      {/* Table */}
      <div className="rpt-table-card">
        <div className="rpt-table-header">
          <h3>Detail Transaksi</h3>
          <span>{filtered.length} transaksi ditemukan</span>
        </div>
        <div className="rpt-table-wrapper">
          <table className="rpt-table">
            <thead>
              <tr>
                <th>ID Transaksi</th>
                <th>Tanggal</th>
                <th>Pelanggan</th>
                <th>Layanan</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="rpt-empty">
                    <FileText size={32} />
                    <p>Tidak ada transaksi yang cocok</p>
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id}>
                    <td className="rpt-trx-id">{r.id}</td>
                    <td>{r.tanggal}</td>
                    <td>{r.pelanggan}</td>
                    <td>{r.layanan}</td>
                    <td className="rpt-total">
                      {r.total.toLocaleString("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 })}
                    </td>
                    <td>
                      <StatusBadge status={statusMap[r.status] || "neutral"}>
                        {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                      </StatusBadge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {filtered.length > 0 && (
              <tfoot>
                <tr className="rpt-tfoot-row">
                  <td colSpan="4"><strong>Total Pendapatan (Selesai)</strong></td>
                  <td className="rpt-total">
                    <strong>
                      {totalPendapatan.toLocaleString("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 })}
                    </strong>
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}

function RptStat({ icon, color, label, val }) {
  return (
    <div className="rpt-stat-card">
      <div className={`rpt-stat-icon icon-${color}`}>{icon}</div>
      <div>
        <p>{label}</p>
        <strong>{val}</strong>
      </div>
    </div>
  );
}
