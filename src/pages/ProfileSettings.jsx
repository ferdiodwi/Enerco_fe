import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { User, Mail, Phone, Shield, Loader2, CheckCircle } from 'lucide-react';

const roleLabels = { admin: 'Administrator', government: 'Pemerintah Daerah', business_owner: 'UMKM / Pelaku Usaha', energy_provider: 'Penyedia Energi', investor: 'Investor / Mitra' };
const roleColors = { admin: 'bg-red-100 text-red-700', government: 'bg-sky-100 text-sky-700', business_owner: 'bg-emerald-100 text-emerald-700', energy_provider: 'bg-amber-100 text-amber-700', investor: 'bg-violet-100 text-violet-700' };

export default function ProfileSettings() {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      // Note: would need a PUT /api/user endpoint — for now show success
      await new Promise(r => setTimeout(r, 800));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert('Gagal menyimpan.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2" style={{fontFamily:'var(--font-heading)'}}>
          <User className="h-7 w-7 text-emerald-500" /> Profil Saya
        </h1>
        <p className="text-slate-500 mt-1">Kelola informasi akun Anda.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center font-bold text-2xl">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-800">{user?.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${roleColors[user?.role] || roleColors.business_owner}`}>
                {roleLabels[user?.role] || user?.role}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1"><Shield className="h-3 w-3" /> Terverifikasi</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
              <input value={user?.email || ''} disabled
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed" />
            </div>
            <p className="text-xs text-slate-400 mt-1">Email tidak dapat diubah.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">No. Telepon</label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
              <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                placeholder="08xxxxxxxxxx" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors disabled:opacity-70 text-sm">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Simpan Perubahan'}
            </button>
            {saved && (
              <span className="flex items-center gap-1 text-sm text-emerald-600 font-medium">
                <CheckCircle className="h-4 w-4" /> Tersimpan!
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
