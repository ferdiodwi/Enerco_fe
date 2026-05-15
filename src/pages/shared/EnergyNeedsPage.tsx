import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BatteryCharging, Zap, Plus, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import api from "@/services/api";
import { toast } from "sonner";

export default function EnergyNeedsPage() {
  const [needs, setNeeds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ business_id: "", period: "", monthly_need_kwh: "", operating_hours_per_day: "", main_equipment: "", current_energy_cost: "", energy_problem: "" });

  const fetchData = () => {
    api.get("/energy-needs", { params: { per_page: 50 } }).then((r) => setNeeds(r.data.data.data)).catch(console.error).finally(() => setLoading(false));
  };
  useEffect(() => { fetchData(); }, []);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      await api.post("/energy-needs", { ...form, monthly_need_kwh: parseFloat(form.monthly_need_kwh), operating_hours_per_day: parseInt(form.operating_hours_per_day), current_energy_cost: parseFloat(form.current_energy_cost) });
      toast.success("Berhasil ditambahkan"); setOpen(false); fetchData();
    } catch (err: any) { toast.error(err.response?.data?.message || "Gagal"); } finally { setSaving(false); }
  };

  const statusColor = (s: string) => s === "validated" ? "border-emerald-500 text-emerald-400" : s === "rejected" ? "border-red-500 text-red-400" : "border-amber-500 text-amber-400";

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">Energy Needs</h1><p className="text-slate-400 mt-1">Data kebutuhan energi</p></div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="bg-emerald-500 hover:bg-emerald-400"><Plus size={18} className="mr-2" />Tambah</Button></DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-700">
            <DialogHeader><DialogTitle>Tambah Kebutuhan Energi</DialogTitle></DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Business ID</Label><Input value={form.business_id} onChange={(e) => set("business_id", e.target.value)} required className="bg-slate-800 border-slate-700" /></div>
                <div><Label>Periode</Label><Input value={form.period} onChange={(e) => set("period", e.target.value)} required placeholder="2026-Q1" className="bg-slate-800 border-slate-700" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Kebutuhan (kWh/bulan)</Label><Input type="number" step="any" value={form.monthly_need_kwh} onChange={(e) => set("monthly_need_kwh", e.target.value)} required className="bg-slate-800 border-slate-700" /></div>
                <div><Label>Jam Operasi/Hari</Label><Input type="number" value={form.operating_hours_per_day} onChange={(e) => set("operating_hours_per_day", e.target.value)} required className="bg-slate-800 border-slate-700" /></div>
              </div>
              <div><Label>Peralatan Utama</Label><Textarea value={form.main_equipment} onChange={(e) => set("main_equipment", e.target.value)} required className="bg-slate-800 border-slate-700" /></div>
              <div><Label>Biaya Energi (Rp)</Label><Input type="number" step="any" value={form.current_energy_cost} onChange={(e) => set("current_energy_cost", e.target.value)} required className="bg-slate-800 border-slate-700" /></div>
              <div><Label>Masalah Energi</Label><Textarea value={form.energy_problem} onChange={(e) => set("energy_problem", e.target.value)} required className="bg-slate-800 border-slate-700" /></div>
              <Button type="submit" disabled={saving} className="w-full bg-emerald-500 hover:bg-emerald-400">{saving ? <><Loader2 size={16} className="mr-2 animate-spin" />Menyimpan...</> : "Simpan"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-4">
        {needs.map((n, i) => (
          <motion.div key={n.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="bg-slate-900/70 border-slate-800/60">
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-400"><BatteryCharging size={24} /></div>
                    <div>
                      <h3 className="font-semibold text-white">{n.business?.name || `Business #${n.business_id}`}</h3>
                      <p className="text-sm text-slate-400">Periode: {n.period} · {n.operating_hours_per_day} jam/hari</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-lg font-bold text-white">{Number(n.monthly_need_kwh).toLocaleString()} kWh</p>
                      <p className="text-xs text-slate-400">Rp {Number(n.current_energy_cost).toLocaleString()}/bulan</p>
                    </div>
                    <Badge variant="outline" className={statusColor(n.validation_status)}>{n.validation_status}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        {!needs.length && <Card className="bg-slate-900/70 border-slate-800/60 p-12 text-center"><Zap size={48} className="text-slate-700 mx-auto mb-4" /><p className="text-slate-400">Belum ada data</p></Card>}
      </div>
    </div>
  );
}
