import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Search, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
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

  const roleBadge: Record<string, string> = { admin: "bg-purple-500/15 text-purple-400 border-purple-500/30", umkm: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30", government: "bg-blue-500/15 text-blue-400 border-blue-500/30", provider: "bg-amber-500/15 text-amber-400 border-amber-500/30", partner: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30" };
  const statusBadge: Record<string, string> = { active: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30", pending: "bg-amber-500/15 text-amber-400 border-amber-500/30", suspended: "bg-red-500/15 text-red-400 border-red-500/30" };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">User Management</h1><p className="text-slate-400 mt-1">Kelola semua akun pengguna sistem</p></div>
        <Badge variant="outline"><Users size={14} className="mr-1" />{users.length} users</Badge>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama atau email..." className="pl-10 bg-slate-900 border-slate-700" />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[160px] bg-slate-900 border-slate-700"><SelectValue placeholder="Semua Role" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Role</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="umkm">UMKM</SelectItem>
            <SelectItem value="government">Government</SelectItem>
            <SelectItem value="provider">Provider</SelectItem>
            <SelectItem value="partner">Partner</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="bg-slate-900/70 border-slate-800/60">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500" /></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800/60 hover:bg-transparent">
                  <TableHead>User</TableHead><TableHead>Role</TableHead><TableHead>Phone</TableHead><TableHead>Status</TableHead><TableHead>Joined</TableHead><TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id} className="border-slate-800/40">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-white font-bold text-sm">{u.name.charAt(0).toUpperCase()}</div>
                        <div><p className="text-sm font-medium text-white">{u.name}</p><p className="text-xs text-slate-400">{u.email}</p></div>
                      </div>
                    </TableCell>
                    <TableCell><Badge variant="outline" className={`capitalize ${roleBadge[u.roles?.[0]?.name || ""]}`}>{u.roles?.[0]?.name || "-"}</Badge></TableCell>
                    <TableCell className="text-slate-400 text-sm">{u.phone || "-"}</TableCell>
                    <TableCell>
                      <Select value={u.status} onValueChange={(v) => updateStatus(u.id, v)}>
                        <SelectTrigger className={`w-[120px] h-8 text-xs border-0 ${statusBadge[u.status]}`}><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="pending">Pending</SelectItem><SelectItem value="suspended">Suspended</SelectItem></SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-slate-400 text-sm">{new Date(u.created_at).toLocaleDateString("id-ID")}</TableCell>
                    <TableCell className="text-right"><Button variant="ghost" size="icon" onClick={() => deleteUser(u.id)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10"><Trash2 size={16} /></Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {!loading && !users.length && <div className="text-center py-12 text-slate-500">Tidak ada user ditemukan</div>}
        </CardContent>
      </Card>
    </div>
  );
}
