import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Search, Leaf } from "lucide-react";
import Badge from "@/components/ui/badge/Badge";
import Select from "@/components/form/Select";
import api from "@/services/api";

export default function MarketplacePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    const params: any = { per_page: 50 };
    if (search) params.search = search;
    if (category && category !== "all") params.category = category;
    api.get("/products", { params })
      .then((r) => setProducts(r.data.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [search, category]);

  const categoryOptions = [
    { value: "all", label: "Semua Kategori" },
    { value: "Makanan", label: "Makanan" },
    { value: "Minuman", label: "Minuman" },
    { value: "Fashion", label: "Fashion" },
    { value: "Kerajinan", label: "Kerajinan" },
  ];

  const formatPrice = (p: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(p);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
              <Leaf size={18} className="text-white" />
            </div>
            <div>
              <span className="font-bold text-lg">EnergEco</span>
              <span className="text-[9px] text-slate-400 block -mt-1 uppercase tracking-widest">Marketplace</span>
            </div>
          </div>
          <a href="/" className="text-sm text-slate-400 hover:text-white transition">← Kembali</a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Marketplace Produk UMKM</h1>
          <p className="text-slate-400">Produk lokal berkualitas dari UMKM yang didukung energi bersih</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 z-10" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari produk..." className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500" />
          </div>
          <div className="w-[180px]">
            <Select options={categoryOptions} defaultValue={category} onChange={(v) => setCategory(v)} />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-500" />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06, duration: 0.4 }}>
                <div className="rounded-2xl border border-slate-800/60 bg-slate-900/70 hover:border-slate-700/80 transition-all group overflow-hidden">
                  <div className="h-44 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                    <ShoppingBag size={40} className="text-slate-700 group-hover:text-slate-600 transition" />
                  </div>
                  <div className="p-4 pb-2">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="light" color="primary"><span className="text-xs">{p.category}</span></Badge>
                      {p.is_clean_energy_powered && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                          <Leaf size={10} /> Clean Energy
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-semibold text-white line-clamp-2">{p.name}</h3>
                  </div>
                  <div className="px-4 pb-2">
                    <p className="text-sm text-slate-400 line-clamp-2 mb-3">{p.description}</p>
                    <p className="text-xs text-slate-500">oleh <span className="text-slate-300">{p.business?.name}</span></p>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3 border-t border-slate-800/50">
                    <span className="text-lg font-bold text-emerald-400">{formatPrice(Number(p.price))}</span>
                    <span className="text-xs text-slate-500">Stok: {p.stock}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && !products.length && (
          <div className="text-center py-20">
            <ShoppingBag size={48} className="text-slate-700 mx-auto mb-4" />
            <p className="text-slate-400">Tidak ada produk ditemukan</p>
          </div>
        )}
      </div>
    </div>
  );
}
