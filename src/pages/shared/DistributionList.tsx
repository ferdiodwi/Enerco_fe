import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Truck, Plus, Loader2 } from "lucide-react";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import TextArea from "@/components/form/input/TextArea";
import Select from "@/components/form/Select";
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

  const statusOptions = [
    { value: "planned", label: "Planned" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" }
  ];

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-500" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Distributions</h1><p className="text-gray-500 mt-1 dark:text-gray-400">Distribusi energi bersih ke UMKM</p></div>
        <button onClick={() => setOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 transition-colors">
          <Plus size={18} />Buat Distribusi
        </button>
        <Modal isOpen={open} onClose={() => setOpen(false)} className="max-w-2xl p-6">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Buat Distribusi Baru</h3>
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
            <div className="pt-4">
              <button type="submit" disabled={saving} className="flex w-full justify-center rounded-lg bg-brand-500 p-3 font-medium text-white hover:bg-brand-600 disabled:opacity-50">
                {saving ? <><Loader2 size={20} className="mr-2 animate-spin" />Menyimpan...</> : "Simpan"}
              </button>
            </div>
          </form>
        </Modal>
      </div>

      <div className="grid gap-4">
        {dists.map((d, i) => (
          <motion.div key={d.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:border-gray-300 dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-gray-700">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-500 dark:bg-cyan-500/15"><Truck size={24} /></div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white">{d.business?.name || `Business #${d.business_id}`}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Sumber: {d.energy_source?.name || `Source #${d.energy_source_id}`}</p>
                    <p className="text-xs text-gray-400 mt-1 dark:text-gray-500">{d.start_date} → {d.end_date || "Ongoing"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-800 dark:text-white">{Number(d.allocated_energy_kwh).toLocaleString()} kWh</p>
                  </div>
                  <div className="w-[140px]">
                    <Select options={statusOptions} defaultValue={d.status} onChange={(v) => updateStatus(d.id, v)} className="h-9 py-1 text-sm" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        {!dists.length && <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-white/[0.03]"><Truck size={48} className="text-gray-300 mx-auto mb-4 dark:text-gray-600" /><p className="text-gray-500 dark:text-gray-400">Belum ada distribusi</p></div>}
      </div>
    </div>
  );
}
