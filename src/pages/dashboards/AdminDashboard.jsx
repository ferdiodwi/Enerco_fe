import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  Shield, Users, Building2, Zap, BrainCircuit, BarChart3, ShoppingBag,
  TrendingUp, Leaf, DollarSign, ChevronRight, Loader2, CheckCircle, AlertCircle
} from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [genResult, setGenResult] = useState(null);

  useEffect(() => {
    api.get('/dashboard/summary').then(r => setSummary(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleGenerateAI = async () => {
    setGenerating(true);
    setGenResult(null);
    try {
      const res = await api.post('/recommendations/generate');
      setGenResult({ success: true, message: `${res.data.data?.length || 0} rekomendasi berhasil digenerate.` });
    } catch (err) {
      setGenResult({ success: false, message: err.response?.data?.message || 'Gagal generate rekomendasi.' });
    } finally {
      setGenerating(false);
    }
  };

  const handleCalcScores = async () => {
    setGenerating(true);
    setGenResult(null);
    try {
      const res = await api.post('/priority-scores/calculate');
      setGenResult({ success: true, message: `${res.data.data?.length || 0} skor prioritas dihitung.` });
    } catch (err) {
      setGenResult({ success: false, message: err.response?.data?.message || 'Gagal menghitung skor.' });
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div></div>;

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center">
            <Shield className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{fontFamily:'var(--font-heading)'}}>Admin Dashboard</h1>
            <p className="text-slate-300 mt-1">Selamat datang, {user?.name}. Kelola seluruh sistem EnergEco.</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Building2, label: 'UMKM Terdaftar', value: summary?.businesses?.total, sub: `${summary?.businesses?.active || 0} aktif`, color: 'bg-emerald-50 text-emerald-600' },
          { icon: Zap, label: 'Sumber Energi', value: summary?.energy?.active_sources, sub: `${Math.round(summary?.energy?.total_capacity_kwh || 0).toLocaleString()} kWh total`, color: 'bg-sky-50 text-sky-600' },
          { icon: BrainCircuit, label: 'Rekomendasi AI', value: (summary?.recommendations?.total || 0), sub: `${summary?.recommendations?.implemented || 0} terimplementasi`, color: 'bg-amber-50 text-amber-600' },
          { icon: Leaf, label: 'Pengurangan Emisi', value: `${summary?.impact?.total_emission_reduction_kg ?? 0} kg`, sub: 'CO₂ dihemat', color: 'bg-violet-50 text-violet-600' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${s.color}`}><s.icon className="h-5 w-5" /></div>
            <p className="text-sm text-slate-500">{s.label}</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{s.value ?? '-'}</p>
            <p className="text-xs text-slate-400 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* AI Actions */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-4" style={{fontFamily:'var(--font-heading)'}}>
          <BrainCircuit className="h-5 w-5 text-emerald-500" /> Aksi AI
        </h2>
        <div className="flex flex-wrap gap-3">
          <button onClick={handleGenerateAI} disabled={generating}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors disabled:opacity-70 text-sm">
            {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <BrainCircuit className="h-4 w-4" />}
            Generate Rekomendasi AI
          </button>
          <button onClick={handleCalcScores} disabled={generating}
            className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors disabled:opacity-70 text-sm">
            {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <TrendingUp className="h-4 w-4" />}
            Hitung Skor Prioritas
          </button>
        </div>
        {genResult && (
          <div className={`mt-3 flex items-center gap-2 text-sm ${genResult.success ? 'text-emerald-600' : 'text-red-600'}`}>
            {genResult.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            {genResult.message}
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { to: '/dashboard/users', icon: Users, label: 'Kelola Pengguna', desc: 'Lihat & atur semua akun pengguna', color: 'from-emerald-500 to-emerald-600' },
          { to: '/dashboard/recommendations', icon: BrainCircuit, label: 'Rekomendasi AI', desc: 'Lihat ranking & ubah status', color: 'from-sky-500 to-sky-600' },
          { to: '/dashboard/impact', icon: BarChart3, label: 'Laporan Dampak', desc: 'Monitor penghematan & emisi', color: 'from-violet-500 to-violet-600' },
        ].map((link, i) => (
          <Link key={i} to={link.to} className={`bg-gradient-to-br ${link.color} rounded-xl p-5 text-white hover:opacity-90 transition-opacity`}>
            <link.icon className="h-7 w-7 opacity-80 mb-3" />
            <p className="font-semibold">{link.label}</p>
            <p className="text-sm opacity-80 mt-1">{link.desc}</p>
            <ChevronRight className="h-5 w-5 mt-3 opacity-60" />
          </Link>
        ))}
      </div>
    </div>
  );
}
