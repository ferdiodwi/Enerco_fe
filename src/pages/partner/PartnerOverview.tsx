import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Building2, ShoppingBag, Handshake, Clock } from "lucide-react";
import api from "@/services/api";

export default function PartnerOverview() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/dashboard/partner").then((r) => setData(r.data.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500" /></div>;

  const cards = [
    { label: "UMKM Potensial", value: data?.potential_businesses, icon: <Building2 size={20} />, color: "from-emerald-500 to-teal-500" },
    { label: "Produk Lokal", value: data?.total_products, icon: <ShoppingBag size={20} />, color: "from-amber-500 to-orange-500" },
    { label: "Total Kemitraan", value: data?.my_partnerships, icon: <Handshake size={20} />, color: "from-purple-500 to-pink-500" },
    { label: "Menunggu Respon", value: data?.pending_partnerships, icon: <Clock size={20} />, color: "from-cyan-500 to-blue-500" },
  ];

  return (
    <div className="space-y-8">
      <div><h1 className="text-2xl font-bold text-white">Dashboard Partner</h1><p className="text-slate-400 mt-1">Temukan peluang kemitraan dan UMKM potensial</p></div>
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
