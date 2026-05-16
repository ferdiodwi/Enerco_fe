import { useEffect, useState } from "react";
import { Building2, BatteryCharging, Zap, Plus, Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import TextArea from "@/components/form/input/TextArea";
import Checkbox from "@/components/form/input/Checkbox";
import api from "@/services/api";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export default function BusinessProfile() {
  const { user } = useAuth();
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "", sector: "", description: "", address: "",
    latitude: "", longitude: "", employee_count: "",
    production_capacity: "", monthly_energy_need: "",
    current_energy_cost: "", clean_energy_access: false,
  });

  useEffect(() => {
    api.get("/businesses", { params: { per_page: 1 } })
      .then((r) => {
        const mine = r.data.data.data.find((b: any) => b.user_id === user?.id);
        if (mine) setBusiness(mine);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const set = (k: string, v: any) => setForm((p) => ({ ...p, [k]: v }));

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude),
        employee_count: parseInt(form.employee_count),
        production_capacity: parseFloat(form.production_capacity),
        monthly_energy_need: parseFloat(form.monthly_energy_need),
        current_energy_cost: parseFloat(form.current_energy_cost),
      };
      const res = await api.post("/businesses", payload);
      setBusiness(res.data.data);
      setOpen(false);
      toast.success("Profil UMKM berhasil dibuat");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal membuat profil");
    } finally { setSaving(false); }
  };

  const statusBadge: Record<string, string> = { verified: "bg-green-100 text-green-700", pending: "bg-amber-100 text-amber-700", rejected: "bg-red-100 text-red-700" };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-500" /></div>;

  if (!business) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Business Profile</h1>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center dark:bg-white/[0.03] dark:border-gray-800">
          <Building2 size={48} className="text-brand-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2 dark:text-white">Belum ada profil usaha</h2>
          <p className="text-gray-500 mb-6 dark:text-gray-400">Buat profil usaha Anda untuk mendapatkan rekomendasi energi bersih</p>
          <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white transition">
            <Plus size={16} />Buat Profil
          </button>
          
          <Modal isOpen={open} onClose={() => setOpen(false)} className="max-w-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center"><Building2 size={20} className="text-emerald-600" /></div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Buat Profil UMKM</h3>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Nama Usaha</Label><Input value={form.name} onChange={(e) => set("name", e.target.value)} /></div>
                <div><Label>Sektor</Label><Input value={form.sector} onChange={(e) => set("sector", e.target.value)} placeholder="Agroindustri" /></div>
              </div>
              <div><Label>Deskripsi</Label><TextArea value={form.description} onChange={(e) => set("description", e.target.value)} /></div>
              <div><Label>Alamat</Label><Input value={form.address} onChange={(e) => set("address", e.target.value)} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Latitude</Label><Input type="number" step={0.000001} value={form.latitude} onChange={(e) => set("latitude", e.target.value)} /></div>
                <div><Label>Longitude</Label><Input type="number" step={0.000001} value={form.longitude} onChange={(e) => set("longitude", e.target.value)} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Jumlah Karyawan</Label><Input type="number" value={form.employee_count} onChange={(e) => set("employee_count", e.target.value)} /></div>
                <div><Label>Kapasitas Produksi</Label><Input type="number" step={0.1} value={form.production_capacity} onChange={(e) => set("production_capacity", e.target.value)} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Kebutuhan Energi (kWh/bulan)</Label><Input type="number" step={0.1} value={form.monthly_energy_need} onChange={(e) => set("monthly_energy_need", e.target.value)} /></div>
                <div><Label>Biaya Energi Saat Ini (Rp)</Label><Input type="number" step={1} value={form.current_energy_cost} onChange={(e) => set("current_energy_cost", e.target.value)} /></div>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <Checkbox checked={form.clean_energy_access} onChange={(e) => set("clean_energy_access", e.target.checked)} />
                <Label className="mb-0">Sudah punya akses energi bersih</Label>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg text-sm transition dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">Batal</button>
                <button type="submit" disabled={saving} className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg text-sm transition disabled:opacity-50">
                  {saving ? "Menyimpan..." : "Simpan Profil"}
                </button>
              </div>
            </form>
          </Modal>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Business Profile</h1>
        <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${statusBadge[business.verification_status] || "bg-gray-100 text-gray-500"}`}>{business.verification_status}</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Main Info */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6 dark:bg-white/[0.03] dark:border-gray-800">
          <h2 className="flex items-center gap-2 text-xl font-bold text-gray-800 mb-6 dark:text-white">
            <Building2 size={24} className="text-emerald-500" />{business.name}
          </h2>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-100 dark:bg-gray-800/40 dark:border-gray-700/30">
                <div className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-1">Sektor</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">{business.sector}</div>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-100 dark:bg-gray-800/40 dark:border-gray-700/30">
                <div className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-1">Karyawan</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">{business.employee_count} orang</div>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-100 dark:bg-gray-800/40 dark:border-gray-700/30">
                <div className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-1">Alamat</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">{business.address}</div>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-100 dark:bg-gray-800/40 dark:border-gray-700/30">
                <div className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-1">Koordinat</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">{business.latitude}, {business.longitude}</div>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-gray-50 border border-gray-100 dark:bg-gray-800/40 dark:border-gray-700/30">
              <div className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-1">Deskripsi</div>
              <div className="text-sm font-medium text-gray-900 leading-relaxed dark:text-white">{business.description}</div>
            </div>
          </div>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 dark:bg-white/[0.03] dark:border-gray-800">
            <div className="flex items-center gap-2 mb-3"><BatteryCharging size={20} className="text-amber-500" /><span className="text-sm font-medium text-gray-500 dark:text-gray-400">Kebutuhan Energi</span></div>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{Number(business.monthly_energy_need).toLocaleString()} kWh</p>
            <p className="text-xs text-gray-400 mt-1">per bulan</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 dark:bg-white/[0.03] dark:border-gray-800">
            <div className="flex items-center gap-2 mb-3"><Zap size={20} className="text-emerald-500" /><span className="text-sm font-medium text-gray-500 dark:text-gray-400">Biaya Energi</span></div>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">Rp {Number(business.current_energy_cost).toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-1">per bulan</p>
          </div>
        </div>
      </div>
    </div>
  );
}
