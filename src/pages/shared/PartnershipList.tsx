import { useEffect, useState } from "react";
import { Handshake, Plus, Loader2, Send, ArrowRight } from "lucide-react";
import Pagination from "@/components/ui/Pagination";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import TextArea from "@/components/form/input/TextArea";
import api from "@/services/api";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface PaginationMeta { current_page: number; last_page: number; from: number; to: number; total: number; }

export default function PartnershipList() {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [perPage, setPerPage] = useState(20);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<PaginationMeta>({ current_page: 1, last_page: 1, from: 0, to: 0, total: 0 });
  const [form, setForm] = useState({ receiver_id: "", type: "", title: "", message: "", business_id: "" });

  const fetchData = () => {
    setLoading(true);
    api.get("/partnerships", { params: { per_page: perPage, page } }).then((r) => { const d = r.data.data; setItems(d.data); setMeta({ current_page: d.current_page, last_page: d.last_page, from: d.from || 0, to: d.to || 0, total: d.total }); }).catch(console.error).finally(() => setLoading(false));
  };
  useEffect(() => { setPage(1); }, [perPage]);
  useEffect(() => { fetchData(); }, [perPage, page]);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      const payload: any = { ...form };
      if (!payload.business_id) delete payload.business_id;
      await api.post("/partnerships", payload);
      toast.success("Kemitraan berhasil diajukan"); setOpen(false); fetchData();
    } catch (err: any) { toast.error(err.response?.data?.message || "Gagal"); } finally { setSaving(false); }
  };

  const updateStatus = async (id: number, status: string) => {
    try { await api.patch(`/partnerships/${id}/status`, { status }); toast.success("Status diubah"); fetchData(); } catch { toast.error("Gagal"); }
  };

  const statusBadge: Record<string, string> = { pending: "bg-amber-100 text-amber-700", accepted: "bg-green-100 text-green-700", rejected: "bg-red-100 text-red-700", in_progress: "bg-blue-100 text-blue-700", completed: "bg-green-100 text-green-700" };
  const typeBadge: Record<string, string> = { distribusi: "bg-cyan-100 text-cyan-700", investasi: "bg-purple-100 text-purple-700" };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Partnerships</h1><p className="text-gray-500 mt-1 dark:text-gray-400">Kelola kemitraan dan kolaborasi</p></div>
        <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white transition">
          <Plus size={16} />Ajukan Kemitraan
        </button>
        <Modal isOpen={open} onClose={() => setOpen(false)} className="max-w-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center"><Handshake size={20} className="text-purple-600" /></div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Ajukan Kemitraan Baru</h3>
          </div>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Penerima (User ID)</Label><Input value={form.receiver_id} onChange={(e) => set("receiver_id", e.target.value)} /></div>
              <div><Label>Tipe</Label><Input value={form.type} onChange={(e) => set("type", e.target.value)} placeholder="distribusi/investasi" /></div>
            </div>
            <div><Label>Judul</Label><Input value={form.title} onChange={(e) => set("title", e.target.value)} /></div>
            <div><Label>Pesan</Label><TextArea value={form.message} onChange={(e) => set("message", e.target.value)} /></div>
            <div><Label>Business ID (opsional)</Label><Input value={form.business_id} onChange={(e) => set("business_id", e.target.value)} /></div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg text-sm transition dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">Batal</button>
              <button type="submit" disabled={saving} className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg text-sm transition disabled:opacity-50">
                {saving ? "Mengirim..." : "Kirim"}
              </button>
            </div>
          </form>
        </Modal>
      </div>

      {/* Filter */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center gap-2 text-sm text-gray-600 dark:bg-white/[0.03] dark:border-gray-800 dark:text-gray-400">
        <span>Tampilkan</span>
        <select value={perPage} onChange={(e) => setPerPage(Number(e.target.value))} className="px-3 py-1.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-brand-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white">
          <option value={10}>10</option><option value={20}>20</option><option value={50}>50</option>
        </select>
        <span>baris</span>
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
                <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-700 uppercase dark:text-gray-300">Kemitraan</th>
                <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-700 uppercase dark:text-gray-300">Pengirim → Penerima</th>
                <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-700 uppercase dark:text-gray-300">Tipe</th>
                <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-700 uppercase dark:text-gray-300">Status</th>
                <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-700 uppercase dark:text-gray-300">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {items.map((p, i) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors dark:hover:bg-white/[0.03]">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{i + 1}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{p.title}</div>
                    <div className="text-xs text-gray-400 mt-0.5 line-clamp-1">{p.message}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium text-gray-900 dark:text-white">{p.sender?.name || "You"}</span>
                      <ArrowRight size={12} className="text-gray-400" />
                      <span className="font-medium text-gray-900 dark:text-white">{p.receiver?.name || `User #${p.receiver_id}`}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${typeBadge[p.type] || "bg-gray-100 text-gray-600"}`}>{p.type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${statusBadge[p.status] || "bg-gray-100 text-gray-500"}`}>{p.status?.replace("_", " ")}</span>
                  </td>
                  <td className="px-6 py-4">
                    {p.status === "pending" && p.receiver_id === user?.id && (
                      <div className="flex gap-2">
                        <button onClick={() => updateStatus(p.id, "accepted")} className="px-3 py-1 text-sm text-emerald-600 hover:text-emerald-700 font-medium">Accept</button>
                        <button onClick={() => updateStatus(p.id, "rejected")} className="px-3 py-1 text-sm text-red-600 hover:text-red-700 font-medium">Reject</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {!items.length && (
                <tr><td colSpan={6} className="px-6 py-16 text-center">
                  <Handshake size={40} className="mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                  <div className="text-gray-500 font-medium dark:text-gray-400">Belum ada kemitraan</div>
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
