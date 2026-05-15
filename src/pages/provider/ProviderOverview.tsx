import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Zap, BatteryCharging, Truck } from "lucide-react";
import api from "@/services/api";

export default function ProviderOverview() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/dashboard/provider").then((r) => setData(r.data.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500" /></div>;

  const cards = [
    { label: "Sumber Energi", value: data?.total_sources, icon: <Zap size={20} />, color: "from-amber-500 to-orange-500" },
    { label: "Total Kapasitas (kWh)", value: Number(data?.total_capacity || 0).toLocaleString(), icon: <BatteryCharging size={20} />, color: "from-emerald-500 to-teal-500" },
    { label: "Kapasitas Tersedia (kWh)", value: Number(data?.available_capacity || 0).toLocaleString(), icon: <BatteryCharging size={20} />, color: "from-cyan-500 to-blue-500" },
    { label: "Distribusi Aktif", value: data?.active_distributions, icon: <Truck size={20} />, color: "from-purple-500 to-pink-500" },
  ];

  return (
    <div className="space-y-8">
      <div><h1 className="text-2xl font-bold text-white">Dashboard Provider</h1><p className="text-slate-400 mt-1">Kelola sumber energi dan distribusi Anda</p></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="rounded-2xl bg-slate-900/70 border border-slate-800/60 p-6">
            <div className="flex items-start justify-between"><div><p className="text-sm text-slate-400 mb-1">{c.label}</p><p className="text-3xl font-bold text-white">{c.value}</p></div>
              <div className={`p-3 rounded-xl bg-gradient-to-br ${c.color} text-white shadow-lg`}>{c.icon}</div></div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
