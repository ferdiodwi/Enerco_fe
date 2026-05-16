import { useEffect, useState } from "react";
import { Users, Search, Trash2 } from "lucide-react";
import Badge from "@/components/ui/badge/Badge";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";
import api from "@/services/api";
import type { User } from "@/types";
import { toast } from "sonner";

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const fetchUsers = () => {
    setLoading(true);
    const params: any = { per_page: 50 };
    if (search) params.search = search;
    if (roleFilter && roleFilter !== "all") params.role = roleFilter;
    api.get("/users", { params }).then((r) => setUsers(r.data.data.data)).catch(() => toast.error("Gagal memuat data")).finally(() => setLoading(false));
  };
  useEffect(() => { fetchUsers(); }, [search, roleFilter]);

  const updateStatus = async (id: number, status: string) => {
    try { await api.patch(`/users/${id}/status`, { status }); toast.success("Status diubah"); fetchUsers(); } catch { toast.error("Gagal"); }
  };
  const deleteUser = async (id: number) => {
    if (!confirm("Yakin hapus user ini?")) return;
    try { await api.delete(`/users/${id}`); toast.success("User dihapus"); fetchUsers(); } catch { toast.error("Gagal"); }
  };

  const roleOptions = [
    { value: "all", label: "Semua Role" },
    { value: "admin", label: "Admin" },
    { value: "umkm", label: "UMKM" },
    { value: "government", label: "Government" },
    { value: "provider", label: "Provider" },
    { value: "partner", label: "Partner" },
  ];

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "pending", label: "Pending" },
    { value: "suspended", label: "Suspended" },
  ];

  const roleBadgeColor: Record<string, "primary" | "success" | "info" | "warning" | "light"> = { 
    admin: "primary", umkm: "success", government: "info", provider: "warning", partner: "light" 
  };
  
  const statusBadgeColor: Record<string, "success" | "warning" | "error"> = { 
    active: "success", pending: "warning", suspended: "error" 
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1><p className="text-gray-500 mt-1 dark:text-gray-400">Kelola semua akun pengguna sistem</p></div>
        <Badge variant="light" color="primary"><Users size={14} className="mr-1" />{users.length} users</Badge>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama atau email..." className="pl-10" />
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none" />
        </div>
        <div className="w-[160px]">
          <Select options={roleOptions} defaultValue={roleFilter} onChange={setRoleFilter} />
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-500" /></div>
          ) : (
            <table className="min-w-full align-middle text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-white/[0.02]">
                  <th className="px-5 py-3 text-left font-medium text-gray-500 dark:text-gray-400">User</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Role</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Phone</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Status</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Joined</th>
                  <th className="px-5 py-3 text-right font-medium text-gray-500 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-cyan-400 flex items-center justify-center text-white font-bold text-sm">{u.name.charAt(0).toUpperCase()}</div>
                        <div><p className="text-sm font-medium text-gray-800 dark:text-white">{u.name}</p><p className="text-xs text-gray-500 dark:text-gray-400">{u.email}</p></div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant="light" color={roleBadgeColor[u.roles?.[0]?.name || ""] || "light"}>
                        <span className="capitalize">{u.roles?.[0]?.name || "-"}</span>
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-gray-500 dark:text-gray-400 text-sm">{u.phone || "-"}</td>
                    <td className="px-5 py-4">
                      <div className="w-[130px]">
                        <Select options={statusOptions} defaultValue={u.status} onChange={(v) => updateStatus(u.id, v)} className="h-9 py-1 text-xs" />
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-500 dark:text-gray-400 text-sm">{new Date(u.created_at).toLocaleDateString("id-ID")}</td>
                    <td className="px-5 py-4 text-right">
                      <button onClick={() => deleteUser(u.id)} className="p-2 text-error-500 hover:bg-error-50 rounded-lg transition-colors dark:hover:bg-error-500/10">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!loading && !users.length && <div className="text-center py-12 text-gray-500 dark:text-gray-400">Tidak ada user ditemukan</div>}
        </div>
      </div>
    </div>
  );
}
