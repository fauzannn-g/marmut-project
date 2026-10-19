import { useState } from "react";
import { Package, Plus, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import PageHeader from "../components/common/PageHeader";
import DataTable from "../components/common/DataTable";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import FormInput from "../components/common/FormInput";
import StatusBadge from "../components/common/StatusBadge";
import "./Inventory.css";

const initialItems = [
  { kode: "SP-001", nama: "Oli Mesin 10W-40", kategori: "Oli & Pelumas", harga: 75000, stok: 24, satuan: "Liter", stokMin: 5 },
  { kode: "SP-002", nama: "Filter Udara Honda Beat", kategori: "Filter", harga: 45000, stok: 3, satuan: "Pcs", stokMin: 5 },
  { kode: "SP-003", nama: "Busi NGK CR8E", kategori: "Busi & Pengapian", harga: 28000, stok: 0, satuan: "Pcs", stokMin: 3 },
  { kode: "SP-004", nama: "Aki Yuasa YTZ5S", kategori: "Aki & Baterai", harga: 235000, stok: 10, satuan: "Unit", stokMin: 2 },
  { kode: "SP-005", nama: "Ban Luar IRC 80/90-14", kategori: "Ban & Velg", harga: 195000, stok: 8, satuan: "Pcs", stokMin: 3 },
  { kode: "SP-006", nama: "Rantai Motor 428H", kategori: "Transmisi", harga: 120000, stok: 2, satuan: "Set", stokMin: 3 },
];

const emptyForm = { kode: "", nama: "", kategori: "", harga: "", stok: "", satuan: "Pcs", stokMin: "5" };

function getStockStatus(stok, min) {
  if (stok === 0) return "danger";
  if (stok <= min) return "warning";
  return "success";
}

function getStockLabel(stok, min) {
  if (stok === 0) return "Habis";
  if (stok <= min) return "Menipis";
  return "Tersedia";
}

export default function Inventory() {
  const [items, setItems] = useState(initialItems);
  const [modal, setModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const openAdd = () => { setEditTarget(null); setForm(emptyForm); setModal(true); };
  const openEdit = (row, idx) => {
    setEditTarget(idx);
    setForm({ kode: row.kode, nama: row.nama, kategori: row.kategori, harga: String(row.harga), stok: String(row.stok), satuan: row.satuan, stokMin: String(row.stokMin) });
    setModal(true);
  };
  const closeModal = () => setModal(false);
  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const entry = { ...form, harga: Number(form.harga), stok: Number(form.stok), stokMin: Number(form.stokMin) };
    if (editTarget !== null) {
      setItems((prev) => prev.map((it, i) => (i === editTarget ? { ...it, ...entry } : it)));
    } else {
      setItems((prev) => [...prev, entry]);
    }
    closeModal();
  };

  const handleDelete = (row, idx) => {
    if (window.confirm(`Hapus item "${row.nama}"?`)) {
      setItems((prev) => prev.filter((_, i) => i !== idx));
    }
  };

  const columns = [
    { key: "kode", label: "Kode" },
    { key: "nama", label: "Nama Barang" },
    { key: "kategori", label: "Kategori" },
    { key: "harga", label: "Harga", render: (v) => v.toLocaleString("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }) },
    { key: "stok", label: "Stok", render: (v, row) => <span className={`stok-num ${getStockStatus(v, row.stokMin)}`}>{v} {row.satuan}</span> },
    {
      key: "status", label: "Status",
      render: (_, row) => (
        <StatusBadge status={getStockStatus(row.stok, row.stokMin)}>
          {getStockLabel(row.stok, row.stokMin)}
        </StatusBadge>
      ),
    },
  ];

  const tersedia = items.filter((i) => i.stok > i.stokMin).length;
  const menipis = items.filter((i) => i.stok > 0 && i.stok <= i.stokMin).length;
  const habis = items.filter((i) => i.stok === 0).length;

  return (
    <DashboardLayout title="Inventaris & Stok" subtitle="Kelola data dan persediaan sparepart bengkel.">
      <PageHeader
        title="Inventaris & Stok"
        description="Daftar sparepart dan status ketersediaan stok."
        action={
          <Button icon={<Plus size={16} />} onClick={openAdd}>
            Tambah Barang
          </Button>
        }
      />

      <div className="inv-summary-row">
        <InvSummary icon={<Package size={20} />} color="blue" label="Total Jenis" val={items.length} />
        <InvSummary icon={<CheckCircle size={20} />} color="green" label="Stok Tersedia" val={tersedia} />
        <InvSummary icon={<AlertTriangle size={20} />} color="orange" label="Stok Menipis" val={menipis} />
        <InvSummary icon={<XCircle size={20} />} color="red" label="Stok Habis" val={habis} />
      </div>

      <DataTable
        columns={columns}
        data={items}
        onEdit={openEdit}
        onDelete={handleDelete}
        searchPlaceholder="Cari kode atau nama barang..."
        searchKeys={["kode", "nama", "kategori"]}
        emptyIcon={<Package size={36} />}
        emptyTitle="Belum ada barang"
        emptyDescription="Tambahkan barang untuk mengelola inventaris."
        footerLabel="barang"
      />

      <Modal
        isOpen={modal}
        onClose={closeModal}
        title={editTarget !== null ? "Edit Barang" : "Tambah Barang"}
        size="lg"
      >
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-row-2">
            <FormInput label="Kode Barang" id="inv-kode" name="kode" placeholder="SP-001" value={form.kode} onChange={handleChange} required />
            <FormInput label="Nama Barang" id="inv-nama" name="nama" placeholder="Nama sparepart" value={form.nama} onChange={handleChange} required />
          </div>
          <div className="form-row-2">
            <FormInput label="Kategori" id="inv-kat" name="kategori" placeholder="Contoh: Oli & Pelumas" value={form.kategori} onChange={handleChange} required />
            <FormInput label="Satuan" id="inv-sat" type="select" name="satuan" value={form.satuan} onChange={handleChange} options={["Pcs", "Liter", "Set", "Unit", "Meter", "Kg"]} />
          </div>
          <div className="form-row-3">
            <FormInput label="Harga (Rp)" id="inv-harga" type="number" name="harga" placeholder="0" min="0" value={form.harga} onChange={handleChange} required />
            <FormInput label="Stok" id="inv-stok" type="number" name="stok" placeholder="0" min="0" value={form.stok} onChange={handleChange} required />
            <FormInput label="Stok Minimum" id="inv-min" type="number" name="stokMin" placeholder="5" min="0" value={form.stokMin} onChange={handleChange} required />
          </div>
          <div className="modal-actions">
            <Button variant="secondary" onClick={closeModal} type="button">Batal</Button>
            <Button type="submit">{editTarget !== null ? "Simpan" : "Tambah Barang"}</Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}

function InvSummary({ icon, color, label, val }) {
  return (
    <div className="inv-summary-card">
      <div className={`inv-summary-icon icon-${color}`}>{icon}</div>
      <div>
        <p>{label}</p>
        <strong>{val}</strong>
      </div>
    </div>
  );
}
