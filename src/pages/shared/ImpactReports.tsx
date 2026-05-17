import { useState } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Leaf, TrendingUp, Zap, Factory, DollarSign, Download } from "lucide-react";
import { toast } from "sonner";

// Mock Data
const emissionData = [
  { month: "Jan", target: 500, actual: 420 },
  { month: "Feb", target: 600, actual: 580 },
  { month: "Mar", target: 700, actual: 690 },
  { month: "Apr", target: 800, actual: 950 },
  { month: "May", target: 900, actual: 1120 },
  { month: "Jun", target: 1000, actual: 1350 },
];

const savingData = [
  { month: "Jan", saving: 15 },
  { month: "Feb", saving: 22 },
  { month: "Mar", saving: 28 },
  { month: "Apr", saving: 35 },
  { month: "May", saving: 45 },
  { month: "Jun", saving: 58 },
];

const sectorData = [
  { name: "Agroindustri", value: 45 },
  { name: "Manufaktur", value: 25 },
  { name: "Pariwisata", value: 15 },
  { name: "Retail", value: 15 },
];

export default function ImpactReports() {
  const [period, setPeriod] = useState("6months");

  const handleExport = () => {
    toast.success("Laporan sedang di-generate...");
    setTimeout(() => toast.success("Laporan berhasil diunduh (PDF)"), 2000);
  };

  const statCards = [
    { title: "Total Reduksi Emisi", value: "4,250", unit: "kg CO₂", icon: <Leaf size={24} />, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
    { title: "Penghematan Biaya", value: "58.5", unit: "Juta Rp", icon: <DollarSign size={24} />, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10" },
    { title: "Energi Tersalurkan", value: "124.5", unit: "MWh", icon: <Zap size={24} />, color: "text-cyan-500", bg: "bg-cyan-50 dark:bg-cyan-500/10" },
    { title: "UMKM Terbantu", value: "156", unit: "Bisnis", icon: <Factory size={24} />, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-500/10" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Impact & Analytics</h1>
          <p className="text-gray-500 mt-1 dark:text-gray-400">Laporan dampak ekonomi dan lingkungan dari penyaluran energi bersih.</p>
        </div>
        <div className="flex items-center gap-3">
          <select value={period} onChange={(e) => setPeriod(e.target.value)} className="px-4 py-2 text-sm rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-emerald-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white">
            <option value="1month">1 Bulan Terakhir</option>
            <option value="6months">6 Bulan Terakhir</option>
            <option value="1year">1 Tahun Terakhir</option>
          </select>
          <button onClick={handleExport} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white transition">
            <Download size={16} /> Export PDF
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 dark:bg-gray-900 dark:border-gray-800">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{s.title}</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">{s.value}</span>
                  <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">{s.unit}</span>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.bg} ${s.color}`}>
                {s.icon}
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <TrendingUp size={14} /> <span>+12.5% dari bulan lalu</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Emission Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 dark:bg-gray-900 dark:border-gray-800">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Reduksi Emisi Karbon</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Target vs Aktual Pengurangan CO₂ (kg)</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={emissionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                <RechartsTooltip cursor={{ fill: '#F3F4F6', opacity: 0.1 }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="target" name="Target" fill="#9CA3AF" radius={[4, 4, 0, 0]} barSize={20} opacity={0.5} />
                <Bar dataKey="actual" name="Aktual" fill="#10B981" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cost Savings Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 dark:bg-gray-900 dark:border-gray-800">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Penghematan Biaya Energi</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total akumulasi penghematan UMKM (Juta Rp)</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={savingData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSaving" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="saving" name="Penghematan" stroke="#F59E0B" strokeWidth={3} fillOpacity={1} fill="url(#colorSaving)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
