import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Search, Shield, Trash2, MoreHorizontal } from "lucide-react";
import api from "@/services/api";
import type { User } from "@/types";
import { toast } from "sonner";

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const fetchUsers = () => {
    setLoading(true);
    const params: any = { per_page: 50 };
    if (search) params.search = search;
    if (roleFilter) params.role = roleFilter;
    api.get("/users", { params }).then((r) => setUsers(r.data.data.data)).catch(() => toast.error("Gagal memuat data")).finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, [search, roleFilter]);

  const updateStatus = async (id: number, status: string) => {
    try {
      await api.patch(`/users/${id}/status`, { status });
      toast.success("Status user berhasil diubah");
      fetchUsers();
    } catch { toast.error("Gagal mengubah status"); }
  };

  const deleteUser = async (id: number) => {
    if (!confirm("Yakin ingin menghapus user ini?")) return;
    try {
      await api.delete(`/users/${id}`);
      toast.success("User berhasil dihapus");
      fetchUsers();
    } catch { toast.error("Gagal menghapus user"); }
  };

  const statusBadge = (s: string) => {
    const map: Record<string, string> = {
      active: "bg-emerald-500/15 text-emerald-400",
      pending: "bg-amber-500/15 text-amber-400",
      suspended: "bg-red-500/15 text-red-400",
    };
    return map[s] || "bg-slate-500/15 text-slate-400";
  };

  const roleBadge = (name: string) => {
    const map: Record<string, string> = {
      admin: "bg-purple-500/15 text-purple-400",
      umkm: "bg-emerald-500/15 text-emerald-400",
      government: "bg-blue-500/15 text-blue-400",
      provider: "bg-amber-500/15 text-amber-400",
      partner: "bg-cyan-500/15 text-cyan-400",
    };
    return map[name] || "bg-slate-500/15 text-slate-400";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">User Management</h1><p className="text-slate-400 mt-1">Kelola semua akun pengguna sistem</p></div>
        <div className="flex items-center gap-2"><Users size={20} className="text-slate-400" /><span className="text-sm text-slate-400">{users.length} users</span></div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama atau email..."
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition" />
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500 transition">
          <option value="">Semua Role</option>
          <option value="admin">Admin</option>
          <option value="umkm">UMKM</option>
          <option value="government">Government</option>
          <option value="provider">Provider</option>
          <option value="partner">Partner</option>
        </select>
      </div>

      {/* Table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl bg-slate-900/70 border border-slate-800/60 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800/60">
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-4">User</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-4">Role</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-4">Phone</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-4">Status</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-4">Joined</th>
                  <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/30 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-white font-bold text-sm">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div><p className="text-sm font-medium text-white">{u.name}</p><p className="text-xs text-slate-400">{u.email}</p></div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${roleBadge(u.roles?.[0]?.name || "")}`}>
                        {u.roles?.[0]?.name || "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">{u.phone || "-"}</td>
                    <td className="px-6 py-4">
                      <select value={u.status} onChange={(e) => updateStatus(u.id, e.target.value)}
                        className={`text-xs px-2.5 py-1 rounded-full font-medium border-0 cursor-pointer ${statusBadge(u.status)}`}>
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">{new Date(u.created_at).toLocaleDateString("id-ID")}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => deleteUser(u.id)} className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition" title="Hapus">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!users.length && <div className="text-center py-12 text-slate-500">Tidak ada user ditemukan</div>}
          </div>
        )}
      </motion.div>
    </div>
  );
}
