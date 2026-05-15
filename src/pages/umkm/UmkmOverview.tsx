import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Zap, BatteryCharging, Brain, ShoppingBag, ArrowUpRight, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import api from "@/services/api";

export default function UmkmOverview() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/dashboard/umkm").then((r) => setData(r.data.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500" /></div>;

  const cards = [
    { label: "Kebutuhan Energi (kWh)", value: Number(data?.monthly_energy_need || 0).toLocaleString(), icon: <BatteryCharging size={20} />, color: "from-emerald-500 to-teal-500" },
    { label: "Biaya Energi", value: `Rp ${Number(data?.current_energy_cost || 0).toLocaleString()}`, icon: <Zap size={20} />, color: "from-amber-500 to-orange-500" },
    { label: "Rekomendasi AI", value: data?.recommendation_count ?? 0, icon: <Brain size={20} />, color: "from-purple-500 to-pink-500" },
    { label: "Produk Aktif", value: data?.total_products ?? 0, icon: <ShoppingBag size={20} />, color: "from-cyan-500 to-blue-500" },
  ];

  return (
    <div className="space-y-8">
      <div><h1 className="text-2xl font-bold text-white">Dashboard UMKM</h1><p className="text-slate-400 mt-1">Ringkasan profil dan kebutuhan energi usaha Anda</p></div>

      {data?.profile_status === "incomplete" && (
        <Card className="bg-amber-500/10 border-amber-500/20">
          <CardContent className="p-4 flex items-start gap-3">
            <div className="p-2 rounded-full bg-amber-500/20 text-amber-400"><Zap size={20} /></div>
            <div>
              <h3 className="font-semibold text-amber-400">Profil Usaha Belum Lengkap</h3>
              <p className="text-sm text-amber-400/80 mt-1">Silakan lengkapi profil usaha dan data kebutuhan energi Anda di menu Business Profile untuk mendapatkan rekomendasi dari AI.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {data?.priority_score > 0 && (
        <Card className="bg-emerald-500/10 border-emerald-500/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-emerald-500/20 text-emerald-400"><ArrowUpRight size={20} /></div>
              <div>
                <h3 className="font-semibold text-emerald-400">Skor Prioritas: {data.priority_score}</h3>
                <p className="text-sm text-emerald-400/80">Usaha Anda diprioritaskan untuk distribusi energi bersih.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className="bg-slate-900/70 border-slate-800/60 hover:border-slate-700/80 transition-all">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div><p className="text-sm text-slate-400 mb-1">{c.label}</p><p className="text-2xl font-bold text-white truncate max-w-[120px]">{c.value}</p></div>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${c.color} text-white shadow-lg`}>{c.icon}</div>
                </div>
                <div className="flex items-center gap-1 mt-3 text-xs text-emerald-400"><TrendingUp size={12} /> <span>Active</span></div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
