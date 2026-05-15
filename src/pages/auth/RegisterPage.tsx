import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { Leaf, Eye, EyeOff, Loader2 } from "lucide-react";

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
    setError("");
    setErrors({});
    setLoading(true);
    try {
      await register(form);
      navigate(`/${form.role}`);
      window.location.reload();
    } catch (err: any) {
      setError(err.response?.data?.message || "Registrasi gagal");
      if (err.response?.data?.errors) setErrors(err.response.data.errors);
    } finally {
      setLoading(false);
    }
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

        {error && <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Pilih Role</label>
            <div className="grid grid-cols-2 gap-3">
              {roles.map((r) => (
                <button key={r.value} type="button" onClick={() => set("role", r.value)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    form.role === r.value
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                      : "border-slate-700 bg-slate-900 text-slate-400 hover:border-slate-500"
                  }`}>
                  <p className="text-sm font-medium">{r.label}</p>
                  <p className="text-xs opacity-70 mt-0.5">{r.desc}</p>
                </button>
              ))}
            </div>
            {errors.role && <p className="text-red-400 text-xs mt-1">{errors.role[0]}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Nama Lengkap</label>
              <input value={form.name} onChange={(e) => set("name", e.target.value)} required
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">No. Telepon</label>
              <input value={form.phone} onChange={(e) => set("phone", e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition" placeholder="081234567890" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
            <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} required
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition" placeholder="nama@email.com" />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email[0]}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} value={form.password} onChange={(e) => set("password", e.target.value)} required
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition pr-12" placeholder="Min. 8 karakter" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Konfirmasi</label>
              <input type="password" value={form.password_confirmation} onChange={(e) => set("password_confirmation", e.target.value)} required
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition" placeholder="••••••••" />
            </div>
          </div>

          <button type="submit" disabled={loading || !form.role}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-semibold transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <><Loader2 size={18} className="animate-spin" /> Memproses...</> : "Buat Akun"}
          </button>
        </form>

        <p className="text-center text-slate-400 text-sm mt-8">
          Sudah punya akun? <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-medium">Masuk</Link>
        </p>
      </motion.div>
    </div>
  );
}
