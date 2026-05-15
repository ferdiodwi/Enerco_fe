import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Zap, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

  const typeColor: Record<string, string> = { solar: "from-amber-500 to-yellow-500", wind: "from-cyan-500 to-blue-500", hydro: "from-blue-500 to-indigo-500", biomass: "from-green-500 to-emerald-500", geothermal: "from-red-500 to-orange-500", other: "from-slate-500 to-gray-500" };
  const typeLabel: Record<string, string> = { solar: "☀️ Solar", wind: "💨 Wind", hydro: "💧 Hydro", biomass: "🌿 Biomass", geothermal: "🌋 Geothermal", other: "⚡ Other" };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-white">Energy Sources</h1><p className="text-slate-400 mt-1">Data sumber energi bersih tersedia</p></div>

      <div className="flex gap-3">
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px] bg-slate-900 border-slate-700"><SelectValue placeholder="Semua Jenis" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Jenis</SelectItem>
            <SelectItem value="solar">Solar</SelectItem><SelectItem value="wind">Wind</SelectItem>
            <SelectItem value="hydro">Hydro</SelectItem><SelectItem value="biomass">Biomass</SelectItem>
            <SelectItem value="geothermal">Geothermal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500" /></div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sources.map((s, i) => (
            <motion.div key={s.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Card className="bg-slate-900/70 border-slate-800/60 hover:border-slate-700/80 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${typeColor[s.type] || typeColor.other} flex items-center justify-center text-white`}><Zap size={20} /></div>
                    <div><h3 className="font-semibold text-white">{s.name}</h3><p className="text-xs text-slate-400">{typeLabel[s.type] || s.type}</p></div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm"><span className="text-slate-400">Total Kapasitas</span><span className="text-white font-medium">{Number(s.total_capacity_kwh).toLocaleString()} kWh</span></div>
                    <div className="flex justify-between text-sm"><span className="text-slate-400">Tersedia</span><span className="text-emerald-400 font-medium">{Number(s.available_capacity_kwh).toLocaleString()} kWh</span></div>
                    <div className="w-full bg-slate-800 rounded-full h-2 mt-1">
                      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all" style={{ width: `${(s.available_capacity_kwh / s.total_capacity_kwh) * 100}%` }} />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500"><MapPin size={12} />{s.address}</div>
                  <div className="mt-4">
                    <Badge variant="outline" className={`capitalize ${s.status === "active" ? "border-emerald-500 text-emerald-400" : s.status === "maintenance" ? "border-amber-500 text-amber-400" : "border-red-500 text-red-400"}`}>
                      {s.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          {!sources.length && <Card className="col-span-full p-12 text-center bg-slate-900/70 border-slate-800/60"><p className="text-slate-500">Tidak ada sumber energi</p></Card>}
        </div>
      )}
    </div>
  );
}
