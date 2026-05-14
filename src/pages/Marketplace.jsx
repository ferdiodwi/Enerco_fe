import { useState, useEffect } from 'react';
import { ShoppingBag, Search, Filter, Store, Package, MapPin, Leaf } from 'lucide-react';
import api from '../services/api';

const sectors = ['Semua Sektor', 'food_processing', 'agriculture', 'fisheries', 'crafts', 'textile', 'services', 'retail'];
const sectorLabels = { food_processing: 'Makanan', agriculture: 'Pertanian', fisheries: 'Perikanan', crafts: 'Kerajinan', textile: 'Tekstil', services: 'Jasa', retail: 'Retail' };

export default function Marketplace() {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sectorFilter, setSectorFilter] = useState('Semua Sektor');
  const [meta, setMeta] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/products');
      const data = response.data.data.data || [];
      setAllProducts(data);
      setProducts(data);
      setMeta({
        current_page: response.data.data.current_page,
        last_page: response.data.data.last_page,
        total: response.data.data.total
      });
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = allProducts;
    if (search) filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase()));
    if (sectorFilter !== 'Semua Sektor') filtered = filtered.filter(p => p.business?.sector === sectorFilter);
    setProducts(filtered);
  };

  useEffect(() => { applyFilters(); }, [search, sectorFilter]);

  const formatIDR = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2" style={{fontFamily:'var(--font-heading)'}}>
          <ShoppingBag className="h-7 w-7 text-emerald-500" />
          Marketplace Produk UMKM
        </h1>
        <p className="text-slate-500 mt-1">
          Jelajahi produk dari UMKM yang menggunakan energi bersih.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
            <input type="text" placeholder="Cari produk..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
          </div>
          <select value={sectorFilter} onChange={e => setSectorFilter(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 min-w-[160px]">
            {sectors.map(s => (
              <option key={s} value={s}>{s === 'Semua Sektor' ? s : sectorLabels[s] || s}</option>
            ))}
          </select>
        </div>
        <p className="text-xs text-slate-400 mt-2">{products.length} produk ditampilkan</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
              <div className="h-48 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                {product.image ? (
                  <img 
                    src={`http://localhost:8000/storage/${product.image}`} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
                    }}
                  />
                ) : (
                  <Package className="h-16 w-16 text-slate-300" />
                )}
                
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-xs font-semibold px-2 py-1 rounded-md text-emerald-600 shadow-sm">
                  Energi Bersih
                </div>
              </div>
              
              <div className="p-4 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-slate-800 line-clamp-2" title={product.name}>
                    {product.name}
                  </h3>
                </div>
                
                <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">
                  {product.description || "Tidak ada deskripsi."}
                </p>
                
                <div className="mt-auto pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-3 text-xs text-slate-600">
                    <span className="flex items-center gap-1 truncate"><Store className="h-4 w-4" /> {product.business?.name || "UMKM Partner"}</span>
                    {product.business?.city && <span className="flex items-center gap-1 text-slate-400"><MapPin className="h-3 w-3" /> {product.business.city}</span>}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg text-emerald-600">
                      {formatIDR(product.price)}
                    </span>
                    <button className="bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors">
                      Detail
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-100 p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
            <Package className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800">Tidak ada produk ditemukan</h3>
          <p className="text-slate-500 mt-2 max-w-md mx-auto">
            Belum ada produk yang ditambahkan ke marketplace saat ini, atau pencarian Anda tidak membuahkan hasil.
          </p>
        </div>
      )}

      {/* Basic Pagination info */}
      {!loading && meta && meta.total > 0 && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <p className="text-sm text-slate-500">
            Menampilkan <span className="font-medium">{products.length}</span> dari <span className="font-medium">{meta.total}</span> produk
          </p>
        </div>
      )}
    </div>
  );
}
