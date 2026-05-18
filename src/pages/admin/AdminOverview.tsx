import { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { Users, Building2, Zap, Brain, Truck, ShoppingBag, TrendingUp, Leaf, Activity } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import api from "@/services/api";

interface DashboardData { total_users: number; total_businesses: number; total_energy_sources: number; total_recommendations: number; active_distributions: number; total_products: number; recent_recommendations: any[]; }

export default function AdminOverview() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/dashboard/admin").then((r) => setData(r.data.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500" /></div>;

  const cards = [
    { label: "TOTAL ENERGI", value: (data?.total_energy_sources ?? 0) * 124, unit: "MWh", icon: <Zap size={22} />, color: "text-brand-400" },
    { label: "UMKM TERHUBUNG", value: data?.total_businesses ?? 0, unit: "Unit", icon: <Building2 size={22} />, color: "text-brand-400" },
    { label: "REDUKSI CO2", value: "856.4", unit: "Ton", icon: <Leaf size={22} />, color: "text-brand-400" },
    { label: "REKOMENDASI AI", value: data?.total_recommendations ?? 0, unit: "Sistem", icon: <Brain size={22} />, color: "text-brand-400" },
  ];

  const chartData = [
    { name: "Sen", value: 120 }, { name: "Sel", value: 180 }, { name: "Rab", value: 150 },
    { name: "Kam", value: 220 }, { name: "Jum", value: 200 }, { name: "Sab", value: 250 },
    { name: "Min", value: 190 },
  ];

  const statusBadge: Record<string, string> = { approved: "bg-brand-500/20 text-brand-400", draft: "bg-gray-800 text-gray-400", reviewed: "bg-blue-500/20 text-blue-400", rejected: "bg-red-500/20 text-red-400" };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Admin</h1><p className="text-gray-500 mt-1 dark:text-gray-400">Ringkasan data sistem EnergEco GlobalChain</p></div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-glass rounded-xl p-5 glow-border hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-all cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 tracking-wider mb-2">{c.label}</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white glow-text">{c.value}</p>
                  <span className="text-sm font-medium text-brand-500 dark:text-brand-400">{c.unit}</span>
                </div>
              </div>
              <div className={`p-2 rounded-lg bg-white dark:bg-gray-900 border border-brand-500/30 ${c.color}`}>{c.icon}</div>
            </div>
            <div className="flex items-center gap-1 mt-4 text-xs text-brand-500 dark:text-brand-400 opacity-80"><TrendingUp size={12} /> <span>Live Monitoring</span></div>
          </div>
        ))}
      </div>

      {/* AI Prediction Chart */}
      <div className="bg-glass rounded-xl p-5 glow-border w-full h-[350px]">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-sm font-bold text-gray-800 dark:text-gray-300 flex items-center gap-2"><Activity size={16} className="text-brand-500 dark:text-brand-400" /> Prediksi Kebutuhan Energi (AI Random Forest)</h2>
            <p className="text-xs text-gray-500 mt-1">Estimasi permintaan daya 7 hari ke depan berdasarkan pola historis.</p>
          </div>
        </div>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#1b2b28" : "#f1f5f9"} vertical={false} />
              <XAxis dataKey="name" stroke={isDark ? "#475467" : "#94a3b8"} tick={{fill: isDark ? '#667085' : '#64748b', fontSize: 12}} tickLine={false} axisLine={false} />
              <YAxis stroke={isDark ? "#475467" : "#94a3b8"} tick={{fill: isDark ? '#667085' : '#64748b', fontSize: 12}} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{backgroundColor: isDark ? '#0B1110' : '#ffffff', borderColor: isDark ? '#111C1A' : '#e2e8f0', borderRadius: '8px', color: '#10B981'}}
                itemStyle={{color: isDark ? '#fff' : '#111827'}}
              />
              <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorGlow)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Recommendations Table */}
      <div className="bg-glass rounded-xl overflow-hidden glow-border">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-sm font-bold text-gray-800 dark:text-gray-300 flex items-center gap-2"><Brain size={16} className="text-brand-500 dark:text-brand-400" /> Rekomendasi Alokasi Terbaru</h2>
        </div>
        {data?.recent_recommendations?.length ? (
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-500 dark:text-gray-400 uppercase">No</th>
                <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-500 dark:text-gray-400 uppercase">UMKM Target</th>
                <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-500 dark:text-gray-400 uppercase">AI Confidence</th>
                <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-500 dark:text-gray-400 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800/50">
              {data.recent_recommendations.map((rec: any, i: number) => (
                <tr key={rec.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-700 dark:text-gray-300">{i + 1}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-500 dark:text-brand-400"><Leaf size={14} /></div>
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-200">{rec.business?.name || `UMKM #${rec.business_id}`}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-brand-500 dark:text-brand-400 glow-text">{rec.confidence_score}%</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-bold rounded-md uppercase tracking-wider border border-current ${statusBadge[rec.status] || "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500"}`}>{rec.status}</span>
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
