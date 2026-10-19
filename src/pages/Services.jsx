import { useState } from "react";
import { Wrench, Plus, Clock, Star } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import PageHeader from "../components/common/PageHeader";
import DataTable from "../components/common/DataTable";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import FormInput from "../components/common/FormInput";
import StatusBadge from "../components/common/StatusBadge";
import "./Services.css";

const initialServices = [
  { kode: "SRV-001", nama: "Ganti Oli Mesin", kategori: "Perawatan", harga: 85000, durasi: "30 menit", status: "aktif" },
  { kode: "SRV-002", nama: "Tune Up Motor", kategori: "Perawatan", harga: 150000, durasi: "60 menit", status: "aktif" },
  { kode: "SRV-003", nama: "Servis Karburator", kategori: "Perbaikan", harga: 175000, durasi: "90 menit", status: "aktif" },
  { kode: "SRV-004", nama: "Ganti Ban Depan", kategori: "Penggantian", harga: 50000, durasi: "30 menit", status: "aktif" },
  { kode: "SRV-005", nama: "Cek & Isi Aki", kategori: "Perawatan", harga: 35000, durasi: "15 menit", status: "nonaktif" },
  { kode: "SRV-006", nama: "Servis Rem", kategori: "Perbaikan", harga: 120000, durasi: "45 menit", status: "aktif" },
];

const emptyForm = { kode: "", nama: "", kategori: "Perawatan", harga: "", durasi: "", status: "aktif" };

export default function Services() {
  const [services, setServices] = useState(initialServices);
  const [modal, setModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const openAdd = () => { setEditTarget(null); setForm(emptyForm); setModal(true); };
  const openEdit = (row, idx) => {
    setEditTarget(idx);
    setForm({ kode: row.kode, nama: row.nama, kategori: row.kategori, harga: String(row.harga), durasi: row.durasi, status: row.status });
    setModal(true);
  };
  const closeModal = () => setModal(false);
  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const entry = { ...form, harga: Number(form.harga) };
    if (editTarget !== null) {
      setServices((prev) => prev.map((s, i) => (i === editTarget ? { ...s, ...entry } : s)));
    } else {
      setServices((prev) => [...prev, { ...entry, kode: `SRV-${String(prev.length + 1).padStart(3, "0")}` }]);
    }
    closeModal();
  };

  const handleDelete = (row, idx) => {
    if (window.confirm(`Hapus layanan "${row.nama}"?`)) {
      setServices((prev) => prev.filter((_, i) => i !== idx));
    }
  };

  const columns = [
    { key: "kode", label: "Kode" },
    { key: "nama", label: "Nama Layanan" },
    { key: "kategori", label: "Kategori", render: (v) => <span className="srv-cat-badge">{v}</span> },
    { key: "harga", label: "Harga", render: (v) => v.toLocaleString("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }) },
    { key: "durasi", label: "Estimasi", render: (v) => <span className="srv-duration"><Clock size={13} /> {v}</span> },
    {
      key: "status", label: "Status",
      render: (v) => (
        <StatusBadge status={v === "aktif" ? "success" : "neutral"}>
          {v === "aktif" ? "Aktif" : "Nonaktif"}
        </StatusBadge>
      ),
    },
  ];

  const aktif = services.filter((s) => s.status === "aktif").length;

  return (
    <DashboardLayout title="Jasa Servis" subtitle="Kelola layanan servis bengkel.">
      <PageHeader
        title="Jasa Servis"
        description="Daftar layanan servis yang ditawarkan bengkel."
        action={
          <Button icon={<Plus size={16} />} onClick={openAdd}>
            Tambah Layanan
          </Button>
        }
      />

      <div className="srv-summary-row">
        <SrvSummary icon={<Wrench size={20} />} color="blue" label="Total Layanan" val={services.length} />
        <SrvSummary icon={<Star size={20} />} color="green" label="Layanan Aktif" val={aktif} />
        <SrvSummary icon={<Clock size={20} />} color="orange" label="Layanan Nonaktif" val={services.length - aktif} />
      </div>

      <DataTable
        columns={columns}
        data={services}
        onEdit={openEdit}
        onDelete={handleDelete}
        searchPlaceholder="Cari nama atau kode layanan..."
        searchKeys={["kode", "nama", "kategori"]}
        emptyIcon={<Wrench size={36} />}
        emptyTitle="Belum ada layanan"
        emptyDescription="Tambahkan layanan untuk ditawarkan ke pelanggan."
        footerLabel="layanan"
      />

      <Modal
        isOpen={modal}
        onClose={closeModal}
        title={editTarget !== null ? "Edit Layanan" : "Tambah Layanan"}
      >
        <form className="modal-form" onSubmit={handleSubmit}>
          <FormInput label="Nama Layanan" id="srv-nama" name="nama" placeholder="Contoh: Ganti Oli Mesin" value={form.nama} onChange={handleChange} required />
          <div className="form-row-2">
            <FormInput label="Kategori" id="srv-kat" type="select" name="kategori" value={form.kategori} onChange={handleChange} options={["Perawatan", "Perbaikan", "Penggantian", "Pemeriksaan"]} />
            <FormInput label="Durasi Estimasi" id="srv-dur" name="durasi" placeholder="Contoh: 30 menit" value={form.durasi} onChange={handleChange} required />
          </div>
          <div className="form-row-2">
            <FormInput label="Harga (Rp)" id="srv-harga" type="number" name="harga" placeholder="0" min="0" value={form.harga} onChange={handleChange} required />
            <FormInput label="Status" id="srv-status" type="select" name="status" value={form.status} onChange={handleChange} options={[{ value: "aktif", label: "Aktif" }, { value: "nonaktif", label: "Nonaktif" }]} />
          </div>
          <div className="modal-actions">
            <Button variant="secondary" onClick={closeModal} type="button">Batal</Button>
            <Button type="submit">{editTarget !== null ? "Simpan" : "Tambah Layanan"}</Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}

function SrvSummary({ icon, color, label, val }) {
  return (
    <div className="srv-summary-card">
      <div className={`srv-summary-icon icon-${color}`}>{icon}</div>
      <div>
        <p>{label}</p>
        <strong>{val}</strong>
      </div>
    </div>
  );
}
