import { useEffect, useState } from "react";
import { Brain, Loader2, Sparkles, Building2, Zap, ArrowRight, Lightbulb, Bot } from "lucide-react";
import Pagination from "@/components/ui/Pagination";
import api from "@/services/api";
import { toast } from "sonner";

interface PaginationMeta { current_page: number; last_page: number; from: number; to: number; total: number; }

export default function RecommendationList() {
  const [recs, setRecs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [perPage, setPerPage] = useState(20);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<PaginationMeta>({ current_page: 1, last_page: 1, from: 0, to: 0, total: 0 });

  const fetchData = () => {
    setLoading(true);
    api.get("/recommendations", { params: { per_page: perPage, page } }).then((r) => { const d = r.data.data; setRecs(d.data); setMeta({ current_page: d.current_page, last_page: d.last_page, from: d.from || 0, to: d.to || 0, total: d.total }); }).catch(console.error).finally(() => setLoading(false));
  };
  useEffect(() => { setPage(1); }, [perPage]);
  useEffect(() => { fetchData(); }, [perPage, page]);

  const generate = async () => {
    setGenerating(true);
    try { const res = await api.post("/recommendations/generate"); toast.success(res.data.message); fetchData(); } catch { toast.error("Gagal generate rekomendasi"); } finally { setGenerating(false); }
  };

  const updateStatus = async (id: number, status: string) => {
    try { await api.patch(`/recommendations/${id}/status`, { status }); toast.success("Status berhasil diubah"); fetchData(); } catch { toast.error("Gagal"); }
  };

  const statusBadge: Record<string, string> = { draft: "bg-gray-800 text-gray-400", reviewed: "bg-blue-500/20 text-blue-400", approved: "bg-brand-500/20 text-brand-400", rejected: "bg-red-500/20 text-red-400" };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900 dark:text-gray-200">AI Recommendations</h1><p className="text-gray-500 mt-1">Sistem rekomendasi alokasi cerdas berbasis Random Forest</p></div>
        <button onClick={generate} disabled={generating} className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-lg bg-brand-500/10 border border-brand-500 text-brand-400 transition hover:bg-brand-500/20 disabled:opacity-50 glow-border uppercase tracking-wider">
          {generating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
          {generating ? "PROCESSING..." : "GENERATE AI"}
        </button>
      </div>

      {/* LLM Insight Widget */}
      <div className="bg-glass p-5 rounded-xl glow-border">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400 shrink-0 glow-border">
            <Bot size={24} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-300 uppercase tracking-wider mb-2">LLM Insight Generator</h3>
            <p className="text-sm text-brand-400 font-medium leading-relaxed glow-text">
              "Berdasarkan analisis model Weighted Scoring & Random Forest, terdapat peningkatan efisiensi distribusi sebesar 24% pada kluster UMKM Zona Selatan. Prediksi kebutuhan energi stabil. Confidence level rata-rata mencapai 92%. Rekomendasi: Eksekusi alokasi draft untuk mengoptimalkan reduksi CO2."
            </p>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-glass p-4 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <span className="font-bold tracking-wider uppercase text-xs">Tampilkan</span>
        <select value={perPage} onChange={(e) => setPerPage(Number(e.target.value))} className="px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-brand-500 focus:outline-none">
          <option value={10}>10</option><option value={20}>20</option><option value={50}>50</option>
        </select>
        <span className="font-bold tracking-wider uppercase text-xs">baris</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-glass border border-gray-200 dark:border-gray-800 rounded-xl glow-border">
        {loading ? (
          <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-500" /></div>
        ) : (
          <table className="w-full min-w-[1000px]">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold tracking-wider text-left text-gray-500 dark:text-gray-400 uppercase">No</th>
                <th className="px-6 py-4 text-xs font-bold tracking-wider text-left text-gray-500 dark:text-gray-400 uppercase">Distribusi (UMKM ← Energi)</th>
                <th className="px-6 py-4 text-xs font-bold tracking-wider text-left text-gray-500 dark:text-gray-400 uppercase">Daya (kWh)</th>
                <th className="px-6 py-4 text-xs font-bold tracking-wider text-left text-gray-500 dark:text-gray-400 uppercase">Jarak</th>
                <th className="px-6 py-4 text-xs font-bold tracking-wider text-left text-gray-500 dark:text-gray-400 uppercase">Hemat Biaya</th>
                <th className="px-6 py-4 text-xs font-bold tracking-wider text-left text-gray-500 dark:text-gray-400 uppercase">AI Confidence</th>
                <th className="px-6 py-4 text-xs font-bold tracking-wider text-left text-gray-500 dark:text-gray-400 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-bold tracking-wider text-left text-gray-500 dark:text-gray-400 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800/50">
              {recs.map((rec, i) => (
                <tr key={rec.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-gray-800 dark:text-gray-300">{i + 1 + meta.from - 1}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 size={16} className="text-brand-400 flex-shrink-0" />
                      <span className="font-bold text-gray-900 dark:text-gray-200">{rec.business?.name || `#${rec.business_id}`}</span>
                      <ArrowRight size={14} className="text-gray-400 dark:text-gray-500 flex-shrink-0 mx-2" />
                      <Zap size={16} className="text-orange-500 dark:text-orange-400 flex-shrink-0" />
                      <span className="font-bold text-gray-900 dark:text-gray-200">{rec.energy_source?.name || `#${rec.energy_source_id}`}</span>
                    </div>
                    {rec.ai_summary && <p className="text-xs text-brand-600 dark:text-brand-500/80 mt-2 italic border-l-2 border-brand-500/30 pl-2 leading-relaxed">{rec.ai_summary}</p>}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-gray-200">{Number(rec.recommended_energy_kwh).toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-400">{rec.distance_km} km</td>
                  <td className="px-6 py-4 text-sm font-bold text-brand-500 dark:text-brand-400 glow-text">Rp {Number(rec.estimated_cost_saving).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-500 shadow-[0_0_8px_#10B981]" style={{width: `${rec.confidence_score}%`}}></div>
                      </div>
                      <span className="text-sm font-bold text-brand-500 dark:text-brand-400 glow-text">{rec.confidence_score}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-bold rounded-md uppercase tracking-wider border border-current ${statusBadge[rec.status] || "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500"}`}>{rec.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    {rec.status === "draft" && (
                      <div className="flex gap-2">
                        <button onClick={() => updateStatus(rec.id, "approved")} className="px-3 py-1.5 text-xs font-bold text-brand-400 border border-brand-500/30 hover:bg-brand-500/10 rounded-md transition-colors">APPROVE</button>
                        <button onClick={() => updateStatus(rec.id, "rejected")} className="px-3 py-1.5 text-xs font-bold text-red-400 border border-red-500/30 hover:bg-red-500/10 rounded-md transition-colors">REJECT</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {!recs.length && (
                <tr><td colSpan={8} className="px-6 py-16 text-center">
                  <Brain size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-800" />
                  <div className="text-brand-500 dark:text-brand-400 font-bold uppercase tracking-wider glow-text">Belum ada rekomendasi alokasi</div>
                  <p className="text-sm text-gray-500 mt-2">Klik "GENERATE AI" untuk memproses data distribusi terbaru</p>
                </td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <Pagination from={meta.from} to={meta.to} total={meta.total} currentPage={meta.current_page} lastPage={meta.last_page} onPageChange={setPage} />
    </div>
  );
}
