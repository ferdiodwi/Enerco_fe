import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  Building2, Zap, BrainCircuit, Leaf, TrendingUp, BarChart3,
  Map, ChevronRight, Landmark, Users, DollarSign
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#059669', '#0284C7', '#f59e0b', '#8b5cf6', '#ef4444'];

export default function GovernmentDashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [energyChart, setEnergyChart] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      api.get('/dashboard/summary'),
      api.get('/dashboard/energy-chart'),
      api.get('/recommendations'),
    ]).then(([s, e, r]) => {
      if (s.status === 'fulfilled') setSummary(s.value.data.data);
      if (e.status === 'fulfilled') setEnergyChart(e.value.data.data);
      if (r.status === 'fulfilled') setRecommendations(r.value.data.data?.slice?.(0, 5) || []);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div></div>;
  if (!summary) return <div className="text-center text-slate-500 mt-10">Gagal memuat data.</div>;

  const energyTypeData = energyChart?.by_type?.map(i => ({
    name: i.type.charAt(0).toUpperCase() + i.type.slice(1),
    capacity: parseFloat(i.total_capacity),
    available: parseFloat(i.total_available),
    count: i.count,
  })) || [];

  const priorityColors = { low: 'text-slate-500', medium: 'text-yellow-600', high: 'text-orange-600', urgent: 'text-red-600' };
  const priorityBg = { low: 'bg-slate-50', medium: 'bg-yellow-50', high: 'bg-orange-50', urgent: 'bg-red-50' };

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center">
              <Landmark className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{fontFamily:'var(--font-heading)'}}>Dashboard Pemerintah</h1>
              <p className="text-slate-300 mt-1">Selamat datang, {user?.name}. Pantau prioritas distribusi energi wilayah Anda.</p>
            </div>
          </div>
          <Link to="/dashboard/map" className="hidden md:flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors">
            <Map className="h-5 w-5" /> Buka Peta Prioritas
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Building2, label: 'Total UMKM Aktif', value: summary.businesses?.active, color: 'emerald' },
          { icon: Zap, label: 'Sumber Energi Aktif', value: summary.energy?.active_sources, color: 'sky' },
          { icon: BrainCircuit, label: 'Rekomendasi Terimplementasi', value: summary.recommendations?.implemented, color: 'amber' },
          { icon: Leaf, label: 'Pengurangan Emisi', value: `${summary.impact?.total_emission_reduction_kg ?? 0} kg`, color: 'violet' },
        ].map((s, i) => {
          const colorMap = { emerald: 'bg-emerald-50 text-emerald-600', sky: 'bg-sky-50 text-sky-600', amber: 'bg-amber-50 text-amber-600', violet: 'bg-violet-50 text-violet-600' };
          return (
            <div key={i} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${colorMap[s.color]}`}><s.icon className="h-5 w-5" /></div>
              <p className="text-sm text-slate-500">{s.label}</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{s.value ?? '-'}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2" style={{fontFamily:'var(--font-heading)'}}>
            <BarChart3 className="h-5 w-5 text-emerald-500" /> Distribusi Energi per Jenis
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={energyTypeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip />
              <Bar dataKey="capacity" fill="#059669" name="Kapasitas (kWh)" radius={[4,4,0,0]} />
              <Bar dataKey="available" fill="#0284C7" name="Tersedia (kWh)" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Impact Summary */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-5 text-white">
            <DollarSign className="h-6 w-6 opacity-80" />
            <p className="text-sm opacity-80 mt-2">Total Penghematan</p>
            <p className="text-2xl font-bold mt-1">Rp {(summary.impact?.total_cost_saving ?? 0).toLocaleString('id-ID')}</p>
          </div>
          <div className="bg-gradient-to-br from-sky-500 to-sky-600 rounded-xl p-5 text-white">
            <TrendingUp className="h-6 w-6 opacity-80" />
            <p className="text-sm opacity-80 mt-2">Produktivitas Rata-rata</p>
            <p className="text-2xl font-bold mt-1">+{summary.impact?.avg_productivity_increase ?? 0}%</p>
          </div>
          <div className="bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl p-5 text-white">
            <Users className="h-6 w-6 opacity-80" />
            <p className="text-sm opacity-80 mt-2">Utilisasi Energi</p>
            <p className="text-2xl font-bold mt-1">{summary.energy?.utilization_percentage ?? 0}%</p>
          </div>
        </div>
      </div>

      {/* Ranking Rekomendasi */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2" style={{fontFamily:'var(--font-heading)'}}>
            <BrainCircuit className="h-5 w-5 text-emerald-500" /> Ranking Prioritas Distribusi
          </h2>
          <Link to="/dashboard/recommendations" className="text-sm text-emerald-600 font-medium hover:text-emerald-700 flex items-center gap-1">
            Lihat semua <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        {recommendations.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-3 px-2 text-slate-500 font-medium">#</th>
                  <th className="text-left py-3 px-2 text-slate-500 font-medium">UMKM</th>
                  <th className="text-left py-3 px-2 text-slate-500 font-medium">Sumber Energi</th>
                  <th className="text-left py-3 px-2 text-slate-500 font-medium">Jarak</th>
                  <th className="text-left py-3 px-2 text-slate-500 font-medium">Prioritas</th>
                  <th className="text-left py-3 px-2 text-slate-500 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recommendations.map((rec, i) => (
                  <tr key={rec.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-2 font-medium text-slate-400">{i + 1}</td>
                    <td className="py-3 px-2 font-medium text-slate-800">{rec.business?.name || '-'}</td>
                    <td className="py-3 px-2 text-slate-600">{rec.energy_source?.name || '-'}</td>
                    <td className="py-3 px-2 text-slate-600">{rec.distance_km} km</td>
                    <td className="py-3 px-2">
                      {rec.priority_score ? (
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${priorityBg[rec.priority_score.priority_level]} ${priorityColors[rec.priority_score.priority_level]}`}>
                          {rec.priority_score.priority_level?.toUpperCase()} ({rec.priority_score.total_score})
                        </span>
                      ) : '-'}
                    </td>
                    <td className="py-3 px-2">
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-slate-100 text-slate-600 capitalize">{rec.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-slate-500 text-sm text-center py-6">Belum ada data rekomendasi.</p>
        )}
      </div>
    </div>
  );
}
