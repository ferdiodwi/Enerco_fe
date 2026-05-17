import { useEffect, useState } from "react";
import { ShoppingBag, Search, Zap, Image as ImageIcon } from "lucide-react";
import Pagination from "@/components/ui/Pagination";
import api from "@/services/api";

interface PaginationMeta { current_page: number; last_page: number; from: number; to: number; total: number; }

export default function Marketplace() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [perPage, setPerPage] = useState(12);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<PaginationMeta>({ current_page: 1, last_page: 1, from: 0, to: 0, total: 0 });

  const fetchData = () => {
    setLoading(true);
    const params: any = { per_page: perPage, page, status: "active" };
    if (search) params.search = search;
    if (categoryFilter) params.category = categoryFilter;
    
    api.get("/products", { params }).then((r) => { 
      const d = r.data.data; 
      setProducts(d.data); 
      setMeta({ current_page: d.current_page, last_page: d.last_page, from: d.from || 0, to: d.to || 0, total: d.total }); 
    }).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { setPage(1); }, [search, categoryFilter, perPage]);
  useEffect(() => { 
    const t = setTimeout(() => fetchData(), 400);
    return () => clearTimeout(t);
  }, [search, categoryFilter, perPage, page]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Marketplace</h1>
        <p className="text-gray-500 mt-1 dark:text-gray-400">Katalog produk dari UMKM yang didukung energi bersih</p>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 items-center justify-between dark:bg-white/[0.03] dark:border-gray-800">
        <div className="flex items-center gap-2 text-sm text-gray-600 whitespace-nowrap dark:text-gray-400">
          <span>Tampilkan</span>
          <select value={perPage} onChange={(e) => setPerPage(Number(e.target.value))} className="px-3 py-1.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-brand-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white">
            <option value={12}>12</option><option value={24}>24</option><option value={48}>48</option>
          </select>
          <span>produk</span>
        </div>
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="w-full md:w-auto px-4 py-2 text-sm rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-brand-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white">
            <option value="">Semua Kategori</option><option value="Makanan">Makanan</option><option value="Minuman">Minuman</option><option value="Fashion">Fashion</option><option value="Kerajinan">Kerajinan</option>
          </select>
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search className="h-5 w-5 text-gray-400" /></div>
            <input value={search} onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Cari nama produk..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-brand-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:placeholder-gray-500" />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500" /></div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((p) => (
            <div key={p.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md hover:border-emerald-200 transition-all group dark:bg-gray-900 dark:border-gray-800 dark:hover:border-emerald-500/30">
              <div className="h-48 bg-gray-100 flex items-center justify-center relative overflow-hidden dark:bg-gray-800">
                {p.image ? (
                  <img src={`${import.meta.env.VITE_API_URL}/storage/${p.image}`} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <ImageIcon size={40} className="text-gray-300 dark:text-gray-600" />
                )}
                {p.is_clean_energy_powered && (
                  <div className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm flex items-center gap-1">
                    <Zap size={10} fill="currentColor" /> CLEAN ENERGY
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">{p.category}</span>
                  <span className="text-xs text-gray-400">Stok: {p.stock}</span>
                </div>
                <h3 className="font-bold text-gray-900 text-base line-clamp-1 mb-1 dark:text-white">{p.name}</h3>
                <p className="text-xs text-gray-500 line-clamp-2 mb-4 dark:text-gray-400">{p.description}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">Rp {Number(p.price).toLocaleString()}</span>
                  <span className="text-xs font-medium text-gray-500 truncate max-w-[100px] dark:text-gray-400" title={p.business?.name}>Oleh: {p.business?.name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 py-16 text-center dark:bg-white/[0.03] dark:border-gray-800">
          <ShoppingBag size={48} className="text-gray-300 mx-auto mb-4 dark:text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-800 mb-1 dark:text-white">Tidak Ada Produk</h3>
          <p className="text-gray-500 dark:text-gray-400">Coba ubah filter atau kata kunci pencarian Anda</p>
        </div>
      )}

      {products.length > 0 && (
        <Pagination from={meta.from} to={meta.to} total={meta.total} currentPage={meta.current_page} lastPage={meta.last_page} onPageChange={setPage} />
      )}
    </div>
  );
}
