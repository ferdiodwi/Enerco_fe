import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Handshake, Plus, Loader2, Send, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

  const statusColor: Record<string, string> = { pending: "border-amber-500 text-amber-400", accepted: "border-emerald-500 text-emerald-400", rejected: "border-red-500 text-red-400", in_progress: "border-blue-500 text-blue-400", completed: "border-purple-500 text-purple-400" };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">Partnerships</h1><p className="text-slate-400 mt-1">Kelola kemitraan dan kolaborasi</p></div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="bg-emerald-500 hover:bg-emerald-400"><Plus size={18} className="mr-2" />Ajukan Kemitraan</Button></DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-700">
            <DialogHeader><DialogTitle>Ajukan Kemitraan Baru</DialogTitle></DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Penerima (User ID)</Label><Input value={form.receiver_id} onChange={(e) => set("receiver_id", e.target.value)} required className="bg-slate-800 border-slate-700" /></div>
                <div><Label>Tipe</Label><Input value={form.type} onChange={(e) => set("type", e.target.value)} required placeholder="distribusi/investasi" className="bg-slate-800 border-slate-700" /></div>
              </div>
              <div><Label>Judul</Label><Input value={form.title} onChange={(e) => set("title", e.target.value)} required className="bg-slate-800 border-slate-700" /></div>
              <div><Label>Pesan</Label><Textarea value={form.message} onChange={(e) => set("message", e.target.value)} required className="bg-slate-800 border-slate-700" /></div>
              <div><Label>Business ID (opsional)</Label><Input value={form.business_id} onChange={(e) => set("business_id", e.target.value)} className="bg-slate-800 border-slate-700" /></div>
              <Button type="submit" disabled={saving} className="w-full bg-emerald-500 hover:bg-emerald-400">{saving ? <><Loader2 size={16} className="mr-2 animate-spin" />Mengirim...</> : <><Send size={16} className="mr-2" />Kirim</>}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {items.map((p, i) => (
          <motion.div key={p.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="bg-slate-900/70 border-slate-800/60">
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/15 flex items-center justify-center text-purple-400"><Handshake size={24} /></div>
                    <div>
                      <h3 className="font-semibold text-white">{p.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-slate-400 mt-0.5">
                        <span>{p.sender?.name || "You"}</span><ArrowRight size={12} /><span>{p.receiver?.name || `User #${p.receiver_id}`}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1">{p.message}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="capitalize">{p.type}</Badge>
                    {p.status === "pending" && p.receiver_id === user?.id ? (
                      <div className="flex gap-1.5">
                        <button onClick={() => updateStatus(p.id, "accepted")} className="px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 text-xs font-medium hover:bg-emerald-500/25 transition">Accept</button>
                        <button onClick={() => updateStatus(p.id, "rejected")} className="px-3 py-1.5 rounded-lg bg-red-500/15 text-red-400 text-xs font-medium hover:bg-red-500/25 transition">Reject</button>
                      </div>
                    ) : (
                      <Badge variant="outline" className={statusColor[p.status] || ""}>{p.status}</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        {!items.length && <Card className="bg-slate-900/70 border-slate-800/60 p-12 text-center"><Handshake size={48} className="text-slate-700 mx-auto mb-4" /><p className="text-slate-400">Belum ada kemitraan</p></Card>}
      </div>
    </div>
  );
}
