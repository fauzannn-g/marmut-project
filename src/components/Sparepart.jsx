import React, { useState } from "react";
import {
  Package,
  Search,
  Plus,
  Download,
  Filter,
  Trash2,
} from "lucide-react";

export default function Sparepart() {
  const [showForm, setShowForm] = useState(false);
  const [spareparts, setSpareparts] = useState([]);
  const handleDelete = (index) => {
    const confirmDelete = window.confirm(
      "Apakah kamu yakin ingin menghapus sparepart ini?"
  );

  if (confirmDelete) {
    setSpareparts((prev) => prev.filter((_, i) => i !== index));
  }
};
return (
    <div className="sparepart-page">
      <div className="sparepart-heading">
        <div>
          <h1>Data Sparepart</h1>
          <p>Kelola data dan persediaan sparepart bengkel.</p>
        </div>

        <button
  className="sparepart-add-button"
  onClick={() => setShowForm(true)}
>
  <Plus size={18} />
  Tambah Sparepart
</button>
      </div>

      <div className="sparepart-summary">
        <div className="sparepart-summary-icon">
          <Package size={24} />
        </div>
        <div>
          <p>Total Jenis Sparepart</p>
          <h2>{spareparts.length}</h2>
          <span>Barang terdaftar</span>
        </div>
      </div>
      
      
        {showForm && (
        <div className="sparepart-form-card">
            <h3>Tambah Sparepart</h3>
            <p>Masukkan informasi sparepart baru.</p>

            <form
            className="sparepart-form"
            onSubmit={(e) => {
            e.preventDefault();

            const formData = new FormData(e.target);

            const newSparepart = {
                kode: formData.get("kode"),
                nama: formData.get("nama"),
                kategori: formData.get("kategori"),
                harga: Number(formData.get("harga")),
                stok: Number(formData.get("stok")),
            };

            setSpareparts((prev) => [...prev, newSparepart]);

            e.target.reset();
            setShowForm(false);
    }}
            >
            <div className="sparepart-form-group">
                <label>Kode Barang</label>
                <input
                    type="text"
                    name="kode"
                    placeholder="Contoh: SP001"
                    required
                />
            </div>

            <div className="sparepart-form-group">
                <label>Nama Sparepart</label>
                <input
                type="text"
                placeholder="Masukkan nama sparepart"
                required
                />
            </div>

            <div className="sparepart-form-group">
                <label>Kategori</label>
                <input
                type="text"
                name="kategori"
                placeholder="Contoh: Oli, Aki, Ban"
                required
                />
            </div>

            <div className="sparepart-form-row">
                <div className="sparepart-form-group">
                <label>Harga</label>
                <input
                    type="number"
                    name="harga"
                    min="0"
                    placeholder="0"
                    required 
                />
                </div>

                <div className="sparepart-form-group">
                <label>Stok</label>
                <input
                    type="number"
                    name="stok"
                    min="0"
                    placeholder="0"
                    required
                />
                </div>
            </div>

            <div className="sparepart-form-actions">
                <button
                type="button"
                className="sparepart-cancel-button"
                onClick={() => setShowForm(false)}
                >
                Batal
                </button>

                <button type="submit" className="sparepart-add-button">
                Simpan Sparepart
                </button>
            </div>
            </form>
        </div>
        )}


      <div className="sparepart-table-card">
        <div className="sparepart-toolbar">
          <div className="sparepart-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Cari kode atau nama sparepart..."
            />
          </div>

          <button className="sparepart-filter-button">
            <Filter size={17} />
            Filter
          </button>

          <button className="sparepart-filter-button">
            <Download size={17} />
            Ekspor
          </button>
        </div>

        <div className="sparepart-table-wrapper">
          <table className="sparepart-table">
            <thead>
              <tr>
                <th>No.</th>
                <th>Kode Barang</th>
                <th>Nama Sparepart</th>
                <th>Kategori</th>
                <th>Harga</th>
                <th>Stok</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>

            
            <tbody>
            {spareparts.length === 0 ? (
                <tr>
                <td colSpan="8" className="sparepart-empty">
                    <Package size={36} />
                    <strong>Belum ada data sparepart</strong>
                    <span>
                    Tambahkan sparepart untuk mulai mengelola persediaan.
                    </span>
                </td>
                </tr>
            ) : (
                spareparts.map((item, index) => (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.kode}</td>
                    <td>{item.nama}</td>
                    <td>{item.kategori}</td>
                    <td>
                    {item.harga.toLocaleString("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        maximumFractionDigits: 0,
                    })}
                    </td>
                    <td>{item.stok}</td>
                    <td>
                    <span>
                        {item.stok > 0 ? "Tersedia" : "Habis"}
                    </span>
                    </td>
                    <td>
                          <button
    className="sparepart-delete-button"
    onClick={() => handleDelete(index)}
    title="Hapus sparepart"
  >
    <Trash2 size={16} />
  </button>
                    </td>
                </tr>
                ))
            )}
            </tbody>

          </table>
        </div>
        <div className="sparepart-table-footer">
        Menampilkan {spareparts.length} data sparepart
        </div>
      </div>
    </div>
  );
}
