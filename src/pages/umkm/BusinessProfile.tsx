import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Building2, BatteryCharging, Zap, Plus, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500" /></div>;

  if (!business) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Business Profile</h1>
        <Card className="bg-slate-900/70 border-slate-800/60 p-8 text-center">
          <Building2 size={48} className="text-emerald-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Belum ada profil usaha</h2>
          <p className="text-slate-400 mb-6">Buat profil usaha Anda untuk mendapatkan rekomendasi energi bersih</p>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-500 hover:bg-emerald-400"><Plus size={18} className="mr-2" />Buat Profil</Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-700 max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle>Buat Profil UMKM</DialogTitle></DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Nama Usaha</Label><Input value={form.name} onChange={(e) => set("name", e.target.value)} required className="bg-slate-800 border-slate-700" /></div>
                  <div><Label>Sektor</Label><Input value={form.sector} onChange={(e) => set("sector", e.target.value)} required placeholder="Agroindustri" className="bg-slate-800 border-slate-700" /></div>
                </div>
                <div><Label>Deskripsi</Label><Textarea value={form.description} onChange={(e) => set("description", e.target.value)} required className="bg-slate-800 border-slate-700" /></div>
                <div><Label>Alamat</Label><Input value={form.address} onChange={(e) => set("address", e.target.value)} required className="bg-slate-800 border-slate-700" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Latitude</Label><Input type="number" step="any" value={form.latitude} onChange={(e) => set("latitude", e.target.value)} required className="bg-slate-800 border-slate-700" /></div>
                  <div><Label>Longitude</Label><Input type="number" step="any" value={form.longitude} onChange={(e) => set("longitude", e.target.value)} required className="bg-slate-800 border-slate-700" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Jumlah Karyawan</Label><Input type="number" value={form.employee_count} onChange={(e) => set("employee_count", e.target.value)} required className="bg-slate-800 border-slate-700" /></div>
                  <div><Label>Kapasitas Produksi</Label><Input type="number" step="any" value={form.production_capacity} onChange={(e) => set("production_capacity", e.target.value)} required className="bg-slate-800 border-slate-700" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Kebutuhan Energi (kWh/bulan)</Label><Input type="number" step="any" value={form.monthly_energy_need} onChange={(e) => set("monthly_energy_need", e.target.value)} required className="bg-slate-800 border-slate-700" /></div>
                  <div><Label>Biaya Energi Saat Ini (Rp)</Label><Input type="number" step="any" value={form.current_energy_cost} onChange={(e) => set("current_energy_cost", e.target.value)} required className="bg-slate-800 border-slate-700" /></div>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="clean" checked={form.clean_energy_access} onChange={(e) => set("clean_energy_access", e.target.checked)} className="rounded" />
                  <Label htmlFor="clean">Sudah punya akses energi bersih</Label>
                </div>
                <Button type="submit" disabled={saving} className="w-full bg-emerald-500 hover:bg-emerald-400">
                  {saving ? <><Loader2 size={16} className="mr-2 animate-spin" />Menyimpan...</> : "Simpan Profil"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Business Profile</h1>
        <Badge variant="outline" className={business.verification_status === "verified" ? "border-emerald-500 text-emerald-400" : "border-amber-500 text-amber-400"}>
          {business.verification_status}
        </Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 bg-slate-900/70 border-slate-800/60">
          <CardHeader><CardTitle className="flex items-center gap-2"><Building2 size={20} className="text-emerald-400" />{business.name}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-slate-400">Sektor</span><p className="text-white font-medium">{business.sector}</p></div>
              <div><span className="text-slate-400">Karyawan</span><p className="text-white font-medium">{business.employee_count} orang</p></div>
              <div><span className="text-slate-400">Alamat</span><p className="text-white font-medium">{business.address}</p></div>
              <div><span className="text-slate-400">Koordinat</span><p className="text-white font-medium">{business.latitude}, {business.longitude}</p></div>
            </div>
            <div><span className="text-sm text-slate-400">Deskripsi</span><p className="text-white mt-1">{business.description}</p></div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="bg-slate-900/70 border-slate-800/60">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2"><BatteryCharging size={18} className="text-amber-400" /><span className="text-sm text-slate-400">Kebutuhan Energi</span></div>
              <p className="text-2xl font-bold text-white">{Number(business.monthly_energy_need).toLocaleString()} kWh</p>
              <p className="text-xs text-slate-500 mt-1">per bulan</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/70 border-slate-800/60">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2"><Zap size={18} className="text-emerald-400" /><span className="text-sm text-slate-400">Biaya Energi</span></div>
              <p className="text-2xl font-bold text-white">Rp {Number(business.current_energy_cost).toLocaleString()}</p>
              <p className="text-xs text-slate-500 mt-1">per bulan</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
