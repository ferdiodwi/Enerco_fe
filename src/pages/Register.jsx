import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Phone, Loader2, Building2, Zap, Landmark, TrendingUp } from 'lucide-react';

const roles = [
  { value: 'business_owner', label: 'UMKM / Pelaku Usaha', icon: Building2, desc: 'Daftarkan usaha dan dapatkan akses energi bersih' },
  { value: 'energy_provider', label: 'Penyedia Energi', icon: Zap, desc: 'Kelola dan distribusikan sumber energi bersih' },
  { value: 'government', label: 'Pemerintah Daerah', icon: Landmark, desc: 'Pantau prioritas distribusi dan dampak ekonomi' },
  { value: 'investor', label: 'Investor / Mitra', icon: TrendingUp, desc: 'Temukan peluang kemitraan dengan UMKM lokal' },
];

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '', role: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.role) { setError('Pilih peran Anda terlebih dahulu.'); return; }
    setLoading(true);
    setError('');
    try {
      const { default: api } = await import('../services/api');
      const res = await api.post('/register', form);
      if (res.data.success) {
        await login(form.email, form.password);
        navigate('/dashboard');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registrasi gagal.';
      const errors = err.response?.data?.errors;
      setError(errors ? Object.values(errors).flat().join(' ') : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4">
      <div className="mx-auto w-full max-w-lg">
        <Link to="/" className="flex items-center justify-center gap-2 text-2xl font-bold text-emerald-600 mb-2" style={{fontFamily:'var(--font-heading)'}}>
          <Zap className="h-7 w-7" /> EnergEco
        </Link>
        <p className="text-center text-slate-500 text-sm mb-8">Buat akun baru untuk bergabung dengan ekosistem energi bersih.</p>

        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8">
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100 mb-6">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Pilih Peran Anda</label>
              <div className="grid grid-cols-2 gap-3">
                {roles.map(r => (
                  <button key={r.value} type="button" onClick={() => setForm({...form, role: r.value})}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${form.role === r.value ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-slate-300'}`}>
                    <r.icon className={`h-5 w-5 mb-1 ${form.role === r.value ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <p className={`text-xs font-semibold ${form.role === r.value ? 'text-emerald-700' : 'text-slate-700'}`}>{r.label}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                <input name="name" required value={form.name} onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="Nama lengkap" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                <input name="email" type="email" required value={form.email} onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="email@contoh.com" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">No. Telepon (opsional)</label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                <input name="phone" value={form.phone} onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="08xxxxxxxxxx" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                  <input name="password" type="password" required value={form.password} onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="••••••••" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Konfirmasi</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                  <input name="password_confirmation" type="password" required value={form.password_confirmation} onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="••••••••" />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-70 shadow-sm">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Daftar Sekarang'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-emerald-600 font-medium hover:text-emerald-700">Masuk di sini</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
