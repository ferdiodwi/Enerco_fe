import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { TrendingUp, Building2, Handshake, DollarSign, Leaf, ChevronRight, MapPin, Users } from 'lucide-react';

export default function InvestorDashboard() {
  const { user } = useAuth();
  const [businesses, setBusinesses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      api.get('/businesses'),
      api.get('/dashboard/summary'),
    ]).then(([bizRes, sumRes]) => {
      if (bizRes.status === 'fulfilled') setBusinesses(bizRes.value.data.data?.slice?.(0, 6) || []);
      if (sumRes.status === 'fulfilled') setSummary(sumRes.value.data.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div></div>;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-violet-600 to-violet-700 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
            <TrendingUp className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{fontFamily:'var(--font-heading)'}}>Dashboard Investor</h1>
            <p className="text-violet-100 mt-1">Selamat datang, {user?.name}. Temukan peluang kemitraan UMKM berdampak tinggi.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Building2, label: 'UMKM Potensial', value: summary?.businesses?.active ?? 0, color: 'bg-emerald-50 text-emerald-600' },
          { icon: DollarSign, label: 'Potensi Hemat Biaya', value: `Rp ${(summary?.impact?.total_cost_saving ?? 0).toLocaleString('id-ID')}`, color: 'bg-sky-50 text-sky-600' },
          { icon: Leaf, label: 'Reduksi Emisi', value: `${summary?.impact?.total_emission_reduction_kg ?? 0} kg`, color: 'bg-amber-50 text-amber-600' },
          { icon: Users, label: 'Tenaga Kerja Terdampak', value: summary?.businesses?.total_employees ?? 0, color: 'bg-violet-50 text-violet-600' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${s.color}`}><s.icon className="h-5 w-5" /></div>
            <p className="text-sm text-slate-500">{s.label}</p>
            <p className="text-xl font-bold text-slate-800 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800" style={{fontFamily:'var(--font-heading)'}}>UMKM Potensial untuk Kemitraan</h2>
          <Link to="/dashboard/marketplace" className="text-sm text-emerald-600 font-medium hover:text-emerald-700 flex items-center gap-1">
            Lihat Marketplace <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        {businesses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {businesses.map(biz => (
              <div key={biz.id} className="border border-slate-100 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${biz.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{biz.status}</span>
                </div>
                <h3 className="font-semibold text-slate-800">{biz.name}</h3>
                <p className="text-xs text-slate-500 capitalize mt-1">{biz.sector?.replace('_', ' ')}</p>
                <div className="mt-3 pt-3 border-t border-slate-50 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-slate-400">Kebutuhan Energi</p>
                    <p className="font-semibold text-slate-700">{biz.monthly_energy_need} kWh</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Pekerja</p>
                    <p className="font-semibold text-slate-700">{biz.employee_count} orang</p>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-2 flex items-center gap-1"><MapPin className="h-3 w-3" /> {biz.city}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-sm text-center py-6">Belum ada data UMKM.</p>
        )}
      </div>
    </div>
  );
}
