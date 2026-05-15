import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { Leaf, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

const roles = [
  { value: "umkm", label: "UMKM", desc: "Pelaku usaha lokal" },
  { value: "provider", label: "Penyedia Energi", desc: "Pemilik sumber energi" },
  { value: "government", label: "Pemerintah", desc: "Pemerintah daerah" },
  { value: "partner", label: "Mitra/Investor", desc: "Mitra strategis" },
];

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", password_confirmation: "", role: "", phone: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  const set = (key: string, val: string) => setForm((p) => ({ ...p, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setErrors({}); setLoading(true);
    try {
      await register(form);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registrasi gagal");
      if (err.response?.data?.errors) setErrors(err.response.data.errors);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
            <Leaf size={22} className="text-white" />
          </div>
          <span className="text-xl font-bold text-white">EnergEco</span>
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">Buat Akun Baru</h1>
        <p className="text-slate-400 mb-8">Bergabung dalam ekosistem energi bersih</p>

        {error && <Card className="mb-6 bg-red-500/10 border-red-500/20"><CardContent className="py-3 text-red-400 text-sm">{error}</CardContent></Card>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label>Pilih Role</Label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {roles.map((r) => (
                <Button key={r.value} type="button" variant={form.role === r.value ? "default" : "outline"} onClick={() => set("role", r.value)}
                  className={`h-auto p-3 justify-start flex-col items-start ${form.role === r.value ? "bg-emerald-500/15 border-emerald-500 text-emerald-400 hover:bg-emerald-500/20" : "bg-slate-900 border-slate-700 text-slate-400 hover:text-white"}`}>
                  <span className="text-sm font-medium">{r.label}</span>
                  <span className="text-xs opacity-70 mt-0.5">{r.desc}</span>
                </Button>
              ))}
            </div>
            {errors.role && <p className="text-red-400 text-xs mt-1">{errors.role[0]}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label htmlFor="name">Nama Lengkap</Label><Input id="name" value={form.name} onChange={(e) => set("name", e.target.value)} required placeholder="John Doe" className="bg-slate-900 border-slate-700" /></div>
            <div className="space-y-2"><Label htmlFor="phone">No. Telepon</Label><Input id="phone" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="081234567890" className="bg-slate-900 border-slate-700" /></div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reg-email">Email</Label>
            <Input id="reg-email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} required placeholder="nama@email.com" className="bg-slate-900 border-slate-700" />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email[0]}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reg-pw">Password</Label>
              <div className="relative">
                <Input id="reg-pw" type={showPw ? "text" : "password"} value={form.password} onChange={(e) => set("password", e.target.value)} required placeholder="Min. 8 karakter" className="bg-slate-900 border-slate-700 pr-10" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"><Eye size={16} /></button>
              </div>
            </div>
            <div className="space-y-2"><Label htmlFor="reg-confirm">Konfirmasi</Label><Input id="reg-confirm" type="password" value={form.password_confirmation} onChange={(e) => set("password_confirmation", e.target.value)} required placeholder="••••••••" className="bg-slate-900 border-slate-700" /></div>
          </div>

          <Button type="submit" disabled={loading || !form.role} className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 shadow-lg shadow-emerald-500/20 h-12 text-base">
            {loading ? <><Loader2 size={18} className="animate-spin mr-2" /> Memproses...</> : "Buat Akun"}
          </Button>
        </form>

        <p className="text-center text-slate-400 text-sm mt-8">
          Sudah punya akun? <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-medium">Masuk</Link>
        </p>
      </motion.div>
    </div>
  );
}
