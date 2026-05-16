import { useEffect, useState } from "react";
import { Building2, Search, MapPin } from "lucide-react";
import Pagination from "@/components/ui/Pagination";
import api from "@/services/api";
import { toast } from "sonner";

interface PaginationMeta { current_page: number; last_page: number; from: number; to: number; total: number; }

export default function BusinessList() {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [perPage, setPerPage] = useState(20);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<PaginationMeta>({ current_page: 1, last_page: 1, from: 0, to: 0, total: 0 });

  const fetchData = (p = page) => {
    setLoading(true);
    const params: any = { per_page: perPage, page: p };
    if (search) params.search = search;
    if (statusFilter) params.verification_status = statusFilter;
    api.get("/businesses", { params })
      .then((r) => { const d = r.data.data; setBusinesses(d.data); setMeta({ current_page: d.current_page, last_page: d.last_page, from: d.from || 0, to: d.to || 0, total: d.total }); })
      .catch(() => toast.error("Gagal memuat data"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { setPage(1); }, [search, statusFilter, perPage]);
  useEffect(() => { const t = setTimeout(() => fetchData(page), 400); return () => clearTimeout(t); }, [search, statusFilter, perPage, page]);

  const verify = async (id: number, status: string) => {
    try { await api.patch(`/businesses/${id}/verify`, { verification_status: status }); toast.success("Status verifikasi diubah"); fetchData(); } catch { toast.error("Gagal"); }
  };

  const statusBadge: Record<string, string> = { verified: "bg-green-100 text-green-700", pending: "bg-amber-100 text-amber-700", rejected: "bg-red-100 text-red-700" };
  const formatDate = (d: string) => new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div className="space-y-4">
      <div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">UMKM Management</h1><p className="text-gray-500 mt-1 dark:text-gray-400">Data dan verifikasi profil UMKM</p></div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 items-center justify-between dark:bg-white/[0.03] dark:border-gray-800">
        <div className="flex items-center gap-2 text-sm text-gray-600 whitespace-nowrap dark:text-gray-400">
          <span>Tampilkan</span>
          <select value={perPage} onChange={(e) => setPerPage(Number(e.target.value))} className="px-3 py-1.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-brand-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white">
            <option value={10}>10</option><option value={20}>20</option><option value={50}>50</option>
          </select>
          <span>baris</span>
        </div>
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full md:w-auto px-4 py-2 text-sm rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-brand-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white">
            <option value="">Semua Status</option><option value="pending">Pending</option><option value="verified">Verified</option><option value="rejected">Rejected</option>
          </select>
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search className="h-5 w-5 text-gray-400" /></div>
            <input value={search} onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Cari nama UMKM atau sektor..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-brand-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:placeholder-gray-500" />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-white/[0.03] dark:border-gray-800">
        {loading ? (
          <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-500" /></div>
        ) : (
          <table className="w-full min-w-[900px]">
            <thead className="bg-gray-200 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-700 uppercase dark:text-gray-300">No</th>
                <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-700 uppercase dark:text-gray-300">UMKM</th>
                <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-700 uppercase dark:text-gray-300">Sektor</th>
                <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-700 uppercase dark:text-gray-300">Karyawan</th>
                <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-700 uppercase dark:text-gray-300">Energi (kWh)</th>
                <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-700 uppercase dark:text-gray-300">Status</th>
                <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-700 uppercase dark:text-gray-300">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {businesses.map((biz, i) => (
                <tr key={biz.id} className="hover:bg-gray-50 transition-colors dark:hover:bg-white/[0.03]">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{(meta.from || 1) + i}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 bg-gradient-to-br from-emerald-500 to-emerald-600">{biz.name.charAt(0).toUpperCase()}</div>
                      <div><div className="text-sm font-medium text-gray-900 dark:text-white">{biz.name}</div><div className="text-xs text-gray-400 flex items-center gap-1"><MapPin size={10} />{biz.address}</div></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{biz.sector}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{biz.employee_count}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{Number(biz.monthly_energy_need).toLocaleString()}</td>
                  <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${statusBadge[biz.verification_status] || "bg-gray-100 text-gray-500"}`}>{biz.verification_status}</span></td>
                  <td className="px-6 py-4">
                    {biz.verification_status === "pending" && (
                      <div className="flex gap-2">
                        <button onClick={() => verify(biz.id, "verified")} className="px-3 py-1 text-sm text-emerald-600 hover:text-emerald-700 font-medium">Verifikasi</button>
                        <button onClick={() => verify(biz.id, "rejected")} className="px-3 py-1 text-sm text-red-600 hover:text-red-700 font-medium">Tolak</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {!businesses.length && (
                <tr><td colSpan={7} className="px-6 py-16 text-center">
                  <Building2 size={40} className="mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                  <div className="text-gray-500 font-medium dark:text-gray-400">Tidak ada data UMKM ditemukan</div>
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
