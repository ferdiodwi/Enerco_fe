import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Brain, Loader2, Sparkles, Building2, Zap, ArrowRight } from "lucide-react";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import api from "@/services/api";
import { toast } from "sonner";

export default function RecommendationList() {
  const [recs, setRecs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetchData = () => {
    api.get("/recommendations", { params: { per_page: 50 } }).then((r) => setRecs(r.data.data.data)).catch(console.error).finally(() => setLoading(false));
  };
  useEffect(() => { fetchData(); }, []);

  const generate = async () => {
    setGenerating(true);
    try { const res = await api.post("/recommendations/generate"); toast.success(res.data.message); fetchData(); } catch { toast.error("Gagal generate rekomendasi"); } finally { setGenerating(false); }
  };

  const updateStatus = async (id: number, status: string) => {
    try { await api.patch(`/recommendations/${id}/status`, { status }); toast.success("Status berhasil diubah"); fetchData(); } catch { toast.error("Gagal"); }
  };

  const statusColor = (s: string) => ({ draft: "light", reviewed: "info", approved: "success", rejected: "error" }[s] || "light") as any;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Recommendations</h1><p className="text-gray-500 mt-1 dark:text-gray-400">Rekomendasi distribusi energi cerdas</p></div>
        <button onClick={generate} disabled={generating} className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-purple-500/20 disabled:opacity-50 transition-all">
          {generating ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
          {generating ? "Generating..." : "Generate AI"}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-500" /></div>
      ) : (
        <div className="grid gap-4">
          {recs.map((rec, i) => (
            <motion.div key={rec.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <div className="rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:border-gray-300 dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-gray-700">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-2 text-sm"><Building2 size={16} className="text-success-500" /><span className="text-gray-800 font-medium dark:text-white">{rec.business?.name || `UMKM #${rec.business_id}`}</span></div>
                      <ArrowRight size={14} className="text-gray-400" />
                      <div className="flex items-center gap-2 text-sm"><Zap size={16} className="text-warning-500" /><span className="text-gray-800 font-medium dark:text-white">{rec.energy_source?.name || `Source #${rec.energy_source_id}`}</span></div>
                    </div>
                    {rec.ai_summary && <p className="text-sm text-gray-600 mb-4 dark:text-gray-300">{rec.ai_summary}</p>}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40"><p className="text-xs text-gray-500 dark:text-gray-400">Energi</p><p className="text-sm font-bold text-gray-800 dark:text-white">{Number(rec.recommended_energy_kwh).toLocaleString()} kWh</p></div>
                      <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40"><p className="text-xs text-gray-500 dark:text-gray-400">Jarak</p><p className="text-sm font-bold text-gray-800 dark:text-white">{rec.distance_km} km</p></div>
                      <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40"><p className="text-xs text-gray-500 dark:text-gray-400">Hemat Biaya</p><p className="text-sm font-bold text-success-500">Rp {Number(rec.estimated_cost_saving).toLocaleString()}</p></div>
                      <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40"><p className="text-xs text-gray-500 dark:text-gray-400">Confidence</p><p className="text-sm font-bold text-purple-500 dark:text-purple-400">{rec.confidence_score}%</p></div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <Badge variant="light" color={statusColor(rec.status)}>
                      <span className="capitalize">{rec.status}</span>
                    </Badge>
                    {rec.status === "draft" && (
                      <div className="flex gap-1.5">
                        <Button size="sm" variant="outline" onClick={() => updateStatus(rec.id, "approved")} className="border-success-200 text-success-600 hover:bg-success-50 dark:border-success-500/30 dark:text-success-500 dark:hover:bg-success-500/15">Approve</Button>
                        <Button size="sm" variant="outline" onClick={() => updateStatus(rec.id, "rejected")} className="border-error-200 text-error-600 hover:bg-error-50 dark:border-error-500/30 dark:text-error-500 dark:hover:bg-error-500/15">Reject</Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          {!recs.length && (
            <div className="text-center py-16 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
              <Brain size={48} className="text-gray-300 mx-auto mb-4 dark:text-gray-600" />
              <p className="text-gray-500 mb-2 dark:text-gray-400">Belum ada rekomendasi</p>
              <p className="text-gray-400 text-sm dark:text-gray-500">Klik "Generate AI" untuk membuat rekomendasi distribusi energi otomatis</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
