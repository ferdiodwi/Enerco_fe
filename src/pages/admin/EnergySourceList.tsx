import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Zap, MapPin } from "lucide-react";
import Badge from "@/components/ui/badge/Badge";
import Select from "@/components/form/Select";
import api from "@/services/api";

export default function EnergySourceList() {
  const [sources, setSources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    const params: any = { per_page: 50 };
    if (typeFilter && typeFilter !== "all") params.type = typeFilter;
    api.get("/energy-sources", { params }).then((r) => setSources(r.data.data.data)).catch(console.error).finally(() => setLoading(false));
  }, [typeFilter]);

  const typeOptions = [
    { value: "all", label: "Semua Jenis" },
    { value: "solar", label: "Solar" },
    { value: "wind", label: "Wind" },
    { value: "hydro", label: "Hydro" },
    { value: "biomass", label: "Biomass" },
    { value: "geothermal", label: "Geothermal" },
  ];

  const typeColor: Record<string, string> = { solar: "from-amber-500 to-yellow-500", wind: "from-cyan-500 to-blue-500", hydro: "from-blue-500 to-indigo-500", biomass: "from-green-500 to-emerald-500", geothermal: "from-red-500 to-orange-500", other: "from-gray-500 to-gray-400" };
  const typeLabel: Record<string, string> = { solar: "☀️ Solar", wind: "💨 Wind", hydro: "💧 Hydro", biomass: "🌿 Biomass", geothermal: "🌋 Geothermal", other: "⚡ Other" };

  const getStatusColor = (s: string) => s === "active" ? "success" : s === "maintenance" ? "warning" : "error";

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Energy Sources</h1><p className="text-gray-500 mt-1 dark:text-gray-400">Data sumber energi bersih tersedia</p></div>

      <div className="flex gap-3">
        <div className="w-[180px]">
          <Select options={typeOptions} defaultValue={typeFilter} onChange={setTypeFilter} />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-500" /></div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sources.map((s, i) => (
            <motion.div key={s.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <div className="rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:border-gray-300 dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${typeColor[s.type] || typeColor.other} flex items-center justify-center text-white`}><Zap size={20} /></div>
                  <div><h3 className="font-semibold text-gray-800 dark:text-white">{s.name}</h3><p className="text-xs text-gray-500 dark:text-gray-400">{typeLabel[s.type] || s.type}</p></div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm"><span className="text-gray-500 dark:text-gray-400">Total Kapasitas</span><span className="text-gray-800 font-medium dark:text-white">{Number(s.total_capacity_kwh).toLocaleString()} kWh</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-500 dark:text-gray-400">Tersedia</span><span className="text-success-500 font-medium">{Number(s.available_capacity_kwh).toLocaleString()} kWh</span></div>
                  <div className="w-full bg-gray-100 rounded-full h-2 mt-1 dark:bg-gray-800">
                    <div className="bg-gradient-to-r from-success-500 to-teal-500 h-2 rounded-full transition-all" style={{ width: `${(s.available_capacity_kwh / s.total_capacity_kwh) * 100}%` }} />
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400"><MapPin size={12} />{s.address}</div>
                <div className="mt-4">
                  <Badge variant="light" color={getStatusColor(s.status)}>
                    <span className="capitalize">{s.status}</span>
                  </Badge>
                </div>
              </div>
            </motion.div>
          ))}
          {!sources.length && <div className="col-span-full p-12 text-center rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"><p className="text-gray-500 dark:text-gray-400">Tidak ada sumber energi</p></div>}
        </div>
      )}
    </div>
  );
}
