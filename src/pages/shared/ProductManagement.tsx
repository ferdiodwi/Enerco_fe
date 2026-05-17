import { useEffect, useState } from "react";
import { ShoppingBag, Plus, Loader2, Image as ImageIcon, Search } from "lucide-react";
import Pagination from "@/components/ui/Pagination";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import TextArea from "@/components/form/input/TextArea";
import Checkbox from "@/components/form/input/Checkbox";
import api from "@/services/api";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface PaginationMeta { current_page: number; last_page: number; from: number; to: number; total: number; }

export default function ProductManagement() {
  const { userRole } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [perPage, setPerPage] = useState(20);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [meta, setMeta] = useState<PaginationMeta>({ current_page: 1, last_page: 1, from: 0, to: 0, total: 0 });

  const [form, setForm] = useState({
    business_id: "", name: "", description: "", category: "", price: "", stock: "", is_clean_energy_powered: false, image: null as File | null
  });

  const fetchData = () => {
    setLoading(true);
    const params: any = { per_page: perPage, page };
    if (search) params.search = search;
    if (statusFilter) params.status = statusFilter;
    
    api.get("/products", { params }).then((r) => { 
      const d = r.data.data; 
      setProducts(d.data); 
      setMeta({ current_page: d.current_page, last_page: d.last_page, from: d.from || 0, to: d.to || 0, total: d.total }); 
    }).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { setPage(1); }, [perPage, search, statusFilter]);
  useEffect(() => { 
    const t = setTimeout(() => fetchData(), 400);
    return () => clearTimeout(t);
  }, [perPage, page, search, statusFilter]);

  const set = (k: string, v: any) => setForm((p) => ({ ...p, [k]: v }));
  
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== null && value !== "") formData.append(key, value as any);
      });
      formData.append("is_clean_energy_powered", form.is_clean_energy_powered ? "1" : "0");
      
      await api.post("/products", formData, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Produk berhasil ditambahkan");
      setOpen(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal menyimpan produk");
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try { 
      await api.patch(`/products/${id}/status`, { status }); 
      toast.success("Status produk diubah"); 
      fetchData(); 
    } catch { 
      toast.error("Gagal"); 
    }
  };

  const statusBadge: Record<string, string> = { active: "bg-green-100 text-green-700", pending: "bg-amber-100 text-amber-700", rejected: "bg-red-100 text-red-700", archived: "bg-gray-100 text-gray-700" };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Product Management</h1><p className="text-gray-500 mt-1 dark:text-gray-400">Kelola katalog produk untuk marketplace</p></div>
        {userRole === "umkm" && (
          <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white transition">
            <Plus size={16} />Tambah Produk
          </button>
        )}
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 items-center justify-between dark:bg-white/[0.03] dark:border-gray-800">
        <div className="flex items-center gap-2 text-sm text-gray-600 whitespace-nowrap dark:text-gray-400">
          <span>Tampilkan</span>
          <select value={perPage} onChange={(e) => setPerPage(Number(e.target.value))} className="px-3 py-1.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-brand-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white">
            <option value={10}>10</option><option value={20}>20</option><option value={50}>50</option>
          </select>
          <span>baris</span>
        </div>
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full md:w-auto px-4 py-2 text-sm rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-brand-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white">
            <option value="">Semua Status</option><option value="active">Active</option><option value="pending">Pending</option><option value="rejected">Rejected</option><option value="archived">Archived</option>
          </select>
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search className="h-5 w-5 text-gray-400" /></div>
            <input value={search} onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Cari nama produk..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-brand-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:placeholder-gray-500" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-white/[0.03] dark:border-gray-800">
        {loading ? (
          <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-500" /></div>
        ) : (
          <table className="w-full min-w-[900px]">
            <thead className="bg-gray-200 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-700 uppercase dark:text-gray-300">Produk</th>
                <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-700 uppercase dark:text-gray-300">UMKM</th>
                <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-700 uppercase dark:text-gray-300">Kategori</th>
                <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-700 uppercase dark:text-gray-300">Harga & Stok</th>
                <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-700 uppercase dark:text-gray-300">Label Energi</th>
                <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-700 uppercase dark:text-gray-300">Status</th>
                {userRole === "admin" && <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-700 uppercase dark:text-gray-300">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors dark:hover:bg-white/[0.03]">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0 dark:bg-gray-800">
                        {p.image ? <img src={`${import.meta.env.VITE_API_URL}/storage/${p.image}`} alt={p.name} className="w-full h-full object-cover" /> : <ImageIcon size={18} className="text-gray-400" />}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900 dark:text-white">{p.name}</div>
                        <div className="text-xs text-gray-400 line-clamp-1 mt-0.5 max-w-[200px]">{p.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-700 dark:text-gray-300">{p.business?.name || `ID #${p.business_id}`}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 capitalize">{p.category}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-gray-900 dark:text-white">Rp {Number(p.price).toLocaleString()}</div>
                    <div className="text-xs text-gray-500 mt-0.5">Stok: {p.stock}</div>
                  </td>
                  <td className="px-6 py-4">
                    {p.is_clean_energy_powered ? 
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-md border border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20"><Zap size={10} fill="currentColor" /> Clean Energy</span> : 
                      <span className="text-xs text-gray-400">-</span>
                    }
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${statusBadge[p.status] || "bg-gray-100 text-gray-500"}`}>{p.status}</span>
                  </td>
                  {userRole === "admin" && (
                    <td className="px-6 py-4">
                      {p.status === "pending" && (
                        <div className="flex gap-2">
                          <button onClick={() => updateStatus(p.id, "active")} className="px-3 py-1 text-sm text-emerald-600 hover:text-emerald-700 font-medium">Approve</button>
                          <button onClick={() => updateStatus(p.id, "rejected")} className="px-3 py-1 text-sm text-red-600 hover:text-red-700 font-medium">Reject</button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))}
              {!products.length && (
                <tr><td colSpan={userRole === "admin" ? 7 : 6} className="px-6 py-16 text-center">
                  <ShoppingBag size={40} className="mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                  <div className="text-gray-500 font-medium dark:text-gray-400">Belum ada produk</div>
                </td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <Pagination from={meta.from} to={meta.to} total={meta.total} currentPage={meta.current_page} lastPage={meta.last_page} onPageChange={setPage} />

      <Modal isOpen={open} onClose={() => setOpen(false)} className="max-w-2xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center"><ShoppingBag size={20} className="text-emerald-600" /></div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Tambah Produk Baru</h3>
        </div>
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Business ID</Label><Input type="number" required value={form.business_id} onChange={(e) => set("business_id", e.target.value)} /></div>
            <div><Label>Nama Produk</Label><Input required value={form.name} onChange={(e) => set("name", e.target.value)} /></div>
          </div>
          <div><Label>Deskripsi</Label><TextArea required value={form.description} onChange={(e) => set("description", e.target.value)} /></div>
          <div className="grid grid-cols-3 gap-4">
            <div><Label>Kategori</Label><Input required value={form.category} onChange={(e) => set("category", e.target.value)} placeholder="Food / Craft" /></div>
            <div><Label>Harga (Rp)</Label><Input type="number" required value={form.price} onChange={(e) => set("price", e.target.value)} /></div>
            <div><Label>Stok</Label><Input type="number" required value={form.stock} onChange={(e) => set("stock", e.target.value)} /></div>
          </div>
          <div>
            <Label>Gambar Produk (Opsional)</Label>
            <input type="file" accept="image/*" onChange={(e) => set("image", e.target.files?.[0] || null)} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 dark:file:bg-emerald-500/10 dark:file:text-emerald-400 dark:text-gray-400" />
          </div>
          <div className="flex items-center gap-2 pt-2 pb-2">
            <Checkbox checked={form.is_clean_energy_powered} onChange={(e) => set("is_clean_energy_powered", e.target.checked)} />
            <Label className="mb-0">Produk dibuat menggunakan Energi Bersih (Clean Energy Powered)</Label>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg text-sm transition dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">Batal</button>
            <button type="submit" disabled={saving} className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg text-sm transition disabled:opacity-50">
              {saving ? "Menyimpan..." : "Simpan Produk"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
