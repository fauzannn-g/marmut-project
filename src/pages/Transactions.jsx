import { useState } from "react";
import { ShoppingCart, Plus, Trash2, CheckCircle } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import PageHeader from "../components/common/PageHeader";
import Button from "../components/common/Button";
import FormInput from "../components/common/FormInput";
import Modal from "../components/common/Modal";
import "./Transactions.css";

const daftarLayanan = [
  { id: "SRV-001", nama: "Ganti Oli Mesin", harga: 85000 },
  { id: "SRV-002", nama: "Tune Up Motor", harga: 150000 },
  { id: "SRV-003", nama: "Servis Karburator", harga: 175000 },
  { id: "SRV-004", nama: "Ganti Ban Depan", harga: 50000 },
  { id: "SRV-006", nama: "Servis Rem", harga: 120000 },
];

const daftarSparepart = [
  { id: "SP-001", nama: "Oli Mesin 10W-40", harga: 75000 },
  { id: "SP-002", nama: "Filter Udara Honda Beat", harga: 45000 },
  { id: "SP-003", nama: "Busi NGK CR8E", harga: 28000 },
  { id: "SP-004", nama: "Aki Yuasa YTZ5S", harga: 235000 },
];

const historyMock = [
  { id: "TRX-001", pelanggan: "Budi Santoso", tanggal: "09 Okt 2026", total: 260000, status: "selesai" },
  { id: "TRX-002", pelanggan: "Andi Wijaya", tanggal: "09 Okt 2026", total: 150000, status: "proses" },
  { id: "TRX-003", pelanggan: "Dewi Lestari", tanggal: "08 Okt 2026", total: 370000, status: "selesai" },
];

const statusMap = {
  selesai: { label: "Selesai", color: "#14966b", bg: "#e2f8ee" },
  proses: { label: "Proses", color: "#0877b3", bg: "#e5f4fd" },
  menunggu: { label: "Menunggu", color: "#b07d0a", bg: "#fff3dc" },
};

