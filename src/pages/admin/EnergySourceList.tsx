import { useEffect, useState } from "react";
import { Zap, Search, MapPin } from "lucide-react";
import Pagination from "@/components/ui/Pagination";
import api from "@/services/api";

interface PaginationMeta { current_page: number; last_page: number; from: number; to: number; total: number; }

export default function EnergySourceList() {
  const [sources, setSources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("");
  const [perPage, setPerPage] = useState(20);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<PaginationMeta>({ current_page: 1, last_page: 1, from: 0, to: 0, total: 0 });

  useEffect(() => { setPage(1); }, [typeFilter, perPage]);
  useEffect(() => {
    setLoading(true);
    const params: any = { per_page: perPage, page };
    if (typeFilter) params.type = typeFilter;
    api.get("/energy-sources", { params }).then((r) => { const d = r.data.data; setSources(d.data); setMeta({ current_page: d.current_page, last_page: d.last_page, from: d.from || 0, to: d.to || 0, total: d.total }); }).catch(console.error).finally(() => setLoading(false));
  }, [typeFilter, perPage, page]);

  const typeLabel: Record<string, string> = { solar: "☀️ Solar", wind: "💨 Wind", hydro: "💧 Hydro", biomass: "🌿 Biomass", geothermal: "🌋 Geothermal" };
  const statusBadge: Record<string, string> = { active: "bg-green-100 text-green-700", maintenance: "bg-amber-100 text-amber-700", inactive: "bg-red-100 text-red-700" };

  return (
    <div className="space-y-4">
      <div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Energy Sources</h1><p className="text-gray-500 mt-1 dark:text-gray-400">Data sumber energi bersih tersedia</p></div>

      {/* Filter */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 items-center justify-between dark:bg-white/[0.03] dark:border-gray-800">
        <div className="flex items-center gap-2 text-sm text-gray-600 whitespace-nowrap dark:text-gray-400">
          <span>Tampilkan</span>
          <select value={perPage} onChange={(e) => setPerPage(Number(e.target.value))} className="px-3 py-1.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-brand-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white">
            <option value={10}>10</option><option value={20}>20</option><option value={50}>50</option>
          </select>
          <span>baris</span>
        </div>
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-full md:w-auto px-4 py-2 text-sm rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-brand-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white">
            <option value="">Semua Jenis</option><option value="solar">Solar</option><option value="wind">Wind</option><option value="hydro">Hydro</option><option value="biomass">Biomass</option><option value="geothermal">Geothermal</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-white/[0.03] dark:border-gray-800">
        {loading ? (
          <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-500" /></div>
        ) : (
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-200 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-700 uppercase dark:text-gray-300">No</th>
                <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-700 uppercase dark:text-gray-300">Sumber Energi</th>
                <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-700 uppercase dark:text-gray-300">Tipe</th>
                <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-700 uppercase dark:text-gray-300">Kapasitas Total</th>
                <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-700 uppercase dark:text-gray-300">Tersedia</th>
                <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-700 uppercase dark:text-gray-300">Lokasi</th>
                <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-700 uppercase dark:text-gray-300">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {sources.map((s, i) => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors dark:hover:bg-white/[0.03]">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{i + 1}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 bg-gradient-to-br from-amber-500 to-yellow-500"><Zap size={16} /></div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{s.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 capitalize">{typeLabel[s.type] || s.type}</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{Number(s.total_capacity_kwh).toLocaleString()} kWh</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-emerald-600">{Number(s.available_capacity_kwh).toLocaleString()} kWh</span>
                      <div className="w-16 bg-gray-100 rounded-full h-1.5 dark:bg-gray-700">
                        <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${(s.available_capacity_kwh / s.total_capacity_kwh) * 100}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400"><div className="flex items-center gap-1"><MapPin size={12} />{s.address}</div></td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${statusBadge[s.status] || "bg-gray-100 text-gray-500"}`}>{s.status}</span>
                  </td>
                </tr>
              ))}
              {!sources.length && (
                <tr><td colSpan={7} className="px-6 py-16 text-center">
                  <Zap size={40} className="mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                  <div className="text-gray-500 font-medium dark:text-gray-400">Tidak ada sumber energi</div>
                </td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <Pagination from={meta.from} to={meta.to} total={meta.total} currentPage={meta.current_page} lastPage={meta.last_page} onPageChange={setPage} />
    </div>
  );
}
