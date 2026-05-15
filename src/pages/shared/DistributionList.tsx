import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Truck, Plus, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import api from "@/services/api";
import { toast } from "sonner";

export default function DistributionList() {
  const [dists, setDists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ recommendation_id: "", business_id: "", energy_source_id: "", allocated_energy_kwh: "", start_date: "", end_date: "", notes: "" });

  const fetchData = () => {
    api.get("/distributions", { params: { per_page: 50 } }).then((r) => setDists(r.data.data.data)).catch(console.error).finally(() => setLoading(false));
  };
  useEffect(() => { fetchData(); }, []);

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

  const statusColor: Record<string, string> = { planned: "border-blue-500 text-blue-400", in_progress: "border-amber-500 text-amber-400", completed: "border-emerald-500 text-emerald-400", cancelled: "border-red-500 text-red-400" };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">Distributions</h1><p className="text-slate-400 mt-1">Distribusi energi bersih ke UMKM</p></div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="bg-emerald-500 hover:bg-emerald-400"><Plus size={18} className="mr-2" />Buat Distribusi</Button></DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-700">
            <DialogHeader><DialogTitle>Buat Distribusi Baru</DialogTitle></DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 mt-4">
              <div className="grid grid-cols-3 gap-3">
                <div><Label>Rec. ID</Label><Input value={form.recommendation_id} onChange={(e) => set("recommendation_id", e.target.value)} required className="bg-slate-800 border-slate-700" /></div>
                <div><Label>Business ID</Label><Input value={form.business_id} onChange={(e) => set("business_id", e.target.value)} required className="bg-slate-800 border-slate-700" /></div>
                <div><Label>Source ID</Label><Input value={form.energy_source_id} onChange={(e) => set("energy_source_id", e.target.value)} required className="bg-slate-800 border-slate-700" /></div>
              </div>
              <div><Label>Energi Dialokasikan (kWh)</Label><Input type="number" step="any" value={form.allocated_energy_kwh} onChange={(e) => set("allocated_energy_kwh", e.target.value)} required className="bg-slate-800 border-slate-700" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Tanggal Mulai</Label><Input type="date" value={form.start_date} onChange={(e) => set("start_date", e.target.value)} required className="bg-slate-800 border-slate-700" /></div>
                <div><Label>Tanggal Selesai</Label><Input type="date" value={form.end_date} onChange={(e) => set("end_date", e.target.value)} className="bg-slate-800 border-slate-700" /></div>
              </div>
              <div><Label>Catatan</Label><Textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} className="bg-slate-800 border-slate-700" /></div>
              <Button type="submit" disabled={saving} className="w-full bg-emerald-500 hover:bg-emerald-400">{saving ? <><Loader2 size={16} className="mr-2 animate-spin" />Menyimpan...</> : "Simpan"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {dists.map((d, i) => (
          <motion.div key={d.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="bg-slate-900/70 border-slate-800/60">
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/15 flex items-center justify-center text-cyan-400"><Truck size={24} /></div>
                    <div>
                      <h3 className="font-semibold text-white">{d.business?.name || `Business #${d.business_id}`}</h3>
                      <p className="text-sm text-slate-400">Sumber: {d.energy_source?.name || `Source #${d.energy_source_id}`}</p>
                      <p className="text-xs text-slate-500 mt-1">{d.start_date} → {d.end_date || "Ongoing"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-lg font-bold text-white">{Number(d.allocated_energy_kwh).toLocaleString()} kWh</p>
                    </div>
                    <select value={d.status} onChange={(e) => updateStatus(d.id, e.target.value)}
                      className={`text-xs px-3 py-1.5 rounded-full font-medium border cursor-pointer bg-transparent ${statusColor[d.status] || ""}`}>
                      <option value="planned">Planned</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        {!dists.length && <Card className="bg-slate-900/70 border-slate-800/60 p-12 text-center"><Truck size={48} className="text-slate-700 mx-auto mb-4" /><p className="text-slate-400">Belum ada distribusi</p></Card>}
      </div>
    </div>
  );
}
