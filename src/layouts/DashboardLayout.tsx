import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Users, Building2, Zap, BatteryCharging, Map, Brain, Truck, ShoppingBag, Handshake, FileText, Settings, LogOut, Menu, X, ChevronDown, Leaf } from "lucide-react";

const menuMap: Record<string, { label: string; icon: React.ReactNode; path: string }[]> = {
  admin: [{ label: "Overview", icon: <LayoutDashboard size={20} />, path: "" }, { label: "Users", icon: <Users size={20} />, path: "users" }, { label: "UMKM", icon: <Building2 size={20} />, path: "businesses" }, { label: "Energy Sources", icon: <Zap size={20} />, path: "energy-sources" }, { label: "Energy Needs", icon: <BatteryCharging size={20} />, path: "energy-needs" }, { label: "Recommendations", icon: <Brain size={20} />, path: "recommendations" }, { label: "Distributions", icon: <Truck size={20} />, path: "distributions" }, { label: "Products", icon: <ShoppingBag size={20} />, path: "products" }, { label: "Partnerships", icon: <Handshake size={20} />, path: "partnerships" }, { label: "Reports", icon: <FileText size={20} />, path: "reports" }],
  umkm: [{ label: "Overview", icon: <LayoutDashboard size={20} />, path: "" }, { label: "Business Profile", icon: <Building2 size={20} />, path: "business" }, { label: "Energy Needs", icon: <BatteryCharging size={20} />, path: "energy-needs" }, { label: "Recommendations", icon: <Brain size={20} />, path: "recommendations" }, { label: "Products", icon: <ShoppingBag size={20} />, path: "products" }, { label: "Partnerships", icon: <Handshake size={20} />, path: "partnerships" }],
  government: [{ label: "Overview", icon: <LayoutDashboard size={20} />, path: "" }, { label: "Priority Map", icon: <Map size={20} />, path: "map" }, { label: "Businesses", icon: <Building2 size={20} />, path: "businesses" }, { label: "Energy Sources", icon: <Zap size={20} />, path: "energy-sources" }, { label: "Recommendations", icon: <Brain size={20} />, path: "recommendations" }, { label: "Impact Reports", icon: <FileText size={20} />, path: "reports" }],
  provider: [{ label: "Overview", icon: <LayoutDashboard size={20} />, path: "" }, { label: "Energy Sources", icon: <Zap size={20} />, path: "energy-sources" }, { label: "Distributions", icon: <Truck size={20} />, path: "distributions" }],
  partner: [{ label: "Overview", icon: <LayoutDashboard size={20} />, path: "" }, { label: "Opportunities", icon: <Building2 size={20} />, path: "businesses" }, { label: "Marketplace", icon: <ShoppingBag size={20} />, path: "marketplace" }, { label: "Partnerships", icon: <Handshake size={20} />, path: "partnerships" }],
};

export default function DashboardLayout() {
  const { user, logout, userRole } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const role = userRole || "umkm";
  const menus = menuMap[role] || [];
  const basePath = `/${role}`;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-700/50">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center"><Leaf size={22} className="text-white" /></div>
        {sidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-hidden">
            <h1 className="text-lg font-bold text-white tracking-tight">EnergEco</h1>
            <p className="text-[10px] text-slate-400 -mt-0.5 uppercase tracking-widest">GlobalChain</p>
          </motion.div>
        )}
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menus.map((item) => (
          <NavLink
            key={item.path} to={`${basePath}/${item.path}`} end={item.path === ""}
            className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive ? "bg-brand-500/15 text-brand-400 shadow-sm shadow-brand-500/10" : "text-slate-400 hover:text-white hover:bg-slate-700/50"}`}
            onClick={() => setMobileOpen(false)}
          >
            {item.icon}
            {sidebarOpen && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-slate-700/50">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-cyan-400 flex items-center justify-center text-white font-bold text-sm">{user?.name?.charAt(0).toUpperCase()}</div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-slate-400 capitalize">{role}</p>
            </div>
          )}
        </div>
        <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-error-400 hover:bg-error-500/10 hover:text-error-300 transition-colors">
          <LogOut size={20} />
          {sidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <aside className={`hidden lg:flex flex-col fixed inset-y-0 left-0 z-30 bg-slate-900/80 backdrop-blur-xl border-r border-slate-700/50 transition-all duration-300 ${sidebarOpen ? "w-64" : "w-20"}`}>
        <SidebarContent />
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: "spring", damping: 25 }} className="fixed inset-y-0 left-0 w-64 bg-slate-900 z-50 lg:hidden">
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "lg:ml-20"}`}>
        <header className="sticky top-0 z-20 bg-slate-900/60 backdrop-blur-xl border-b border-slate-700/50 px-4 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"><Menu size={24} /></button>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hidden lg:flex p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">{sidebarOpen ? <X size={20} /> : <Menu size={20} />}</button>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs px-3 py-1 rounded-full bg-brand-500/15 text-brand-400 font-medium capitalize">{role}</span>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
