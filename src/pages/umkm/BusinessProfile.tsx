import { useEffect, useState } from "react";
import { Building2, BatteryCharging, Zap, Plus, Loader2 } from "lucide-react";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
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

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-500" /></div>;

  if (!business) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Business Profile</h1>
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-white/[0.03]">
          <Building2 size={48} className="text-brand-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2 dark:text-white">Belum ada profil usaha</h2>
          <p className="text-gray-500 mb-6 dark:text-gray-400">Buat profil usaha Anda untuk mendapatkan rekomendasi energi bersih</p>
          <button onClick={() => setOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 transition-colors">
            <Plus size={18} />Buat Profil
          </button>
          
          <Modal isOpen={open} onClose={() => setOpen(false)} className="max-w-2xl p-6">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">Buat Profil UMKM</h3>
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
              <div className="pt-4">
                <button type="submit" disabled={saving} className="flex w-full justify-center rounded-lg bg-brand-500 p-3 font-medium text-white hover:bg-brand-600 disabled:opacity-50">
                  {saving ? <><Loader2 size={20} className="mr-2 animate-spin" />Menyimpan...</> : "Simpan Profil"}
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
        <Badge variant="light" color={business.verification_status === "verified" ? "success" : "warning"}>
          <span className="capitalize">{business.verification_status}</span>
        </Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h2 className="flex items-center gap-2 text-xl font-bold text-gray-800 mb-6 dark:text-white">
            <Building2 size={24} className="text-brand-500" />{business.name}
          </h2>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div><span className="text-gray-500 dark:text-gray-400">Sektor</span><p className="text-gray-800 font-medium mt-1 dark:text-white">{business.sector}</p></div>
              <div><span className="text-gray-500 dark:text-gray-400">Karyawan</span><p className="text-gray-800 font-medium mt-1 dark:text-white">{business.employee_count} orang</p></div>
              <div><span className="text-gray-500 dark:text-gray-400">Alamat</span><p className="text-gray-800 font-medium mt-1 dark:text-white">{business.address}</p></div>
              <div><span className="text-gray-500 dark:text-gray-400">Koordinat</span><p className="text-gray-800 font-medium mt-1 dark:text-white">{business.latitude}, {business.longitude}</p></div>
            </div>
            <div><span className="text-sm text-gray-500 dark:text-gray-400">Deskripsi</span><p className="text-gray-800 mt-1 dark:text-white">{business.description}</p></div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-center gap-2 mb-3"><BatteryCharging size={20} className="text-warning-500" /><span className="text-sm font-medium text-gray-500 dark:text-gray-400">Kebutuhan Energi</span></div>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{Number(business.monthly_energy_need).toLocaleString()} kWh</p>
            <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">per bulan</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-center gap-2 mb-3"><Zap size={20} className="text-success-500" /><span className="text-sm font-medium text-gray-500 dark:text-gray-400">Biaya Energi</span></div>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">Rp {Number(business.current_energy_cost).toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">per bulan</p>
          </div>
        </div>
      </div>
    </div>
  );
}
