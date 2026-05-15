import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, Mail, Lock, Loader2, ArrowLeft } from 'lucide-react';

export default function Login() {
  const { user, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    const result = await login(email, password);
    if (!result.success) setError(result.message);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-emerald-50/50 font-light">
      <div className="w-full max-w-sm mb-6">
        <Link to="/" className="inline-flex items-center gap-1.5 text-[15px] text-slate-500 hover:opacity-70 transition">
          <ArrowLeft className="h-4 w-4" /> Kembali
        </Link>
      </div>

      <div className="w-full max-w-sm p-8 rounded-xl bg-white border border-emerald-100 shadow-xl shadow-emerald-900/5">
        <div className="flex items-center gap-2 mb-8">
          <Zap className="h-5 w-5 text-emerald-600" />
          <span className="text-[17px] font-light text-slate-800 tracking-tight">EnergEco</span>
        </div>

        <h1 className="text-[26px] font-light text-slate-800 tracking-tight mb-1">Masuk ke akun</h1>
        <p className="text-[15px] font-light text-slate-500 mb-6">
          Belum punya akun? <Link to="/register" className="font-normal text-emerald-600 hover:underline">Daftar</Link>
        </p>

        {error && <div className="mb-4 p-3 rounded-md text-sm font-normal bg-red-50 border border-red-100 text-red-600">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[13px] font-normal text-slate-500 mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="nama@email.com"
                className="w-full pl-10 pr-3 py-2 text-[15px] font-light rounded-md outline-none border border-emerald-100 bg-white text-slate-800 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition" />
            </div>
          </div>
          <div>
            <label className="block text-[13px] font-normal text-slate-500 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2 text-[15px] font-light rounded-md outline-none border border-emerald-100 bg-white text-slate-800 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition" />
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 text-base font-normal py-2.5 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition disabled:opacity-60">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Masuk'}
          </button>
        </form>
      </div>

      {/* Demo */}
      <div className="w-full max-w-sm mt-4 p-5 rounded-xl bg-white border border-emerald-100">
        <p className="text-[10px] font-medium uppercase mb-3 text-slate-500 tracking-wide">Akun Demo</p>
        <div className="space-y-1.5">
          {[
            { r: 'Admin', e: 'admin@energeco.id' },
            { r: 'Pemerintah', e: 'pemerintah@energeco.id' },
            { r: 'UMKM', e: 'umkm1@energeco.id' },
            { r: 'Penyedia Energi', e: 'solar@energeco.id' },
            { r: 'Investor', e: 'investor@energeco.id' },
          ].map((d, i) => (
            <button key={i} onClick={() => { setEmail(d.e); setPassword('password'); }}
              className="w-full flex justify-between p-2.5 rounded-md text-left transition hover:bg-emerald-50">
              <span className="text-sm font-normal text-slate-800">{d.r}</span>
              <span className="text-[13px] font-mono text-slate-500">{d.e}</span>
            </button>
          ))}
        </div>
        <p className="text-[13px] font-normal text-slate-500 mt-3">Password: <code className="px-1.5 py-0.5 rounded text-xs bg-emerald-50 text-slate-700">password</code></p>
      </div>
    </div>
  );
}
