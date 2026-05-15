import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Building2, Zap, Brain, Truck, ShoppingBag, TrendingUp, Leaf } from "lucide-react";
import api from "@/services/api";

interface DashboardData {
  total_users: number;
  total_businesses: number;
  total_energy_sources: number;
  total_recommendations: number;
  active_distributions: number;
  total_products: number;
  recent_recommendations: any[];
}

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export default function AdminOverview() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/dashboard/admin").then((r) => setData(r.data.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500" />
      </div>
    );
  }

  const cards = [
    { label: "Total Users", value: data?.total_users ?? 0, icon: <Users size={22} />, color: "from-blue-500 to-indigo-500" },
    { label: "Total UMKM", value: data?.total_businesses ?? 0, icon: <Building2 size={22} />, color: "from-emerald-500 to-teal-500" },
    { label: "Sumber Energi", value: data?.total_energy_sources ?? 0, icon: <Zap size={22} />, color: "from-amber-500 to-orange-500" },
    { label: "Rekomendasi AI", value: data?.total_recommendations ?? 0, icon: <Brain size={22} />, color: "from-purple-500 to-pink-500" },
    { label: "Distribusi Aktif", value: data?.active_distributions ?? 0, icon: <Truck size={22} />, color: "from-cyan-500 to-blue-500" },
    { label: "Produk Marketplace", value: data?.total_products ?? 0, icon: <ShoppingBag size={22} />, color: "from-rose-500 to-red-500" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard Admin</h1>
        <p className="text-slate-400 mt-1">Ringkasan data sistem EnergEco GlobalChain</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c, i) => (
          <motion.div
            key={c.label} initial="hidden" animate="visible" variants={fadeUp}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className="relative overflow-hidden rounded-2xl bg-slate-900/70 border border-slate-800/60 p-6 group hover:border-slate-700/80 transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">{c.label}</p>
                <p className="text-3xl font-bold text-white">{c.value}</p>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-br ${c.color} text-white shadow-lg`}>
                {c.icon}
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3 text-xs text-emerald-400">
              <TrendingUp size={12} /> <span>Active</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Recommendations */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.5 }}
        className="rounded-2xl bg-slate-900/70 border border-slate-800/60 p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Brain size={20} className="text-purple-400" /> Rekomendasi Terbaru
        </h2>
        {data?.recent_recommendations?.length ? (
          <div className="space-y-3">
            {data.recent_recommendations.map((rec: any) => (
              <div key={rec.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-800/40 border border-slate-700/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center text-purple-400">
                    <Leaf size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{rec.business?.name || `UMKM #${rec.business_id}`}</p>
                    <p className="text-xs text-slate-400">Confidence: {rec.confidence_score}%</p>
                  </div>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                  rec.status === "approved" ? "bg-emerald-500/15 text-emerald-400" :
                  rec.status === "draft" ? "bg-slate-500/15 text-slate-400" :
                  "bg-amber-500/15 text-amber-400"
                }`}>
                  {rec.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-sm">Belum ada rekomendasi. Generate melalui menu Recommendations.</p>
        )}
      </motion.div>
    </div>
  );
}
