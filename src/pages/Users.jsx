import { useState } from "react";
import { Users as UsersIcon, Plus, UserCheck, UserX } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import PageHeader from "../components/common/PageHeader";
import DataTable from "../components/common/DataTable";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import FormInput from "../components/common/FormInput";
import StatusBadge from "../components/common/StatusBadge";
import "./Users.css";

const initialUsers = [
  { id: "USR-001", nama: "Administrator", email: "admin@marmut.id", peran: "Admin", status: "aktif", bergabung: "01 Jan 2026" },
  { id: "USR-002", nama: "Budi Mekanik", email: "budi@marmut.id", peran: "Kasir", status: "aktif", bergabung: "15 Feb 2026" },
  { id: "USR-003", nama: "Sari Kasir", email: "sari@marmut.id", peran: "Kasir", status: "nonaktif", bergabung: "20 Mar 2026" },
];

const emptyForm = { nama: "", email: "", peran: "Kasir", status: "aktif" };

export default function Users() {
  const [users, setUsers] = useState(initialUsers);
  const [modal, setModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const openAdd = () => { setEditTarget(null); setForm(emptyForm); setModal(true); };
  const openEdit = (row, idx) => { setEditTarget(idx); setForm({ ...row }); setModal(true); };
  const closeModal = () => setModal(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editTarget !== null) {
      setUsers((prev) => prev.map((u, i) => (i === editTarget ? { ...u, ...form } : u)));
    } else {
      setUsers((prev) => [
        ...prev,
        { ...form, id: `USR-${String(prev.length + 1).padStart(3, "0")}`, bergabung: new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) },
      ]);
    }
    closeModal();
  };

  const handleDelete = (row, idx) => {
    if (window.confirm(`Hapus pengguna "${row.nama}"?`)) {
      setUsers((prev) => prev.filter((_, i) => i !== idx));
    }
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "nama", label: "Nama" },
    { key: "email", label: "Email" },
    { key: "peran", label: "Peran", render: (v) => <span className="role-badge">{v}</span> },
    {
      key: "status", label: "Status",
      render: (v) => (
        <StatusBadge status={v === "aktif" ? "success" : "danger"}>
          {v === "aktif" ? "Aktif" : "Nonaktif"}
        </StatusBadge>
      ),
    },
    { key: "bergabung", label: "Bergabung" },
  ];

  const aktif = users.filter((u) => u.status === "aktif").length;
  const nonaktif = users.length - aktif;

  return (
    <DashboardLayout title="Data Pengguna" subtitle="Kelola akun pengguna sistem.">
      <PageHeader
        title="Data Pengguna"
        description="Daftar pengguna yang terdaftar dalam sistem."
        action={
          <Button icon={<Plus size={16} />} onClick={openAdd}>
            Tambah Pengguna
          </Button>
        }
      />

      {/* Summary */}
      <div className="user-summary-row">
        <SummaryCard icon={<UsersIcon size={20} />} color="blue" label="Total Pengguna" val={users.length} />
        <SummaryCard icon={<UserCheck size={20} />} color="green" label="Pengguna Aktif" val={aktif} />
        <SummaryCard icon={<UserX size={20} />} color="red" label="Tidak Aktif" val={nonaktif} />
      </div>

      <DataTable
        columns={columns}
        data={users}
        onEdit={openEdit}
        onDelete={handleDelete}
        searchPlaceholder="Cari nama atau email..."
        searchKeys={["nama", "email", "peran"]}
        emptyIcon={<UsersIcon size={36} />}
        emptyTitle="Belum ada pengguna"
        emptyDescription="Tambahkan pengguna baru untuk memulai."
        footerLabel="pengguna"
      />

      {/* Modal */}
      <Modal
        isOpen={modal}
        onClose={closeModal}
        title={editTarget !== null ? "Edit Pengguna" : "Tambah Pengguna"}
      >
        <form className="modal-form" onSubmit={handleSubmit}>
          <FormInput label="Nama Lengkap" id="nama" name="nama" placeholder="Contoh: Budi Santoso" value={form.nama} onChange={handleChange} required />
          <FormInput label="Email" id="email" type="email" name="email" placeholder="nama@email.com" value={form.email} onChange={handleChange} required />
          <FormInput
            label="Peran"
            id="peran"
            type="select"
            name="peran"
            value={form.peran}
            onChange={handleChange}
            options={["Admin", "Kasir", "Mekanik"]}
            required
          />
          <FormInput
            label="Status"
            id="status"
            type="select"
            name="status"
            value={form.status}
            onChange={handleChange}
            options={[{ value: "aktif", label: "Aktif" }, { value: "nonaktif", label: "Nonaktif" }]}
            required
          />
          <div className="modal-actions">
            <Button variant="secondary" onClick={closeModal} type="button">Batal</Button>
            <Button type="submit">{editTarget !== null ? "Simpan Perubahan" : "Tambah Pengguna"}</Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}

function SummaryCard({ icon, color, label, val }) {
  return (
    <div className="user-summary-card">
      <div className={`user-summary-icon icon-${color}`}>{icon}</div>
      <div>
        <p>{label}</p>
        <strong>{val}</strong>
      </div>
    </div>
  );
}
