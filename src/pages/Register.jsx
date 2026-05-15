import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Zap, User, Mail, Lock, Phone, Loader2, ArrowLeft, Building2, Landmark, Battery, TrendingUp } from 'lucide-react';

const roles = [
  { value: 'business_owner', label: 'UMKM', icon: Building2, desc: 'Pelaku usaha lokal' },
  { value: 'government', label: 'Pemerintah', icon: Landmark, desc: 'Dinas & regulator' },
  { value: 'energy_provider', label: 'Penyedia Energi', icon: Battery, desc: 'Penyedia energi terbarukan' },
  { value: 'investor', label: 'Investor', icon: TrendingUp, desc: 'Mitra pendanaan' },
];

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '', phone: '', role: 'business_owner' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    try { await api.post('/register', form); navigate('/login'); }
    catch (err) { const errs = err.response?.data?.errors; setError(errs ? Object.values(errs).flat().join(' ') : err.response?.data?.message || 'Gagal.'); }
    finally { setLoading(false); }
  };
  const set = (k, v) => setForm({ ...form, [k]: v });

  const inputCls = "w-full pl-10 pr-3 py-2 text-[15px] font-light rounded-md outline-none border border-emerald-100 bg-white text-slate-800 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-emerald-50/50 font-light">
      <div className="w-full max-w-lg mb-6">
        <Link to="/" className="inline-flex items-center gap-1.5 text-[15px] text-slate-500 hover:opacity-70 transition">
          <ArrowLeft className="h-4 w-4" /> Kembali
        </Link>
      </div>

      <div className="w-full max-w-lg p-8 rounded-xl bg-white border border-emerald-100 shadow-xl shadow-emerald-900/5">
        <div className="flex items-center gap-2 mb-8">
          <Zap className="h-5 w-5 text-emerald-600" />
          <span className="text-[17px] font-light text-slate-800 tracking-tight">EnergEco</span>
        </div>
        <h1 className="text-[26px] font-light text-slate-800 tracking-tight mb-1">Buat akun baru</h1>
        <p className="text-[15px] font-light text-slate-500 mb-6">
          Sudah punya akun? <Link to="/login" className="font-normal text-emerald-600 hover:underline">Masuk</Link>
        </p>

        {/* Role */}
        <div className="mb-6">
          <label className="block text-[13px] font-normal text-slate-500 mb-2">Pilih Role</label>
          <div className="grid grid-cols-2 gap-2">
            {roles.map(r => (
              <button key={r.value} type="button" onClick={() => set('role', r.value)}
                className={`flex items-center gap-3 p-3 rounded-lg text-left transition border ${form.role === r.value
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-emerald-100 hover:border-emerald-200 bg-white'}`}>
                <r.icon className={`h-5 w-5 flex-shrink-0 ${form.role === r.value ? 'text-emerald-600' : 'text-slate-400'}`} />
                <div className="min-w-0">
                  <p className={`text-sm ${form.role === r.value ? 'font-normal text-emerald-700' : 'font-light text-slate-600'}`}>{r.label}</p>
                  <p className="text-[11px] font-light text-slate-500 truncate">{r.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {error && <div className="mb-4 p-3 rounded-md text-sm font-normal bg-red-50 border border-red-100 text-red-600">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[13px] font-normal text-slate-500 mb-1.5">Nama</label>
              <div className="relative"><User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input value={form.name} onChange={e => set('name', e.target.value)} required placeholder="Nama lengkap" className={inputCls} /></div>
            </div>
            <div>
              <label className="block text-[13px] font-normal text-slate-500 mb-1.5">Telepon</label>
              <div className="relative"><Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="08xxxxxxxxxx" className={inputCls} /></div>
            </div>
          </div>
          <div>
            <label className="block text-[13px] font-normal text-slate-500 mb-1.5">Email</label>
            <div className="relative"><Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)} required placeholder="nama@email.com" className={inputCls} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[13px] font-normal text-slate-500 mb-1.5">Password</label>
              <div className="relative"><Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input type="password" value={form.password} onChange={e => set('password', e.target.value)} required placeholder="Min. 8 karakter" className={inputCls} /></div>
            </div>
            <div>
              <label className="block text-[13px] font-normal text-slate-500 mb-1.5">Konfirmasi</label>
              <div className="relative"><Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input type="password" value={form.password_confirmation} onChange={e => set('password_confirmation', e.target.value)} required placeholder="Ulangi" className={inputCls} /></div>
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 text-base font-normal py-2.5 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition disabled:opacity-60">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Daftar Sekarang'}
          </button>
        </form>
      </div>
    </div>
  );
}
