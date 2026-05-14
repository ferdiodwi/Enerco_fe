import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Zap, Battery, MapPin, Activity, ChevronRight, AlertCircle, Plus } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#059669', '#0284C7', '#f59e0b', '#8b5cf6'];

export default function ProviderDashboard() {
  const { user } = useAuth();
  const [sources, setSources] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      api.get('/energy-sources'),
      api.get('/dashboard/summary'),
    ]).then(([srcRes, sumRes]) => {
      if (srcRes.status === 'fulfilled') {
        const all = srcRes.value.data.data || [];
        setSources(all);
      }
      if (sumRes.status === 'fulfilled') setSummary(sumRes.value.data.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div></div>;

  const totalCapacity = sources.reduce((a, s) => a + parseFloat(s.capacity_kwh || 0), 0);
  const totalAvailable = sources.reduce((a, s) => a + parseFloat(s.available_kwh || 0), 0);
  const used = totalCapacity - totalAvailable;

  const statusMap = { active: 'bg-emerald-100 text-emerald-700', maintenance: 'bg-amber-100 text-amber-700', inactive: 'bg-slate-100 text-slate-600', full: 'bg-red-100 text-red-700' };

  const pieData = [
    { name: 'Terpakai', value: used > 0 ? used : 0 },
    { name: 'Tersedia', value: totalAvailable },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-sky-600 to-sky-700 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
            <Zap className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{fontFamily:'var(--font-heading)'}}>Dashboard Penyedia Energi</h1>
            <p className="text-sky-100 mt-1">Selamat datang, {user?.name}. Kelola sumber energi bersih Anda.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
          <Zap className="h-5 w-5 text-amber-500 mb-2" />
          <p className="text-sm text-slate-500">Total Sumber Energi</p>
          <p className="text-2xl font-bold text-slate-800">{sources.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
          <Battery className="h-5 w-5 text-emerald-500 mb-2" />
          <p className="text-sm text-slate-500">Total Kapasitas</p>
          <p className="text-2xl font-bold text-slate-800">{totalCapacity.toLocaleString()} <span className="text-sm font-normal text-slate-400">kWh</span></p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
          <Activity className="h-5 w-5 text-sky-500 mb-2" />
          <p className="text-sm text-slate-500">Energi Tersedia</p>
          <p className="text-2xl font-bold text-slate-800">{totalAvailable.toLocaleString()} <span className="text-sm font-normal text-slate-400">kWh</span></p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
          <MapPin className="h-5 w-5 text-violet-500 mb-2" />
          <p className="text-sm text-slate-500">UMKM Terlayani</p>
          <p className="text-2xl font-bold text-slate-800">{summary?.businesses?.active ?? 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4" style={{fontFamily:'var(--font-heading)'}}>Daftar Sumber Energi</h2>
          {sources.length > 0 ? (
            <div className="space-y-3">
              {sources.map(src => (
                <div key={src.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center"><Zap className="h-5 w-5" /></div>
                    <div>
                      <p className="font-medium text-slate-800">{src.name}</p>
                      <p className="text-xs text-slate-500 capitalize">{src.type} &bull; {src.city}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-800">{parseFloat(src.available_kwh).toLocaleString()} / {parseFloat(src.capacity_kwh).toLocaleString()} kWh</p>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusMap[src.status] || statusMap.inactive}`}>{src.status}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">Belum ada sumber energi terdaftar.</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4" style={{fontFamily:'var(--font-heading)'}}>Utilisasi Kapasitas</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                <Cell fill="#059669" />
                <Cell fill="#e2e8f0" />
              </Pie>
              <Tooltip formatter={v => `${v.toLocaleString()} kWh`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <p className="text-center text-sm text-slate-500 mt-2">
            {totalCapacity > 0 ? Math.round((used / totalCapacity) * 100) : 0}% kapasitas terpakai
          </p>
        </div>
      </div>
    </div>
  );
}
