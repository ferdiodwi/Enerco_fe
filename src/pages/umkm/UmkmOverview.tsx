import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Building2, Zap, Brain, TrendingUp, Leaf, ShoppingBag } from "lucide-react";
import api from "@/services/api";
import { useAuth } from "@/hooks/useAuth";

export default function UmkmOverview() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/dashboard/umkm").then((r) => setData(r.data.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500" /></div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Halo, {user?.name}! 👋</h1>
        <p className="text-slate-400 mt-1">Dashboard UMKM Anda</p>
      </div>

      {!data?.has_business ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 p-8 text-center">
          <Building2 size={48} className="text-emerald-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Buat Profil Usaha</h2>
          <p className="text-slate-400 mb-6">Mulai dengan membuat profil usaha Anda untuk mendapatkan rekomendasi energi bersih.</p>
          <a href="/umkm/business" className="inline-flex px-6 py-3 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-400 transition">
            Buat Profil Sekarang
          </a>
        </motion.div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Status Verifikasi", value: data.verification_status, icon: <Building2 size={20} />, color: data.verification_status === "verified" ? "text-emerald-400" : "text-amber-400" },
              { label: "Kebutuhan Energi", value: data.energy_needs_count, icon: <Zap size={20} />, color: "text-amber-400" },
              { label: "Rekomendasi", value: data.recommendations_count, icon: <Brain size={20} />, color: "text-purple-400" },
              { label: "Produk", value: data.products_count, icon: <ShoppingBag size={20} />, color: "text-rose-400" },
            ].map((c, i) => (
              <motion.div key={c.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="rounded-2xl bg-slate-900/70 border border-slate-800/60 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className={c.color}>{c.icon}</span>
                  <span className="text-sm text-slate-400">{c.label}</span>
                </div>
                <p className="text-2xl font-bold text-white capitalize">{c.value}</p>
              </motion.div>
            ))}
          </div>

          {data.latest_score && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="rounded-2xl bg-slate-900/70 border border-slate-800/60 p-6">
              <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <TrendingUp size={20} className="text-emerald-400" /> Skor Prioritas
              </h2>
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{data.latest_score.score}</span>
                </div>
                <div>
                  <p className="text-lg font-medium text-white">{data.latest_score.category}</p>
                  <p className="text-sm text-slate-400 mt-1">Skor dihitung berdasarkan kebutuhan energi, dampak ekonomi, dan jarak ke sumber energi.</p>
                </div>
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
