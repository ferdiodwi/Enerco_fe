import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Handshake, Plus, Loader2, Send, ArrowRight } from "lucide-react";
import Badge from "@/components/ui/badge/Badge";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import TextArea from "@/components/form/input/TextArea";
import api from "@/services/api";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export default function PartnershipList() {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ receiver_id: "", type: "", title: "", message: "", business_id: "" });

  const fetchData = () => {
    api.get("/partnerships", { params: { per_page: 50 } }).then((r) => setItems(r.data.data.data)).catch(console.error).finally(() => setLoading(false));
  };
  useEffect(() => { fetchData(); }, []);

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

  const getStatusColor = (s: string) => {
    const map: Record<string, string> = { pending: "warning", accepted: "success", rejected: "error", in_progress: "primary", completed: "success" };
    return map[s] || "light";
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-500" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Partnerships</h1><p className="text-gray-500 mt-1 dark:text-gray-400">Kelola kemitraan dan kolaborasi</p></div>
        <button onClick={() => setOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 transition-colors">
          <Plus size={18} />Ajukan Kemitraan
        </button>
        <Modal isOpen={open} onClose={() => setOpen(false)} className="max-w-2xl p-6">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Ajukan Kemitraan Baru</h3>
          </div>
          <form onSubmit={handleCreate} className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Penerima (User ID)</Label><Input value={form.receiver_id} onChange={(e) => set("receiver_id", e.target.value)} /></div>
              <div><Label>Tipe</Label><Input value={form.type} onChange={(e) => set("type", e.target.value)} placeholder="distribusi/investasi" /></div>
            </div>
            <div><Label>Judul</Label><Input value={form.title} onChange={(e) => set("title", e.target.value)} /></div>
            <div><Label>Pesan</Label><TextArea value={form.message} onChange={(e) => set("message", e.target.value)} /></div>
            <div><Label>Business ID (opsional)</Label><Input value={form.business_id} onChange={(e) => set("business_id", e.target.value)} /></div>
            <div className="pt-4">
              <button type="submit" disabled={saving} className="flex w-full justify-center rounded-lg bg-brand-500 p-3 font-medium text-white hover:bg-brand-600 disabled:opacity-50">
                {saving ? <><Loader2 size={20} className="mr-2 animate-spin" />Mengirim...</> : <><Send size={20} className="mr-2" />Kirim</>}
              </button>
            </div>
          </form>
        </Modal>
      </div>

      <div className="grid gap-4">
        {items.map((p, i) => (
          <motion.div key={p.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:border-gray-300 dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-gray-700">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500 dark:bg-purple-500/15"><Handshake size={24} /></div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white">{p.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5 dark:text-gray-400">
                      <span>{p.sender?.name || "You"}</span><ArrowRight size={12} /><span>{p.receiver?.name || `User #${p.receiver_id}`}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-1 dark:text-gray-500">{p.message}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="light" color="primary">
                    <span className="capitalize">{p.type}</span>
                  </Badge>
                  {p.status === "pending" && p.receiver_id === user?.id ? (
                    <div className="flex gap-1.5">
                      <button onClick={() => updateStatus(p.id, "accepted")} className="px-3 py-1.5 rounded-lg bg-success-50 text-success-500 text-xs font-medium hover:bg-success-100 transition dark:bg-success-500/15 dark:hover:bg-success-500/25">Accept</button>
                      <button onClick={() => updateStatus(p.id, "rejected")} className="px-3 py-1.5 rounded-lg bg-error-50 text-error-500 text-xs font-medium hover:bg-error-100 transition dark:bg-error-500/15 dark:hover:bg-error-500/25">Reject</button>
                    </div>
                  ) : (
                    <Badge variant="light" color={getStatusColor(p.status)}>
                      <span className="capitalize">{p.status}</span>
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        {!items.length && <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-white/[0.03]"><Handshake size={48} className="text-gray-300 mx-auto mb-4 dark:text-gray-600" /><p className="text-gray-500 dark:text-gray-400">Belum ada kemitraan</p></div>}
      </div>
    </div>
  );
}
