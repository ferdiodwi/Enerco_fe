import { useState, useEffect } from 'react';
import api from '../services/api';
import { BarChart3, DollarSign, TrendingUp, Leaf } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function ImpactReport() {
  const [impactChart, setImpactChart] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      api.get('/dashboard/impact-chart'),
      api.get('/dashboard/summary'),
    ]).then(([ic, s]) => {
      if (ic.status === 'fulfilled') setImpactChart(ic.value.data.data);
      if (s.status === 'fulfilled') setSummary(s.value.data.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div></div>;

  const periodData = impactChart?.by_period?.map(p => ({
    name: p.report_period,
    saving: parseFloat(p.total_saving),
    emission: parseFloat(p.total_emission_reduction),
    productivity: parseFloat(p.avg_productivity_increase),
  })) || [];

  const sectorData = impactChart?.by_sector?.map(s => ({
    name: s.sector?.charAt(0).toUpperCase() + s.sector?.slice(1).replace('_', ' '),
    saving: parseFloat(s.total_saving),
    emission: parseFloat(s.total_emission_reduction),
    count: s.report_count,
  })) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2" style={{fontFamily:'var(--font-heading)'}}>
          <BarChart3 className="h-7 w-7 text-emerald-500" /> Laporan Dampak
        </h1>
        <p className="text-slate-500 mt-1">Monitoring dampak penggunaan energi bersih terhadap ekonomi lokal.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-5 text-white">
          <DollarSign className="h-7 w-7 opacity-80" />
          <p className="text-sm opacity-80 mt-3">Total Penghematan Biaya</p>
          <p className="text-2xl font-bold mt-1">Rp {(summary?.impact?.total_cost_saving ?? 0).toLocaleString('id-ID')}</p>
        </div>
        <div className="bg-gradient-to-br from-sky-500 to-sky-600 rounded-xl p-5 text-white">
          <TrendingUp className="h-7 w-7 opacity-80" />
          <p className="text-sm opacity-80 mt-3">Rata-rata Peningkatan Produktivitas</p>
          <p className="text-2xl font-bold mt-1">{summary?.impact?.avg_productivity_increase ?? 0}%</p>
        </div>
        <div className="bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl p-5 text-white">
          <Leaf className="h-7 w-7 opacity-80" />
          <p className="text-sm opacity-80 mt-3">Total Pengurangan Emisi</p>
          <p className="text-2xl font-bold mt-1">{(summary?.impact?.total_emission_reduction_kg ?? 0).toLocaleString()} kg CO₂</p>
        </div>
      </div>

      {periodData.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4" style={{fontFamily:'var(--font-heading)'}}>Dampak per Periode</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={periodData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="saving" fill="#059669" name="Penghematan (Rp)" radius={[4,4,0,0]} />
              <Bar dataKey="emission" fill="#0284C7" name="Reduksi Emisi (kg)" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {sectorData.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4" style={{fontFamily:'var(--font-heading)'}}>Dampak per Sektor UMKM</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-3 px-2 text-slate-500 font-medium">Sektor</th>
                  <th className="text-left py-3 px-2 text-slate-500 font-medium">Jumlah Laporan</th>
                  <th className="text-left py-3 px-2 text-slate-500 font-medium">Penghematan (Rp)</th>
                  <th className="text-left py-3 px-2 text-slate-500 font-medium">Reduksi Emisi (kg)</th>
                </tr>
              </thead>
              <tbody>
                {sectorData.map((s, i) => (
                  <tr key={i} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="py-3 px-2 font-medium text-slate-800">{s.name}</td>
                    <td className="py-3 px-2 text-slate-600">{s.count}</td>
                    <td className="py-3 px-2 text-emerald-600 font-medium">Rp {s.saving.toLocaleString('id-ID')}</td>
                    <td className="py-3 px-2 text-sky-600 font-medium">{s.emission.toLocaleString()} kg</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {periodData.length === 0 && sectorData.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-100 p-12 text-center">
          <BarChart3 className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-800">Belum ada laporan dampak</h3>
          <p className="text-slate-500 mt-2">Data dampak akan muncul setelah rekomendasi distribusi energi diimplementasikan.</p>
        </div>
      )}
    </div>
  );
}
