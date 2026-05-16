import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Building2, Search, CheckCircle, Clock, XCircle, MapPin } from "lucide-react";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import api from "@/services/api";
import { toast } from "sonner";

export default function BusinessList() {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchData = () => {
    setLoading(true);
    const params: any = { per_page: 50 };
    if (search) params.search = search;
    if (statusFilter && statusFilter !== "all") params.verification_status = statusFilter;
    api.get("/businesses", { params }).then((r) => setBusinesses(r.data.data.data)).catch(() => toast.error("Gagal memuat data")).finally(() => setLoading(false));
  };
  useEffect(() => { fetchData(); }, [search, statusFilter]);

  const verify = async (id: number, status: string) => {
    try { await api.patch(`/businesses/${id}/verify`, { verification_status: status }); toast.success("Status verifikasi diubah"); fetchData(); } catch { toast.error("Gagal"); }
  };

  const statusOptions = [
    { value: "all", label: "Semua Status" },
    { value: "pending", label: "Pending" },
    { value: "verified", label: "Verified" },
    { value: "rejected", label: "Rejected" },
  ];

  const statusIcon = (s: string) => s === "verified" ? <CheckCircle size={14} /> : s === "rejected" ? <XCircle size={14} /> : <Clock size={14} />;
  const statusColor = (s: string) => s === "verified" ? "success" : s === "rejected" ? "error" : "warning";

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">UMKM Management</h1><p className="text-gray-500 mt-1 dark:text-gray-400">Data dan verifikasi profil UMKM</p></div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama UMKM atau sektor..." className="pl-10" />
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none" />
        </div>
        <div className="w-[160px]">
          <Select options={statusOptions} defaultValue={statusFilter} onChange={setStatusFilter} />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-500" /></div>
      ) : (
        <div className="grid gap-4">
          {businesses.map((biz, i) => (
            <motion.div key={biz.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <div className="rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:border-gray-300 dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-gray-700">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-success-50 flex items-center justify-center text-success-500 flex-shrink-0 dark:bg-success-500/15"><Building2 size={24} /></div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{biz.name}</h3>
                      <p className="text-sm text-gray-500 mt-0.5 dark:text-gray-400">{biz.sector} · {biz.employee_count} karyawan</p>
                      <div className="flex items-center gap-1 mt-1 text-xs text-gray-500 dark:text-gray-400"><MapPin size={12} /> {biz.address}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right mr-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Kebutuhan Energi</p>
                      <p className="text-lg font-bold text-gray-800 dark:text-white">{Number(biz.monthly_energy_need).toLocaleString()} kWh</p>
                    </div>
                    <Badge variant="light" color={statusColor(biz.verification_status)} startIcon={statusIcon(biz.verification_status)}>
                      <span className="capitalize">{biz.verification_status}</span>
                    </Badge>
                    {biz.verification_status === "pending" && (
                      <div className="flex gap-1.5 ml-2">
                        <Button size="sm" variant="outline" onClick={() => verify(biz.id, "verified")} className="border-success-200 text-success-600 hover:bg-success-50 dark:border-success-500/30 dark:text-success-500 dark:hover:bg-success-500/15">Verifikasi</Button>
                        <Button size="sm" variant="outline" onClick={() => verify(biz.id, "rejected")} className="border-error-200 text-error-600 hover:bg-error-50 dark:border-error-500/30 dark:text-error-500 dark:hover:bg-error-500/15">Tolak</Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          {!businesses.length && <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-white/[0.03]"><p className="text-gray-500 dark:text-gray-400">Tidak ada data UMKM ditemukan</p></div>}
        </div>
      )}
    </div>
  );
}
