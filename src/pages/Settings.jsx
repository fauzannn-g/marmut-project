import { Settings as SettingsIcon, Bell, Shield, Globe, Save } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import PageHeader from "../components/common/PageHeader";
import Button from "../components/common/Button";
import "./Settings.css";

export default function Settings() {
  return (
    <DashboardLayout title="Pengaturan" subtitle="Konfigurasi sistem bengkel.">
      <PageHeader title="Pengaturan Sistem" description="Sesuaikan konfigurasi aplikasi sesuai kebutuhan bengkel." />

      <div className="settings-layout">
        <SettingSection icon={<Globe size={20} />} title="Informasi Bengkel" desc="Data umum bengkel yang tampil di laporan.">
          <div className="form-row-2">
            <SettingField label="Nama Bengkel" defaultValue="Bengkel Motor Marmut" />
            <SettingField label="No. Telepon Bengkel" defaultValue="021-1234567" />
          </div>
          <SettingField label="Alamat Bengkel" defaultValue="Jl. Yos Sudarso No. 1, Madiun" textarea />
        </SettingSection>

        <SettingSection icon={<Bell size={20} />} title="Notifikasi" desc="Atur notifikasi dan peringatan sistem.">
          <ToggleSetting label="Peringatan Stok Menipis" desc="Notifikasi saat stok barang hampir habis." defaultChecked />
          <ToggleSetting label="Notifikasi Transaksi Baru" desc="Notifikasi ketika ada transaksi baru." defaultChecked />
          <ToggleSetting label="Laporan Harian Otomatis" desc="Kirim ringkasan laporan harian via email." />
        </SettingSection>

        <SettingSection icon={<Shield size={20} />} title="Keamanan" desc="Pengaturan keamanan dan privasi akun.">
          <ToggleSetting label="Autentikasi Dua Faktor" desc="Tambahkan lapisan keamanan saat login." />
          <ToggleSetting label="Sesi Otomatis Berakhir" desc="Logout otomatis setelah 30 menit tidak aktif." defaultChecked />
        </SettingSection>

        <div className="settings-actions">
          <Button variant="secondary">Reset ke Default</Button>
          <Button icon={<Save size={15} />}>Simpan Pengaturan</Button>
        </div>
      </div>
    </DashboardLayout>
  );
}

function SettingSection({ icon, title, desc, children }) {
  return (
    <div className="setting-section">
      <div className="setting-section-header">
        <div className="setting-section-icon">{icon}</div>
        <div>
          <h3>{title}</h3>
          <p>{desc}</p>
        </div>
      </div>
      <div className="setting-section-body">{children}</div>
    </div>
  );
}

function SettingField({ label, defaultValue, textarea }) {
  return (
    <div className="setting-field">
      <label>{label}</label>
      {textarea ? (
        <textarea className="setting-input setting-textarea" defaultValue={defaultValue} rows={2} />
      ) : (
        <input className="setting-input" type="text" defaultValue={defaultValue} />
      )}
    </div>
  );
}

function ToggleSetting({ label, desc, defaultChecked = false }) {
  return (
    <div className="toggle-setting">
      <div>
        <p className="toggle-label">{label}</p>
        <p className="toggle-desc">{desc}</p>
      </div>
      <label className="toggle-switch">
        <input type="checkbox" defaultChecked={defaultChecked} />
        <span className="toggle-track" />
      </label>
    </div>
  );
}
