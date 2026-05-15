import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Brain, Loader2, Sparkles, Building2, Zap, ArrowRight } from "lucide-react";
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
    try {
      const res = await api.post("/recommendations/generate");
      toast.success(res.data.message);
      fetchData();
    } catch { toast.error("Gagal generate rekomendasi"); }
    finally { setGenerating(false); }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      await api.patch(`/recommendations/${id}/status`, { status });
      toast.success("Status berhasil diubah");
      fetchData();
    } catch { toast.error("Gagal mengubah status"); }
  };

  const statusColor = (s: string) => ({
    draft: "bg-slate-500/15 text-slate-400", reviewed: "bg-blue-500/15 text-blue-400",
    approved: "bg-emerald-500/15 text-emerald-400", rejected: "bg-red-500/15 text-red-400",
  }[s] || "bg-slate-500/15 text-slate-400");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">AI Recommendations</h1><p className="text-slate-400 mt-1">Rekomendasi distribusi energi cerdas</p></div>
        <button onClick={generate} disabled={generating}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-400 hover:to-pink-400 transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50">
          {generating ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
          {generating ? "Generating..." : "Generate AI"}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500" /></div>
      ) : (
        <div className="grid gap-4">
          {recs.map((rec, i) => (
            <motion.div key={rec.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="rounded-2xl bg-slate-900/70 border border-slate-800/60 p-6 hover:border-slate-700/80 transition-all">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 size={16} className="text-emerald-400" />
                      <span className="text-white font-medium">{rec.business?.name || `UMKM #${rec.business_id}`}</span>
                    </div>
                    <ArrowRight size={14} className="text-slate-600" />
                    <div className="flex items-center gap-2 text-sm">
                      <Zap size={16} className="text-amber-400" />
                      <span className="text-white font-medium">{rec.energy_source?.name || `Source #${rec.energy_source_id}`}</span>
                    </div>
                  </div>
                  {rec.ai_summary && <p className="text-sm text-slate-300 mb-3">{rec.ai_summary}</p>}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-xl bg-slate-800/40"><p className="text-xs text-slate-400">Energi</p><p className="text-sm font-bold text-white">{Number(rec.recommended_energy_kwh).toLocaleString()} kWh</p></div>
                    <div className="p-3 rounded-xl bg-slate-800/40"><p className="text-xs text-slate-400">Jarak</p><p className="text-sm font-bold text-white">{rec.distance_km} km</p></div>
                    <div className="p-3 rounded-xl bg-slate-800/40"><p className="text-xs text-slate-400">Hemat Biaya</p><p className="text-sm font-bold text-emerald-400">Rp {Number(rec.estimated_cost_saving).toLocaleString()}</p></div>
                    <div className="p-3 rounded-xl bg-slate-800/40"><p className="text-xs text-slate-400">Confidence</p><p className="text-sm font-bold text-purple-400">{rec.confidence_score}%</p></div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`text-xs px-3 py-1.5 rounded-full font-medium capitalize ${statusColor(rec.status)}`}>{rec.status}</span>
                  {rec.status === "draft" && (
                    <div className="flex gap-1.5 mt-1">
                      <button onClick={() => updateStatus(rec.id, "approved")} className="px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 text-xs font-medium hover:bg-emerald-500/25 transition">Approve</button>
                      <button onClick={() => updateStatus(rec.id, "rejected")} className="px-3 py-1.5 rounded-lg bg-red-500/15 text-red-400 text-xs font-medium hover:bg-red-500/25 transition">Reject</button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          {!recs.length && (
            <div className="text-center py-16 rounded-2xl bg-slate-900/70 border border-slate-800/60">
              <Brain size={48} className="text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 mb-2">Belum ada rekomendasi</p>
              <p className="text-slate-500 text-sm">Klik "Generate AI" untuk membuat rekomendasi distribusi energi otomatis</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
