import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { Leaf, Eye, EyeOff, Loader2 } from "lucide-react";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";

const roles = [
  { value: "umkm", label: "UMKM", desc: "Pelaku usaha lokal" },
  { value: "provider", label: "Penyedia Energi", desc: "Pemilik sumber energi" },
  { value: "government", label: "Pemerintah", desc: "Pemerintah daerah" },
  { value: "partner", label: "Mitra/Investor", desc: "Mitra strategis" },
];

export default function RegisterPage() {
  const { register, token, userRole, isLoading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", password_confirmation: "", role: "", phone: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && token && userRole) {
      navigate(`/${userRole}`, { replace: true });
    }
  }, [token, userRole, isLoading, navigate]);

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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12 dark:bg-gray-900">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-teal-500 flex items-center justify-center">
            <Leaf size={22} className="text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">EnergEco</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2 dark:text-white">Buat Akun Baru</h1>
        <p className="text-gray-500 mb-8 dark:text-gray-400">Bergabung dalam ekosistem energi bersih</p>

        {error && (
          <div className="mb-6 rounded-xl border border-error-300 bg-error-50 p-3 text-error-600 text-sm dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label>Pilih Role</Label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {roles.map((r) => (
                <button key={r.value} type="button" onClick={() => set("role", r.value)}
                  className={`h-auto p-3 text-left flex flex-col items-start rounded-xl border transition-all ${form.role === r.value ? "bg-brand-50 border-brand-500 text-brand-600 dark:bg-brand-500/15 dark:border-brand-500 dark:text-brand-400" : "bg-white border-gray-200 text-gray-500 hover:text-gray-800 hover:border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white"}`}>
                  <span className="text-sm font-medium">{r.label}</span>
                  <span className="text-xs opacity-70 mt-0.5">{r.desc}</span>
                </button>
              ))}
            </div>
            {errors.role && <p className="text-error-500 text-xs mt-1">{errors.role[0]}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label htmlFor="name">Nama Lengkap</Label><Input id="name" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="John Doe" /></div>
            <div className="space-y-2"><Label htmlFor="phone">No. Telepon</Label><Input id="phone" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="081234567890" /></div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reg-email">Email</Label>
            <Input id="reg-email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="nama@email.com" />
            {errors.email && <p className="text-error-500 text-xs mt-1">{errors.email[0]}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reg-pw">Password</Label>
              <div className="relative">
                <Input id="reg-pw" type={showPw ? "text" : "password"} value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="Min. 8 karakter" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-white"><Eye size={16} /></button>
              </div>
            </div>
            <div className="space-y-2"><Label htmlFor="reg-confirm">Konfirmasi</Label><Input id="reg-confirm" type="password" value={form.password_confirmation} onChange={(e) => set("password_confirmation", e.target.value)} placeholder="••••••••" /></div>
          </div>

          <button type="submit" disabled={loading || !form.role} className="flex w-full justify-center rounded-lg bg-brand-500 p-3 font-medium text-white hover:bg-brand-600 disabled:opacity-50 transition-colors h-12 text-base items-center">
            {loading ? <><Loader2 size={18} className="animate-spin mr-2" /> Memproses...</> : "Buat Akun"}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-8 dark:text-gray-400">
          Sudah punya akun? <Link to="/login" className="text-brand-500 hover:text-brand-600 font-medium dark:text-brand-400">Masuk</Link>
        </p>
      </motion.div>
    </div>
  );
}
