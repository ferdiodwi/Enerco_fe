import { useState, useEffect } from 'react';
import { BrainCircuit, Zap, Building2, MapPin, TrendingUp, Leaf, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../services/api';

export default function AIRecommendation() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/recommendations');
        setRecommendations(res.data.data || []);
      } catch (err) {
        console.error('Failed to load recommendations:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statusColors = {
    draft: 'bg-slate-100 text-slate-600',
    recommended: 'bg-blue-50 text-blue-700',
    approved: 'bg-emerald-50 text-emerald-700',
    rejected: 'bg-red-50 text-red-700',
    implemented: 'bg-violet-50 text-violet-700',
  };

  const priorityColors = {
    low: 'bg-slate-100 text-slate-600',
    medium: 'bg-yellow-50 text-yellow-700',
    high: 'bg-orange-50 text-orange-700',
    urgent: 'bg-red-50 text-red-700',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2" style={{fontFamily:'var(--font-heading)'}}>
          <BrainCircuit className="h-7 w-7 text-emerald-500" />
          Rekomendasi AI Distribusi Energi
        </h1>
        <p className="text-slate-500 mt-1">Hasil analisis AI berdasarkan kebutuhan energi, dampak ekonomi, lokasi, dan potensi reduksi emisi.</p>
      </div>

      {/* Score Breakdown Legend */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
        <h3 className="font-semibold text-slate-800 mb-3">Formula Skor Prioritas AI</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: 'Kebutuhan Energi', weight: '30%', color: 'bg-emerald-500' },
            { label: 'Dampak Ekonomi', weight: '25%', color: 'bg-sky-500' },
            { label: 'Jarak Distribusi', weight: '15%', color: 'bg-amber-500' },
            { label: 'Keberlanjutan', weight: '15%', color: 'bg-violet-500' },
            { label: 'Reduksi Emisi', weight: '15%', color: 'bg-rose-500' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
              <span className="text-xs text-slate-600">{item.label} ({item.weight})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations List */}
      {recommendations.length > 0 ? (
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div key={rec.id} className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-5 cursor-pointer" onClick={() => setExpanded(expanded === rec.id ? null : rec.id)}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BrainCircuit className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">{rec.business?.name || `UMKM #${rec.business_id}`}</h3>
                      <div className="flex flex-wrap gap-2 mt-1.5">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[rec.status] || statusColors.draft}`}>
                          {rec.status}
                        </span>
                        {rec.priority_score && (
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColors[rec.priority_score.priority_level] || priorityColors.low}`}>
                            {rec.priority_score.priority_level} — Skor: {rec.priority_score.total_score}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {expanded === rec.id ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
                </div>
              </div>

              {expanded === rec.id && (
                <div className="px-5 pb-5 border-t border-slate-100 pt-4 space-y-4">
                  {/* AI Summary */}
                  {rec.ai_summary && (
                    <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4">
                      <p className="text-xs font-semibold text-emerald-700 mb-1 flex items-center gap-1"><BrainCircuit className="h-3.5 w-3.5" /> AI Insight</p>
                      <p className="text-sm text-emerald-800 leading-relaxed">{rec.ai_summary}</p>
                    </div>
                  )}

                  {rec.recommendation_reason && (
                    <div className="bg-sky-50 border border-sky-100 rounded-lg p-4">
                      <p className="text-xs font-semibold text-sky-700 mb-1">Alasan Rekomendasi</p>
                      <p className="text-sm text-sky-800 leading-relaxed">{rec.recommendation_reason}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-slate-50 rounded-lg p-3">
                      <Zap className="h-4 w-4 text-amber-500 mb-1" />
                      <p className="text-xs text-slate-500">Energi Direkomendasikan</p>
                      <p className="text-sm font-semibold text-slate-800">{rec.recommended_energy_kwh} kWh</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <MapPin className="h-4 w-4 text-blue-500 mb-1" />
                      <p className="text-xs text-slate-500">Jarak</p>
                      <p className="text-sm font-semibold text-slate-800">{rec.distance_km} km</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <Building2 className="h-4 w-4 text-emerald-500 mb-1" />
                      <p className="text-xs text-slate-500">Sumber Energi</p>
                      <p className="text-sm font-semibold text-slate-800">{rec.energy_source?.name || '-'}</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <Leaf className="h-4 w-4 text-green-500 mb-1" />
                      <p className="text-xs text-slate-500">Tipe</p>
                      <p className="text-sm font-semibold text-slate-800 capitalize">{rec.energy_source?.type || '-'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-100 p-12 text-center">
          <BrainCircuit className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-800">Belum ada rekomendasi AI</h3>
          <p className="text-slate-500 mt-2">Lengkapi data UMKM dan sumber energi untuk mendapatkan rekomendasi distribusi.</p>
        </div>
      )}
    </div>
  );
}
