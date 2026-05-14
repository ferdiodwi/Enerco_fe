import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Loader2, Zap } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await login(email, password);
    if (result.success) {
      if (result.user.role === 'admin') {
        window.location.href = 'http://localhost:8000/admin';
      }
      // Other roles will auto-redirect via React Router (user state change)
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4">
      <div className="mx-auto w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 text-2xl font-bold text-emerald-600 mb-2" style={{fontFamily:'var(--font-heading)'}}>
          <Zap className="h-7 w-7" /> EnergEco
        </Link>
        <p className="text-center text-slate-500 text-sm mb-8">Masuk ke platform distribusi energi bersih.</p>

        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8">
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100 mb-6">{error}</div>}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="email@contoh.com" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="••••••••" />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-70 shadow-sm">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Masuk ke Sistem'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Belum punya akun?{' '}
            <Link to="/register" className="text-emerald-600 font-medium hover:text-emerald-700">Daftar sekarang</Link>
          </p>

          <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="text-xs text-slate-400 text-center mb-3">Akun Demo:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { label: 'Admin', email: 'admin@energeco.id' },
                { label: 'UMKM', email: 'umkm1@energeco.id' },
              ].map(a => (
                <button key={a.email} type="button" onClick={() => { setEmail(a.email); setPassword('password'); }}
                  className="bg-slate-50 hover:bg-slate-100 text-slate-600 py-2 rounded-lg border border-slate-200 transition-colors">
                  {a.label}: {a.email}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
