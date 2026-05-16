import { useEffect, useState } from "react";
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
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard UMKM</h1><p className="text-gray-500 mt-1 dark:text-gray-400">Ringkasan profil dan kebutuhan energi usaha Anda</p></div>

      {data?.profile_status === "incomplete" && (
        <div className="bg-white rounded-xl shadow-sm border border-amber-200 p-4 dark:bg-white/[0.03] dark:border-amber-500/30">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0 dark:bg-amber-500/15"><Zap size={20} className="text-amber-600 dark:text-amber-400" /></div>
            <div>
              <h3 className="font-semibold text-amber-700 dark:text-amber-400">Profil Usaha Belum Lengkap</h3>
              <p className="text-sm text-amber-600 mt-1 dark:text-amber-500/80">Silakan lengkapi profil usaha dan data kebutuhan energi Anda di menu Business Profile untuk mendapatkan rekomendasi dari AI.</p>
            </div>
          </div>
        </div>
      )}

      {data?.priority_score > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-emerald-200 p-4 dark:bg-white/[0.03] dark:border-emerald-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0 dark:bg-emerald-500/15"><ArrowUpRight size={20} className="text-emerald-600 dark:text-emerald-400" /></div>
            <div>
              <h3 className="font-semibold text-emerald-700 dark:text-emerald-400">Skor Prioritas: {data.priority_score}</h3>
              <p className="text-sm text-emerald-600 dark:text-emerald-500/80">Usaha Anda diprioritaskan untuk distribusi energi bersih.</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 dark:bg-white/[0.03] dark:border-gray-800">
            <div className="flex items-start justify-between">
              <div><p className="text-sm text-gray-500 mb-1 dark:text-gray-400">{c.label}</p><p className="text-2xl font-bold text-gray-800 truncate max-w-[140px] dark:text-white">{c.value}</p></div>
              <div className={`p-3 rounded-xl bg-gradient-to-br ${c.color} text-white shadow-lg`}>{c.icon}</div>
            </div>
            <div className="flex items-center gap-1 mt-3 text-xs text-emerald-500"><TrendingUp size={12} /> <span>Active</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}