export default function Transactions() {
  const [namaPelanggan, setNamaPelanggan] = useState("");
  const [noPolisi, setNoPolisi] = useState("");
  const [items, setItems] = useState([]);
  const [selectedType, setSelectedType] = useState("layanan");
  const [selectedItem, setSelectedItem] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [history, setHistory] = useState(historyMock);
  const [lastTrx, setLastTrx] = useState(null);

  const catalog = selectedType === "layanan" ? daftarLayanan : daftarSparepart;

  const addItem = () => {
    const found = catalog.find((c) => c.id === selectedItem);
    if (!found) return;
    const exists = items.find((i) => i.id === found.id);
    if (exists) {
      setItems((prev) => prev.map((i) => i.id === found.id ? { ...i, qty: i.qty + 1 } : i));
    } else {
      setItems((prev) => [...prev, { ...found, qty: 1 }]);
    }
    setSelectedItem("");
  };

  const removeItem = (id) => setItems((prev) => prev.filter((i) => i.id !== id));
  const updateQty = (id, qty) => {
    if (qty < 1) { removeItem(id); return; }
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, qty } : i));
  };

  const subtotal = items.reduce((s, i) => s + i.harga * i.qty, 0);
  const biayaServis = Math.round(subtotal * 0.05);
  const total = subtotal + biayaServis;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (items.length === 0) { alert("Tambahkan minimal satu item!"); return; }
    const trx = {
      id: `TRX-${String(history.length + 1).padStart(3, "0")}`,
      pelanggan: namaPelanggan,
      noPolisi,
      items: [...items],
      subtotal,
      biayaServis,
      total,
      tanggal: new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
      status: "selesai",
    };
    setHistory((prev) => [trx, ...prev]);
    setLastTrx(trx);
    setSuccessModal(true);
    setNamaPelanggan("");
    setNoPolisi("");
    setItems([]);
  };

  return (
    <DashboardLayout title="Transaksi" subtitle="Buat dan kelola transaksi servis.">
      <PageHeader title="Transaksi Servis" description="Buat transaksi baru dan lihat riwayat transaksi." />

      <div className="trx-layout">
        {/* Form Transaksi */}
        <form className="trx-form-card" onSubmit={handleSubmit}>
          <div className="trx-form-section">
            <h3>Informasi Pelanggan</h3>
            <div className="form-row-2">
              <FormInput
                label="Nama Pelanggan"
                id="trx-nama"
                name="namaPelanggan"
                placeholder="Nama pelanggan"
                value={namaPelanggan}
                onChange={(e) => setNamaPelanggan(e.target.value)}
                required
              />
              <FormInput
                label="No. Polisi Kendaraan"
                id="trx-polisi"
                name="noPolisi"
                placeholder="Contoh: B 1234 ABC"
                value={noPolisi}
                onChange={(e) => setNoPolisi(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="trx-form-section">
            <h3>Tambah Item</h3>
            <div className="trx-add-item-row">
              <div className="trx-type-tabs">
                <button
                  type="button"
                  className={`type-tab ${selectedType === "layanan" ? "active" : ""}`}
                  onClick={() => { setSelectedType("layanan"); setSelectedItem(""); }}
                >
                  Layanan Servis
                </button>
                <button
                  type="button"
                  className={`type-tab ${selectedType === "sparepart" ? "active" : ""}`}
                  onClick={() => { setSelectedType("sparepart"); setSelectedItem(""); }}
                >
                  Sparepart
                </button>
              </div>

              <div className="trx-select-row">
                <select
                  className="trx-select"
                  value={selectedItem}
                  onChange={(e) => setSelectedItem(e.target.value)}
                >
                  <option value="">-- Pilih {selectedType === "layanan" ? "Layanan" : "Sparepart"} --</option>
                  {catalog.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nama} — {c.harga.toLocaleString("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 })}
                    </option>
                  ))}
                </select>
                <Button type="button" icon={<Plus size={16} />} onClick={addItem} disabled={!selectedItem}>
                  Tambah
                </Button>
              </div>
            </div>

            {/* Item List */}
            <div className="trx-items-list">
              {items.length === 0 ? (
                <div className="trx-empty">
                  <ShoppingCart size={32} />
                  <p>Belum ada item ditambahkan</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="trx-item-row">
                    <div className="trx-item-info">
                      <span className="trx-item-name">{item.nama}</span>
                      <span className="trx-item-price">
                        {item.harga.toLocaleString("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 })}
                      </span>
                    </div>
                    <div className="trx-item-controls">
                      <button type="button" className="qty-btn" onClick={() => updateQty(item.id, item.qty - 1)}>−</button>
                      <span className="qty-val">{item.qty}</span>
                      <button type="button" className="qty-btn" onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                      <span className="item-subtotal">
                        {(item.harga * item.qty).toLocaleString("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 })}
                      </span>
                      <button type="button" className="remove-item-btn" onClick={() => removeItem(item.id)}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="trx-summary">
            <div className="trx-summary-row"><span>Subtotal</span><span>{subtotal.toLocaleString("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 })}</span></div>
            <div className="trx-summary-row"><span>Biaya Admin (5%)</span><span>{biayaServis.toLocaleString("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 })}</span></div>
            <div className="trx-summary-row total-row"><span>Total</span><span>{total.toLocaleString("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 })}</span></div>
            <Button type="submit" size="lg" className="trx-submit-btn">
              Konfirmasi Transaksi
            </Button>
          </div>
        </form>

        {/* History */}
        <div className="trx-history-card">
          <h3>Riwayat Transaksi</h3>
          <p>Daftar transaksi yang telah diproses.</p>

          <div className="trx-history-list">
            {history.map((h) => {
              const s = statusMap[h.status] || statusMap.selesai;
              return (
                <div key={h.id} className="trx-history-item">
                  <div className="trx-hist-top">
                    <span className="trx-hist-id">{h.id}</span>
                    <span className="trx-hist-status" style={{ color: s.color, background: s.bg }}>{s.label}</span>
                  </div>
                  <div className="trx-hist-name">{h.pelanggan}</div>
                  <div className="trx-hist-bottom">
                    <span>{h.tanggal}</span>
                    <strong>{h.total.toLocaleString("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 })}</strong>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <Modal isOpen={successModal} onClose={() => setSuccessModal(false)} title="Transaksi Berhasil" size="sm">
        {lastTrx && (
          <div className="success-modal-body">
            <div className="success-icon"><CheckCircle size={48} /></div>
            <h3>Transaksi Dikonfirmasi!</h3>
            <p>Transaksi <strong>{lastTrx.id}</strong> atas nama <strong>{lastTrx.pelanggan}</strong> berhasil diproses.</p>
            <div className="success-total">
              {lastTrx.total.toLocaleString("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 })}
            </div>
            <Button onClick={() => setSuccessModal(false)} size="lg" className="success-close-btn">
              Tutup
            </Button>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
