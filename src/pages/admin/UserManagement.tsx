import { useEffect, useState } from "react";
import { Users, Search } from "lucide-react";
import Pagination from "@/components/ui/Pagination";
import api from "@/services/api";
import type { User } from "@/types";
import { toast } from "sonner";

interface PaginationMeta { current_page: number; last_page: number; from: number; to: number; total: number; }

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [perPage, setPerPage] = useState(20);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<PaginationMeta>({ current_page: 1, last_page: 1, from: 0, to: 0, total: 0 });

  const fetchUsers = (p = page) => {
    setLoading(true);
    const params: any = { per_page: perPage, page: p };
    if (search) params.search = search;
    if (roleFilter) params.role = roleFilter;
    api.get("/users", { params })
      .then((r) => {
        const d = r.data.data;
        setUsers(d.data);
        setMeta({ current_page: d.current_page, last_page: d.last_page, from: d.from || 0, to: d.to || 0, total: d.total });
      })
      .catch(() => toast.error("Gagal memuat data"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { setPage(1); }, [search, roleFilter, perPage]);
  useEffect(() => {
    const t = setTimeout(() => fetchUsers(page), 400);
    return () => clearTimeout(t);
  }, [search, roleFilter, perPage, page]);

  const updateStatus = async (id: number, status: string) => {
    try { await api.patch(`/users/${id}/status`, { status }); toast.success("Status diubah"); fetchUsers(); } catch { toast.error("Gagal"); }
  };
  const deleteUser = async (id: number) => {
    if (!confirm("Yakin hapus user ini?")) return;
    try { await api.delete(`/users/${id}`); toast.success("User dihapus"); fetchUsers(); } catch { toast.error("Gagal"); }
  };

  const roleBadge: Record<string, string> = { admin: "bg-blue-100 text-blue-700", umkm: "bg-emerald-100 text-emerald-700", government: "bg-indigo-100 text-indigo-700", provider: "bg-amber-100 text-amber-700", partner: "bg-gray-100 text-gray-600" };

  const formatDate = (d: string) => new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div className="space-y-4">
      <div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1><p className="text-gray-500 mt-1 dark:text-gray-400">Kelola semua akun pengguna sistem</p></div>

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
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="w-full md:w-auto px-4 py-2 text-sm rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-brand-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white">
            <option value="">Semua Role</option><option value="admin">Admin</option><option value="umkm">UMKM</option><option value="government">Government</option><option value="provider">Provider</option><option value="partner">Partner</option>
          </select>
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search className="h-5 w-5 text-gray-400" /></div>
            <input value={search} onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Cari nama atau email..."
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
                <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-700 uppercase dark:text-gray-300">No</th>
                <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-700 uppercase dark:text-gray-300">User</th>
                <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-700 uppercase dark:text-gray-300">Role</th>
                <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-700 uppercase dark:text-gray-300">Phone</th>
                <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-700 uppercase dark:text-gray-300">Status</th>
                <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-700 uppercase dark:text-gray-300">Bergabung</th>
                <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-700 uppercase dark:text-gray-300">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {users.map((u, i) => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors dark:hover:bg-white/[0.03]">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{(meta.from || 1) + i}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 bg-gradient-to-br from-brand-400 to-brand-600">{u.name.charAt(0).toUpperCase()}</div>
                      <div><div className="text-sm font-medium text-gray-900 dark:text-white">{u.name}</div><div className="text-xs text-gray-400">{u.email}</div></div>
                    </div>
                  </td>
                  <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${roleBadge[u.roles?.[0]?.name || ""] || "bg-gray-100 text-gray-500"}`}>{u.roles?.[0]?.name || "-"}</span></td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{u.phone || "-"}</td>
                  <td className="px-6 py-4">
                    <select value={u.status} onChange={(e) => updateStatus(u.id, e.target.value)} className="px-3 py-1.5 text-xs rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-brand-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white">
                      <option value="active">Active</option><option value="pending">Pending</option><option value="suspended">Suspended</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{formatDate(u.created_at)}</td>
                  <td className="px-6 py-4"><button onClick={() => deleteUser(u.id)} className="px-3 py-1 text-sm text-red-600 hover:text-red-700 font-medium">Hapus</button></td>
                </tr>
              ))}
              {!users.length && (
                <tr><td colSpan={7} className="px-6 py-16 text-center">
                  <Users size={40} className="mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                  <div className="text-gray-500 font-medium dark:text-gray-400">Tidak ada user ditemukan</div>
                  <p className="text-sm text-gray-400 mt-1 dark:text-gray-500">Coba filter lain atau tambah user baru</p>
                </td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <Pagination from={meta.from} to={meta.to} total={meta.total} currentPage={meta.current_page} lastPage={meta.last_page} onPageChange={setPage} />
    </div>
  );
}
