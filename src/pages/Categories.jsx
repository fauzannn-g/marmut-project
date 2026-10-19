import { useState } from "react";
import { Tags, Plus } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import PageHeader from "../components/common/PageHeader";
import DataTable from "../components/common/DataTable";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import FormInput from "../components/common/FormInput";
import "./Categories.css";

const initialCategories = [
  { kode: "KAT-001", nama: "Oli & Pelumas", deskripsi: "Oli mesin, oli gardan, pelumas rantai", jumlahBarang: 12 },
  { kode: "KAT-002", nama: "Aki & Baterai", deskripsi: "Aki basah, aki kering, aki maintenance free", jumlahBarang: 8 },
  { kode: "KAT-003", nama: "Ban & Velg", deskripsi: "Ban dalam, ban luar, velg motor", jumlahBarang: 15 },
  { kode: "KAT-004", nama: "Filter", deskripsi: "Filter udara, filter oli, filter bensin", jumlahBarang: 10 },
  { kode: "KAT-005", nama: "Busi & Pengapian", deskripsi: "Busi, koil pengapian, kabel busi", jumlahBarang: 7 },
];

const emptyForm = { kode: "", nama: "", deskripsi: "" };

export default function Categories() {
  const [cats, setCats] = useState(initialCategories);
  const [modal, setModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const openAdd = () => { setEditTarget(null); setForm(emptyForm); setModal(true); };
  const openEdit = (row, idx) => { setEditTarget(idx); setForm({ kode: row.kode, nama: row.nama, deskripsi: row.deskripsi }); setModal(true); };
  const closeModal = () => setModal(false);
  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editTarget !== null) {
      setCats((prev) => prev.map((c, i) => (i === editTarget ? { ...c, ...form } : c)));
    } else {
      setCats((prev) => [
        ...prev,
        { ...form, kode: `KAT-${String(prev.length + 1).padStart(3, "0")}`, jumlahBarang: 0 },
      ]);
    }
    closeModal();
  };

  const handleDelete = (row, idx) => {
    if (window.confirm(`Hapus kategori "${row.nama}"?`)) {
      setCats((prev) => prev.filter((_, i) => i !== idx));
    }
  };

  const columns = [
    { key: "kode", label: "Kode" },
    { key: "nama", label: "Nama Kategori" },
    { key: "deskripsi", label: "Deskripsi" },
    {
      key: "jumlahBarang", label: "Jumlah Barang",
      render: (v) => <span className="item-count-badge">{v} item</span>,
    },
  ];

  return (
    <DashboardLayout title="Kategori Barang" subtitle="Kelola kategori sparepart.">
      <PageHeader
        title="Kategori Barang"
        description="Daftar kategori sparepart yang tersedia."
        action={
          <Button icon={<Plus size={16} />} onClick={openAdd}>
            Tambah Kategori
          </Button>
        }
      />

      <div className="cat-summary-row">
        <div className="cat-summary-card">
          <div className="cat-summary-icon"><Tags size={22} /></div>
          <div>
            <p>Total Kategori</p>
            <strong>{cats.length}</strong>
          </div>
        </div>
        <div className="cat-summary-card">
          <div className="cat-summary-icon green-icon"><Plus size={22} /></div>
          <div>
            <p>Total Barang</p>
            <strong>{cats.reduce((s, c) => s + (c.jumlahBarang || 0), 0)}</strong>
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={cats}
        onEdit={openEdit}
        onDelete={handleDelete}
        searchPlaceholder="Cari nama atau kode kategori..."
        searchKeys={["kode", "nama"]}
        emptyIcon={<Tags size={36} />}
        emptyTitle="Belum ada kategori"
        emptyDescription="Tambahkan kategori untuk mengelompokkan sparepart."
        footerLabel="kategori"
      />

      <Modal
        isOpen={modal}
        onClose={closeModal}
        title={editTarget !== null ? "Edit Kategori" : "Tambah Kategori"}
      >
        <form className="modal-form" onSubmit={handleSubmit}>
          <FormInput label="Nama Kategori" id="kat-nama" name="nama" placeholder="Contoh: Oli & Pelumas" value={form.nama} onChange={handleChange} required />
          <FormInput label="Deskripsi" id="kat-desc" type="textarea" name="deskripsi" placeholder="Deskripsi singkat kategori..." value={form.deskripsi} onChange={handleChange} rows={3} />
          <div className="modal-actions">
            <Button variant="secondary" onClick={closeModal} type="button">Batal</Button>
            <Button type="submit">{editTarget !== null ? "Simpan" : "Tambah Kategori"}</Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
