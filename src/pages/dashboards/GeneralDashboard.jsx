import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Zap, Building2, TrendingUp, Leaf, DollarSign, Users, BarChart3, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#059669', '#0284C7', '#f59e0b', '#8b5cf6', '#ef4444'];

function StatCard({ icon: Icon, label, value, sub, color = 'emerald' }) {
  const colorMap = { emerald: 'bg-emerald-50 text-emerald-600', sky: 'bg-sky-50 text-sky-600', amber: 'bg-amber-50 text-amber-600', violet: 'bg-violet-50 text-violet-600' };
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex items-start gap-4 hover:shadow-md transition-shadow">
      <div className={`p-3 rounded-lg ${colorMap[color]}`}><Icon className="h-6 w-6" /></div>
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-2xl font-bold text-slate-800 mt-1">{value ?? '-'}</p>
        {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

export default function GeneralDashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [energyChart, setEnergyChart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/dashboard/summary'), api.get('/dashboard/energy-chart')])
      .then(([s, e]) => { setSummary(s.data.data); setEnergyChart(e.data.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div></div>;
  if (!summary) return <div className="text-center text-slate-500 mt-10">Gagal memuat data dashboard.</div>;

  const energyTypeData = energyChart?.by_type?.map(i => ({ name: i.type.charAt(0).toUpperCase() + i.type.slice(1), capacity: parseFloat(i.total_capacity), available: parseFloat(i.total_available) })) || [];
  const pieData = energyTypeData.map(i => ({ name: i.name, value: i.capacity }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800" style={{fontFamily:'var(--font-heading)'}}>Selamat datang, {user?.name} 👋</h1>
        <p className="text-slate-500 mt-1">Ringkasan data EnergEco GlobalChain.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Building2} label="Total UMKM" value={summary.businesses?.active} sub={`${summary.businesses?.total_employees ?? 0} pekerja`} color="emerald" />
        <StatCard icon={Zap} label="Sumber Energi Aktif" value={summary.energy?.active_sources} sub={`${(summary.energy?.total_capacity_kwh ?? 0).toLocaleString()} kWh`} color="sky" />
        <StatCard icon={TrendingUp} label="Rekomendasi AI" value={summary.recommendations?.total} sub={`${summary.recommendations?.implemented ?? 0} terimplementasi`} color="amber" />
        <StatCard icon={Leaf} label="Pengurangan Emisi" value={`${summary.impact?.total_emission_reduction_kg ?? 0} kg`} sub="CO₂" color="violet" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2"><BarChart3 className="h-5 w-5 text-emerald-500" /> Kapasitas Energi per Jenis</h2>
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
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2"><Activity className="h-5 w-5 text-sky-500" /> Distribusi Kapasitas</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => `${v.toLocaleString()} kWh`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-5 text-white">
          <DollarSign className="h-8 w-8 opacity-80" />
          <p className="text-sm opacity-80 mt-3">Total Penghematan Biaya</p>
          <p className="text-2xl font-bold mt-1">Rp {(summary.impact?.total_cost_saving ?? 0).toLocaleString('id-ID')}</p>
        </div>
        <div className="bg-gradient-to-br from-sky-500 to-sky-600 rounded-xl p-5 text-white">
          <TrendingUp className="h-8 w-8 opacity-80" />
          <p className="text-sm opacity-80 mt-3">Peningkatan Produktivitas</p>
          <p className="text-2xl font-bold mt-1">{summary.impact?.avg_productivity_increase ?? 0}%</p>
        </div>
        <div className="bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl p-5 text-white">
          <Users className="h-8 w-8 opacity-80" />
          <p className="text-sm opacity-80 mt-3">Utilisasi Energi</p>
          <p className="text-2xl font-bold mt-1">{summary.energy?.utilization_percentage ?? 0}%</p>
        </div>
      </div>
    </div>
  );
}
