import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Building2, Search, CheckCircle, Clock, XCircle, MapPin } from "lucide-react";
import api from "@/services/api";
import { toast } from "sonner";

export default function BusinessList() {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchData = () => {
    setLoading(true);
    const params: any = { per_page: 50 };
    if (search) params.search = search;
    if (statusFilter) params.verification_status = statusFilter;
    api.get("/businesses", { params }).then((r) => setBusinesses(r.data.data.data)).catch(() => toast.error("Gagal memuat data")).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [search, statusFilter]);

  const verify = async (id: number, status: string) => {
    try {
      await api.patch(`/businesses/${id}/verify`, { verification_status: status });
      toast.success("Status verifikasi berhasil diubah");
      fetchData();
    } catch { toast.error("Gagal mengubah status"); }
  };

  const statusIcon = (s: string) => {
    if (s === "verified") return <CheckCircle size={16} className="text-emerald-400" />;
    if (s === "rejected") return <XCircle size={16} className="text-red-400" />;
    return <Clock size={16} className="text-amber-400" />;
  };

  const statusColor = (s: string) => {
    if (s === "verified") return "bg-emerald-500/15 text-emerald-400";
    if (s === "rejected") return "bg-red-500/15 text-red-400";
    return "bg-amber-500/15 text-amber-400";
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-white">UMKM Management</h1><p className="text-slate-400 mt-1">Data dan verifikasi profil UMKM</p></div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama UMKM atau sektor..."
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500 transition">
          <option value="">Semua Status</option>
          <option value="pending">Pending</option>
          <option value="verified">Verified</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500" /></div>
      ) : (
        <div className="grid gap-4">
          {businesses.map((biz, i) => (
            <motion.div key={biz.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="rounded-2xl bg-slate-900/70 border border-slate-800/60 p-6 hover:border-slate-700/80 transition-all">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400 flex-shrink-0">
                    <Building2 size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{biz.name}</h3>
                    <p className="text-sm text-slate-400 mt-0.5">{biz.sector} · {biz.employee_count} karyawan</p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                      <MapPin size={12} /> {biz.address}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right mr-4">
                    <p className="text-sm text-slate-400">Kebutuhan Energi</p>
                    <p className="text-lg font-bold text-white">{Number(biz.monthly_energy_need).toLocaleString()} kWh</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium capitalize ${statusColor(biz.verification_status)}`}>
                      {statusIcon(biz.verification_status)} {biz.verification_status}
                    </span>
                    {biz.verification_status === "pending" && (
                      <div className="flex gap-1.5">
                        <button onClick={() => verify(biz.id, "verified")}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 text-xs font-medium hover:bg-emerald-500/25 transition">
                          Verifikasi
                        </button>
                        <button onClick={() => verify(biz.id, "rejected")}
                          className="px-3 py-1.5 rounded-lg bg-red-500/15 text-red-400 text-xs font-medium hover:bg-red-500/25 transition">
                          Tolak
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          {!businesses.length && <div className="text-center py-12 text-slate-500 rounded-2xl bg-slate-900/70 border border-slate-800/60">Tidak ada data UMKM ditemukan</div>}
        </div>
      )}
    </div>
  );
}
