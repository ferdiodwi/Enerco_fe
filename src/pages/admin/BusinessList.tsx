import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Building2, Search, CheckCircle, Clock, XCircle, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

  const statusIcon = (s: string) => s === "verified" ? <CheckCircle size={14} /> : s === "rejected" ? <XCircle size={14} /> : <Clock size={14} />;
  const statusColor = (s: string) => s === "verified" ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" : s === "rejected" ? "bg-red-500/15 text-red-400 border-red-500/30" : "bg-amber-500/15 text-amber-400 border-amber-500/30";

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-white">UMKM Management</h1><p className="text-slate-400 mt-1">Data dan verifikasi profil UMKM</p></div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama UMKM atau sektor..." className="pl-10 bg-slate-900 border-slate-700" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px] bg-slate-900 border-slate-700"><SelectValue placeholder="Semua Status" /></SelectTrigger>
          <SelectContent><SelectItem value="all">Semua Status</SelectItem><SelectItem value="pending">Pending</SelectItem><SelectItem value="verified">Verified</SelectItem><SelectItem value="rejected">Rejected</SelectItem></SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500" /></div>
      ) : (
        <div className="grid gap-4">
          {businesses.map((biz, i) => (
            <motion.div key={biz.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="bg-slate-900/70 border-slate-800/60 hover:border-slate-700/80 transition-all">
                <CardContent className="pt-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400 flex-shrink-0"><Building2 size={24} /></div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{biz.name}</h3>
                        <p className="text-sm text-slate-400 mt-0.5">{biz.sector} · {biz.employee_count} karyawan</p>
                        <div className="flex items-center gap-1 mt-1 text-xs text-slate-500"><MapPin size={12} /> {biz.address}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-right mr-4">
                        <p className="text-sm text-slate-400">Kebutuhan Energi</p>
                        <p className="text-lg font-bold text-white">{Number(biz.monthly_energy_need).toLocaleString()} kWh</p>
                      </div>
                      <Badge variant="outline" className={`capitalize gap-1 ${statusColor(biz.verification_status)}`}>{statusIcon(biz.verification_status)} {biz.verification_status}</Badge>
                      {biz.verification_status === "pending" && (
                        <div className="flex gap-1.5">
                          <Button size="sm" variant="outline" onClick={() => verify(biz.id, "verified")} className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/15 h-8">Verifikasi</Button>
                          <Button size="sm" variant="outline" onClick={() => verify(biz.id, "rejected")} className="border-red-500/30 text-red-400 hover:bg-red-500/15 h-8">Tolak</Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          {!businesses.length && <Card className="bg-slate-900/70 border-slate-800/60 p-12 text-center"><p className="text-slate-500">Tidak ada data UMKM ditemukan</p></Card>}
        </div>
      )}
    </div>
  );
}
