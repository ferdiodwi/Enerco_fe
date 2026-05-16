import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { Leaf, Eye, EyeOff, Loader2 } from "lucide-react";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login gagal. Periksa email dan password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex dark:bg-gray-900">
      {/* Left - Branding */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden bg-gray-100 dark:bg-gray-800">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 text-center px-12">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-400 to-teal-500 flex items-center justify-center mx-auto mb-8">
            <Leaf size={40} className="text-white" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight dark:text-white">EnergEco GlobalChain</h2>
          <p className="text-gray-500 text-lg leading-relaxed max-w-md dark:text-gray-400">
            Platform AI untuk distribusi energi bersih yang cerdas, merata, dan berdampak bagi ekonomi lokal.
          </p>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-teal-500 flex items-center justify-center">
              <Leaf size={22} className="text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">EnergEco</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2 dark:text-white">Selamat Datang</h1>
          <p className="text-gray-500 mb-8 dark:text-gray-400">Masuk ke akun Anda untuk melanjutkan</p>

          {error && (
            <div className="mb-6 rounded-xl border border-error-300 bg-error-50 p-3 text-error-600 text-sm dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nama@email.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input id="password" type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-white">
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="flex w-full justify-center rounded-lg bg-brand-500 p-3 font-medium text-white hover:bg-brand-600 disabled:opacity-50 transition-colors h-12 text-base items-center">
              {loading ? <><Loader2 size={18} className="animate-spin mr-2" /> Memproses...</> : "Masuk"}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-8 dark:text-gray-400">
            Belum punya akun?{" "}
            <Link to="/register" className="text-brand-500 hover:text-brand-600 font-medium dark:text-brand-400">Daftar sekarang</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
