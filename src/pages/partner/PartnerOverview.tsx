import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Building2, ShoppingBag, Handshake, Clock, TrendingUp } from "lucide-react";
import api from "@/services/api";

export default function PartnerOverview() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/dashboard/partner").then((r) => setData(r.data.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-500" /></div>;

  const cards = [
    { label: "UMKM Potensial", value: data?.potential_businesses ?? 0, icon: <Building2 size={20} />, color: "from-emerald-500 to-teal-500" },
    { label: "Produk Lokal", value: data?.total_products ?? 0, icon: <ShoppingBag size={20} />, color: "from-amber-500 to-orange-500" },
    { label: "Total Kemitraan", value: data?.my_partnerships ?? 0, icon: <Handshake size={20} />, color: "from-purple-500 to-pink-500" },
    { label: "Menunggu Respon", value: data?.pending_partnerships ?? 0, icon: <Clock size={20} />, color: "from-cyan-500 to-blue-500" },
  ];

  return (
    <div className="space-y-8">
      <div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Partner</h1><p className="text-gray-500 mt-1 dark:text-gray-400">Temukan peluang kemitraan dan UMKM potensial</p></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:border-gray-300 dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-gray-700">
              <div className="flex items-start justify-between">
                <div><p className="text-sm text-gray-500 mb-1 dark:text-gray-400">{c.label}</p><p className="text-3xl font-bold text-gray-800 dark:text-white">{c.value}</p></div>
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
