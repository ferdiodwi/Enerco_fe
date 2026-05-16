import { useEffect, useState } from "react";
import { Users, Building2, Zap, Brain, Truck, ShoppingBag, TrendingUp, Leaf } from "lucide-react";
import api from "@/services/api";

interface DashboardData { total_users: number; total_businesses: number; total_energy_sources: number; total_recommendations: number; active_distributions: number; total_products: number; recent_recommendations: any[]; }

export default function AdminOverview() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/dashboard/admin").then((r) => setData(r.data.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500" /></div>;

  const cards = [
    { label: "Total Users", value: data?.total_users ?? 0, icon: <Users size={22} />, color: "from-blue-500 to-indigo-500" },
    { label: "Total UMKM", value: data?.total_businesses ?? 0, icon: <Building2 size={22} />, color: "from-emerald-500 to-teal-500" },
    { label: "Sumber Energi", value: data?.total_energy_sources ?? 0, icon: <Zap size={22} />, color: "from-amber-500 to-orange-500" },
    { label: "Rekomendasi AI", value: data?.total_recommendations ?? 0, icon: <Brain size={22} />, color: "from-purple-500 to-pink-500" },
    { label: "Distribusi Aktif", value: data?.active_distributions ?? 0, icon: <Truck size={22} />, color: "from-cyan-500 to-blue-500" },
    { label: "Produk Marketplace", value: data?.total_products ?? 0, icon: <ShoppingBag size={22} />, color: "from-rose-500 to-red-500" },
  ];

  const statusBadge: Record<string, string> = { approved: "bg-green-100 text-green-700", draft: "bg-gray-100 text-gray-600", reviewed: "bg-blue-100 text-blue-700", rejected: "bg-red-100 text-red-700" };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Admin</h1><p className="text-gray-500 mt-1 dark:text-gray-400">Ringkasan data sistem EnergEco GlobalChain</p></div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 dark:bg-white/[0.03] dark:border-gray-800">
            <div className="flex items-start justify-between">
              <div><p className="text-sm text-gray-500 mb-1 dark:text-gray-400">{c.label}</p><p className="text-3xl font-bold text-gray-800 dark:text-white">{c.value}</p></div>
              <div className={`p-3 rounded-xl bg-gradient-to-br ${c.color} text-white shadow-lg`}>{c.icon}</div>
            </div>
            <div className="flex items-center gap-1 mt-3 text-xs text-emerald-500"><TrendingUp size={12} /> <span>Active</span></div>
          </div>
        ))}
      </div>

      {/* Recent Recommendations Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden dark:bg-white/[0.03] dark:border-gray-800">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 dark:text-white"><Brain size={20} className="text-purple-400" /> Rekomendasi Terbaru</h2>
        </div>
        {data?.recent_recommendations?.length ? (
          <table className="w-full">
            <thead className="bg-gray-200 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-700 uppercase dark:text-gray-300">No</th>
                <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-700 uppercase dark:text-gray-300">UMKM</th>
                <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-700 uppercase dark:text-gray-300">Confidence</th>
                <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-700 uppercase dark:text-gray-300">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {data.recent_recommendations.map((rec: any, i: number) => (
                <tr key={rec.id} className="hover:bg-gray-50 transition-colors dark:hover:bg-white/[0.03]">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{i + 1}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-500/15 flex items-center justify-center text-purple-400"><Leaf size={14} /></div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{rec.business?.name || `UMKM #${rec.business_id}`}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-purple-600 dark:text-purple-400">{rec.confidence_score}%</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${statusBadge[rec.status] || "bg-gray-100 text-gray-500"}`}>{rec.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="px-6 py-12 text-center">
            <Brain size={40} className="mx-auto mb-3 text-gray-300 dark:text-gray-600" />
            <p className="text-gray-500 text-sm dark:text-gray-400">Belum ada rekomendasi. Generate melalui menu Recommendations.</p>
          </div>
        )}
      </div>
    </div>
  );
}
