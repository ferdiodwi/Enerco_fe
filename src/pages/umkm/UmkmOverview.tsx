import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Zap, BatteryCharging, Brain, ShoppingBag, ArrowUpRight, TrendingUp } from "lucide-react";
import api from "@/services/api";

export default function UmkmOverview() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/dashboard/umkm").then((r) => setData(r.data.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-500" /></div>;

  const cards = [
    { label: "Kebutuhan Energi (kWh)", value: Number(data?.monthly_energy_need || 0).toLocaleString(), icon: <BatteryCharging size={20} />, color: "from-emerald-500 to-teal-500" },
    { label: "Biaya Energi", value: `Rp ${Number(data?.current_energy_cost || 0).toLocaleString()}`, icon: <Zap size={20} />, color: "from-amber-500 to-orange-500" },
    { label: "Rekomendasi AI", value: data?.recommendation_count ?? 0, icon: <Brain size={20} />, color: "from-purple-500 to-pink-500" },
    { label: "Produk Aktif", value: data?.total_products ?? 0, icon: <ShoppingBag size={20} />, color: "from-cyan-500 to-blue-500" },
  ];

  return (
    <div className="space-y-8">
      <div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard UMKM</h1><p className="text-gray-500 mt-1 dark:text-gray-400">Ringkasan profil dan kebutuhan energi usaha Anda</p></div>

      {data?.profile_status === "incomplete" && (
        <div className="rounded-2xl border border-warning-200 bg-warning-50 p-4 dark:border-warning-500/20 dark:bg-warning-500/10">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-warning-100 text-warning-600 dark:bg-warning-500/20 dark:text-warning-500"><Zap size={20} /></div>
            <div>
              <h3 className="font-semibold text-warning-700 dark:text-warning-500">Profil Usaha Belum Lengkap</h3>
              <p className="text-sm text-warning-600 mt-1 dark:text-warning-500/80">Silakan lengkapi profil usaha dan data kebutuhan energi Anda di menu Business Profile untuk mendapatkan rekomendasi dari AI.</p>
            </div>
          </div>
        </div>
      )}

      {data?.priority_score > 0 && (
        <div className="rounded-2xl border border-success-200 bg-success-50 p-4 dark:border-success-500/20 dark:bg-success-500/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-success-100 text-success-600 dark:bg-success-500/20 dark:text-success-500"><ArrowUpRight size={20} /></div>
              <div>
                <h3 className="font-semibold text-success-700 dark:text-success-500">Skor Prioritas: {data.priority_score}</h3>
                <p className="text-sm text-success-600 dark:text-success-500/80">Usaha Anda diprioritaskan untuk distribusi energi bersih.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:border-gray-300 dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-gray-700">
              <div className="flex items-start justify-between">
                <div><p className="text-sm text-gray-500 mb-1 dark:text-gray-400">{c.label}</p><p className="text-2xl font-bold text-gray-800 truncate max-w-[120px] dark:text-white">{c.value}</p></div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${c.color} text-white shadow-lg`}>{c.icon}</div>
              </div>
              <div className="flex items-center gap-1 mt-3 text-xs text-success-500"><TrendingUp size={12} /> <span>Active</span></div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
