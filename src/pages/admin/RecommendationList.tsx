import { useEffect, useState } from "react";
import { Brain, Loader2, Sparkles, Building2, Zap, ArrowRight } from "lucide-react";
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

  const statusBadge: Record<string, string> = { draft: "bg-gray-100 text-gray-600", reviewed: "bg-blue-100 text-blue-700", approved: "bg-green-100 text-green-700", rejected: "bg-red-100 text-red-700" };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Recommendations</h1><p className="text-gray-500 mt-1 dark:text-gray-400">Rekomendasi distribusi energi cerdas</p></div>
        <button onClick={generate} disabled={generating} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white transition disabled:opacity-50">
          {generating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
          {generating ? "Generating..." : "Generate AI"}
        </button>
      </div>

      {/* Filter */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center gap-2 text-sm text-gray-600 dark:bg-white/[0.03] dark:border-gray-800 dark:text-gray-400">
        <span>Tampilkan</span>
        <select value={perPage} onChange={(e) => setPerPage(Number(e.target.value))} className="px-3 py-1.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-brand-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white">
          <option value={10}>10</option><option value={20}>20</option><option value={50}>50</option>
        </select>
        <span>baris</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-white/[0.03] dark:border-gray-800">
        {loading ? (
          <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-500" /></div>
        ) : (
          <table className="w-full min-w-[1000px]">
            <thead className="bg-gray-200 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-700 uppercase dark:text-gray-300">No</th>
                <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-700 uppercase dark:text-gray-300">UMKM → Sumber Energi</th>
                <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-700 uppercase dark:text-gray-300">Energi (kWh)</th>
                <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-700 uppercase dark:text-gray-300">Jarak</th>
                <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-700 uppercase dark:text-gray-300">Hemat Biaya</th>
                <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-700 uppercase dark:text-gray-300">Confidence</th>
                <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-700 uppercase dark:text-gray-300">Status</th>
                <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-700 uppercase dark:text-gray-300">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {recs.map((rec, i) => (
                <tr key={rec.id} className="hover:bg-gray-50 transition-colors dark:hover:bg-white/[0.03]">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{i + 1}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 size={14} className="text-emerald-500 flex-shrink-0" />
                      <span className="font-medium text-gray-900 dark:text-white">{rec.business?.name || `#${rec.business_id}`}</span>
                      <ArrowRight size={12} className="text-gray-400 flex-shrink-0" />
                      <Zap size={14} className="text-amber-500 flex-shrink-0" />
                      <span className="font-medium text-gray-900 dark:text-white">{rec.energy_source?.name || `#${rec.energy_source_id}`}</span>
                    </div>
                    {rec.ai_summary && <p className="text-xs text-gray-400 mt-1 line-clamp-1">{rec.ai_summary}</p>}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{Number(rec.recommended_energy_kwh).toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{rec.distance_km} km</td>
                  <td className="px-6 py-4 text-sm font-medium text-emerald-600">Rp {Number(rec.estimated_cost_saving).toLocaleString()}</td>
                  <td className="px-6 py-4"><span className="text-sm font-bold text-purple-600 dark:text-purple-400">{rec.confidence_score}%</span></td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${statusBadge[rec.status] || "bg-gray-100 text-gray-500"}`}>{rec.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    {rec.status === "draft" && (
                      <div className="flex gap-2">
                        <button onClick={() => updateStatus(rec.id, "approved")} className="px-3 py-1 text-sm text-emerald-600 hover:text-emerald-700 font-medium">Approve</button>
                        <button onClick={() => updateStatus(rec.id, "rejected")} className="px-3 py-1 text-sm text-red-600 hover:text-red-700 font-medium">Reject</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {!recs.length && (
                <tr><td colSpan={8} className="px-6 py-16 text-center">
                  <Brain size={40} className="mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                  <div className="text-gray-500 font-medium dark:text-gray-400">Belum ada rekomendasi</div>
                  <p className="text-sm text-gray-400 mt-1 dark:text-gray-500">Klik "Generate AI" untuk membuat rekomendasi distribusi energi otomatis</p>
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
