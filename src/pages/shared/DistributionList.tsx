import { useEffect, useState } from "react";
import { Truck, Plus, Loader2 } from "lucide-react";
import Pagination from "@/components/ui/Pagination";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import TextArea from "@/components/form/input/TextArea";
import api from "@/services/api";
import { toast } from "sonner";

interface PaginationMeta { current_page: number; last_page: number; from: number; to: number; total: number; }

export default function DistributionList() {
  const [dists, setDists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [perPage, setPerPage] = useState(20);
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<PaginationMeta>({ current_page: 1, last_page: 1, from: 0, to: 0, total: 0 });
  const [form, setForm] = useState({ recommendation_id: "", business_id: "", energy_source_id: "", allocated_energy_kwh: "", start_date: "", end_date: "", notes: "" });

  const fetchData = () => {
    setLoading(true);
    const params: any = { per_page: perPage, page };
    if (statusFilter) params.status = statusFilter;
    api.get("/distributions", { params }).then((r) => { const d = r.data.data; setDists(d.data); setMeta({ current_page: d.current_page, last_page: d.last_page, from: d.from || 0, to: d.to || 0, total: d.total }); }).catch(console.error).finally(() => setLoading(false));
  };
  useEffect(() => { setPage(1); }, [perPage, statusFilter]);
  useEffect(() => { fetchData(); }, [perPage, statusFilter, page]);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      await api.post("/distributions", { ...form, allocated_energy_kwh: parseFloat(form.allocated_energy_kwh) });
      toast.success("Distribusi berhasil dibuat"); setOpen(false); setForm({ recommendation_id: "", business_id: "", energy_source_id: "", allocated_energy_kwh: "", start_date: "", end_date: "", notes: "" }); fetchData();
    } catch (err: any) { toast.error(err.response?.data?.message || "Gagal"); } finally { setSaving(false); }
  };

  const updateStatus = async (id: number, status: string) => {
    try { await api.patch(`/distributions/${id}/status`, { status }); toast.success("Status diubah"); fetchData(); } catch { toast.error("Gagal mengubah status"); }
  };

  const statusBadge: Record<string, string> = { planned: "bg-blue-100 text-blue-700", in_progress: "bg-amber-100 text-amber-700", completed: "bg-green-100 text-green-700", cancelled: "bg-red-100 text-red-700" };

  const formatDate = (d: string) => d ? new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) : "-";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Distributions</h1><p className="text-gray-500 mt-1 dark:text-gray-400">Distribusi energi bersih ke UMKM</p></div>
        <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white transition">
          <Plus size={16} />Buat Distribusi
        </button>
        <Modal isOpen={open} onClose={() => setOpen(false)} className="max-w-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center"><Truck size={20} className="text-cyan-600" /></div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Buat Distribusi Baru</h3>
          </div>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div><Label>Rec. ID</Label><Input value={form.recommendation_id} onChange={(e) => set("recommendation_id", e.target.value)} /></div>
              <div><Label>Business ID</Label><Input value={form.business_id} onChange={(e) => set("business_id", e.target.value)} /></div>
              <div><Label>Source ID</Label><Input value={form.energy_source_id} onChange={(e) => set("energy_source_id", e.target.value)} /></div>
            </div>
            <div><Label>Energi Dialokasikan (kWh)</Label><Input type="number" step={0.1} value={form.allocated_energy_kwh} onChange={(e) => set("allocated_energy_kwh", e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Tanggal Mulai</Label><Input type="date" value={form.start_date} onChange={(e) => set("start_date", e.target.value)} /></div>
              <div><Label>Tanggal Selesai</Label><Input type="date" value={form.end_date} onChange={(e) => set("end_date", e.target.value)} /></div>
            </div>
            <div><Label>Catatan</Label><TextArea value={form.notes} onChange={(e) => set("notes", e.target.value)} /></div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg text-sm transition dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">Batal</button>
              <button type="submit" disabled={saving} className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg text-sm transition disabled:opacity-50">
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </form>
        </Modal>
      </div>

      {/* Filter */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 items-center justify-between dark:bg-white/[0.03] dark:border-gray-800">
        <div className="flex items-center gap-2 text-sm text-gray-600 whitespace-nowrap dark:text-gray-400">
          <span>Tampilkan</span>
          <select value={perPage} onChange={(e) => setPerPage(Number(e.target.value))} className="px-3 py-1.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-brand-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white">
            <option value={10}>10</option><option value={20}>20</option><option value={50}>50</option>
          </select>
          <span>baris</span>
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 text-sm rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-brand-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white">
          <option value="">Semua Status</option><option value="planned">Planned</option><option value="in_progress">In Progress</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-white/[0.03] dark:border-gray-800">
        {loading ? (
          <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-500" /></div>
        ) : (
          <table className="w-full min-w-[900px]">
            <thead className="bg-gray-200 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-700 uppercase dark:text-gray-300">No</th>
                <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-700 uppercase dark:text-gray-300">UMKM</th>
                <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-700 uppercase dark:text-gray-300">Sumber Energi</th>
                <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-700 uppercase dark:text-gray-300">Energi (kWh)</th>
                <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-700 uppercase dark:text-gray-300">Periode</th>
                <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-700 uppercase dark:text-gray-300">Status</th>
                <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-700 uppercase dark:text-gray-300">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {dists.map((d, i) => (
                <tr key={d.id} className="hover:bg-gray-50 transition-colors dark:hover:bg-white/[0.03]">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{i + 1}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 bg-gradient-to-br from-cyan-500 to-blue-500"><Truck size={14} /></div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{d.business?.name || `Business #${d.business_id}`}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{d.energy_source?.name || `Source #${d.energy_source_id}`}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{Number(d.allocated_energy_kwh).toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{formatDate(d.start_date)} → {formatDate(d.end_date)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${statusBadge[d.status] || "bg-gray-100 text-gray-500"}`}>{d.status?.replace("_", " ")}</span>
                  </td>
                  <td className="px-6 py-4">
                    <select value={d.status} onChange={(e) => updateStatus(d.id, e.target.value)}
                      className="px-3 py-1.5 text-xs rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-brand-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white">
                      <option value="planned">Planned</option><option value="in_progress">In Progress</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
              {!dists.length && (
                <tr><td colSpan={7} className="px-6 py-16 text-center">
                  <Truck size={40} className="mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                  <div className="text-gray-500 font-medium dark:text-gray-400">Belum ada distribusi</div>
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
