import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BatteryCharging, Zap, Plus, Loader2 } from "lucide-react";
import Badge from "@/components/ui/badge/Badge";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import TextArea from "@/components/form/input/TextArea";
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

  const getStatusColor = (s: string) => s === "validated" ? "success" : s === "rejected" ? "error" : "warning";

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-500" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Energy Needs</h1><p className="text-gray-500 mt-1 dark:text-gray-400">Data kebutuhan energi</p></div>
        <button onClick={() => setOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 transition-colors">
          <Plus size={18} />Tambah
        </button>
        <Modal isOpen={open} onClose={() => setOpen(false)} className="max-w-2xl p-6">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Tambah Kebutuhan Energi</h3>
          </div>
          <form onSubmit={handleCreate} className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Business ID</Label><Input value={form.business_id} onChange={(e) => set("business_id", e.target.value)} /></div>
              <div><Label>Periode</Label><Input value={form.period} onChange={(e) => set("period", e.target.value)} placeholder="2026-Q1" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Kebutuhan (kWh/bulan)</Label><Input type="number" step={0.1} value={form.monthly_need_kwh} onChange={(e) => set("monthly_need_kwh", e.target.value)} /></div>
              <div><Label>Jam Operasi/Hari</Label><Input type="number" value={form.operating_hours_per_day} onChange={(e) => set("operating_hours_per_day", e.target.value)} /></div>
            </div>
            <div><Label>Peralatan Utama</Label><TextArea value={form.main_equipment} onChange={(e) => set("main_equipment", e.target.value)} /></div>
            <div><Label>Biaya Energi (Rp)</Label><Input type="number" step={1} value={form.current_energy_cost} onChange={(e) => set("current_energy_cost", e.target.value)} /></div>
            <div><Label>Masalah Energi</Label><TextArea value={form.energy_problem} onChange={(e) => set("energy_problem", e.target.value)} /></div>
            <div className="pt-4">
              <button type="submit" disabled={saving} className="flex w-full justify-center rounded-lg bg-brand-500 p-3 font-medium text-white hover:bg-brand-600 disabled:opacity-50">
                {saving ? <><Loader2 size={20} className="mr-2 animate-spin" />Menyimpan...</> : "Simpan"}
              </button>
            </div>
          </form>
        </Modal>
      </div>
      <div className="grid gap-4">
        {needs.map((n, i) => (
          <motion.div key={n.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:border-gray-300 dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-gray-700">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-warning-50 flex items-center justify-center text-warning-500 dark:bg-warning-500/15"><BatteryCharging size={24} /></div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white">{n.business?.name || `Business #${n.business_id}`}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Periode: {n.period} · {n.operating_hours_per_day} jam/hari</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-800 dark:text-white">{Number(n.monthly_need_kwh).toLocaleString()} kWh</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">Rp {Number(n.current_energy_cost).toLocaleString()}/bulan</p>
                  </div>
                  <Badge variant="light" color={getStatusColor(n.validation_status)}>
                    <span className="capitalize">{n.validation_status}</span>
                  </Badge>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        {!needs.length && <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-white/[0.03]"><Zap size={48} className="text-gray-300 mx-auto mb-4 dark:text-gray-600" /><p className="text-gray-500 dark:text-gray-400">Belum ada data</p></div>}
      </div>
    </div>
  );
}
