import { useEffect, useState } from "react";
import { BatteryCharging, Zap, Plus, Loader2 } from "lucide-react";
import Pagination from "@/components/ui/Pagination";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import TextArea from "@/components/form/input/TextArea";
import api from "@/services/api";
import { toast } from "sonner";

interface PaginationMeta { current_page: number; last_page: number; from: number; to: number; total: number; }

export default function EnergyNeedsPage() {
  const [needs, setNeeds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [perPage, setPerPage] = useState(20);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<PaginationMeta>({ current_page: 1, last_page: 1, from: 0, to: 0, total: 0 });
  const [form, setForm] = useState({ business_id: "", period: "", monthly_need_kwh: "", operating_hours_per_day: "", main_equipment: "", current_energy_cost: "", energy_problem: "" });

  const fetchData = () => {
    setLoading(true);
    api.get("/energy-needs", { params: { per_page: perPage, page } }).then((r) => { const d = r.data.data; setNeeds(d.data); setMeta({ current_page: d.current_page, last_page: d.last_page, from: d.from || 0, to: d.to || 0, total: d.total }); }).catch(console.error).finally(() => setLoading(false));
  };
  useEffect(() => { setPage(1); }, [perPage]);
  useEffect(() => { fetchData(); }, [perPage, page]);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      await api.post("/energy-needs", { ...form, monthly_need_kwh: parseFloat(form.monthly_need_kwh), operating_hours_per_day: parseInt(form.operating_hours_per_day), current_energy_cost: parseFloat(form.current_energy_cost) });
      toast.success("Berhasil ditambahkan"); setOpen(false); fetchData();
    } catch (err: any) { toast.error(err.response?.data?.message || "Gagal"); } finally { setSaving(false); }
  };

  const statusBadge: Record<string, string> = { validated: "bg-green-100 text-green-700", pending: "bg-amber-100 text-amber-700", rejected: "bg-red-100 text-red-700" };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Energy Needs</h1><p className="text-gray-500 mt-1 dark:text-gray-400">Data kebutuhan energi</p></div>
        <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white transition">
          <Plus size={16} />Tambah
        </button>
        <Modal isOpen={open} onClose={() => setOpen(false)} className="max-w-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center"><BatteryCharging size={20} className="text-amber-600" /></div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Tambah Kebutuhan Energi</h3>
          </div>
          <form onSubmit={handleCreate} className="space-y-4">
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
          <table className="w-full min-w-[900px]">
            <thead className="bg-gray-200 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-700 uppercase dark:text-gray-300">No</th>
                <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-700 uppercase dark:text-gray-300">UMKM</th>
                <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-700 uppercase dark:text-gray-300">Periode</th>
                <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-700 uppercase dark:text-gray-300">Kebutuhan (kWh)</th>
                <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-700 uppercase dark:text-gray-300">Biaya/Bulan</th>
                <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-700 uppercase dark:text-gray-300">Jam Operasi</th>
                <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-700 uppercase dark:text-gray-300">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {needs.map((n, i) => (
                <tr key={n.id} className="hover:bg-gray-50 transition-colors dark:hover:bg-white/[0.03]">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{i + 1}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 bg-gradient-to-br from-amber-500 to-orange-500"><BatteryCharging size={14} /></div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{n.business?.name || `Business #${n.business_id}`}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{n.period}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{Number(n.monthly_need_kwh).toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">Rp {Number(n.current_energy_cost).toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{n.operating_hours_per_day} jam/hari</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${statusBadge[n.validation_status] || "bg-gray-100 text-gray-500"}`}>{n.validation_status}</span>
                  </td>
                </tr>
              ))}
              {!needs.length && (
                <tr><td colSpan={7} className="px-6 py-16 text-center">
                  <Zap size={40} className="mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                  <div className="text-gray-500 font-medium dark:text-gray-400">Belum ada data kebutuhan energi</div>
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
