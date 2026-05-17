import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

import {
  BoxCubeIcon,
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  ListIcon,
  PageIcon,
  PieChartIcon,
  PlugInIcon,
  TableIcon,
  UserCircleIcon,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";
import SidebarWidget from "./SidebarWidget";
import { LayoutDashboard, Users, Building2, Zap, BatteryCharging, Map, Brain, Truck, ShoppingBag, Handshake, FileText, Leaf } from "lucide-react";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

type MenuSection = {
  title: string;
  items: NavItem[];
};

const menuMap: Record<string, MenuSection[]> = {
  admin: [
    { title: "Utama", items: [{ name: "Overview", icon: <LayoutDashboard size={20} />, path: "/admin" }, { name: "Priority Map", icon: <Map size={20} />, path: "/admin/map" }] },
    { title: "Manajemen Utama", items: [{ name: "UMKM", icon: <Building2 size={20} />, path: "/admin/businesses" }, { name: "Energy Sources", icon: <Zap size={20} />, path: "/admin/energy-sources" }, { name: "Energy Needs", icon: <BatteryCharging size={20} />, path: "/admin/energy-needs" }] },
    { title: "Distribusi & AI", items: [{ name: "Recommendations", icon: <Brain size={20} />, path: "/admin/recommendations" }, { name: "Distributions", icon: <Truck size={20} />, path: "/admin/distributions" }] },
    { title: "Kemitraan & Pasar", items: [{ name: "Products", icon: <ShoppingBag size={20} />, path: "/admin/products" }, { name: "Partnerships", icon: <Handshake size={20} />, path: "/admin/partnerships" }] },
    { title: "Laporan & Sistem", items: [{ name: "Reports", icon: <FileText size={20} />, path: "/admin/reports" }, { name: "Users", icon: <Users size={20} />, path: "/admin/users" }] }
  ],
  umkm: [
    { title: "Utama", items: [{ name: "Overview", icon: <LayoutDashboard size={20} />, path: "/umkm" }, { name: "Business Profile", icon: <Building2 size={20} />, path: "/umkm/business" }] },
    { title: "Kebutuhan & Bantuan", items: [{ name: "Energy Needs", icon: <BatteryCharging size={20} />, path: "/umkm/energy-needs" }, { name: "Recommendations", icon: <Brain size={20} />, path: "/umkm/recommendations" }] },
    { title: "Bisnis & Mitra", items: [{ name: "Products", icon: <ShoppingBag size={20} />, path: "/umkm/products" }, { name: "Partnerships", icon: <Handshake size={20} />, path: "/umkm/partnerships" }] }
  ],
  government: [
    { title: "Utama", items: [{ name: "Overview", icon: <LayoutDashboard size={20} />, path: "/government" }, { name: "Priority Map", icon: <Map size={20} />, path: "/government/map" }] },
    { title: "Pemantauan", items: [{ name: "Businesses", icon: <Building2 size={20} />, path: "/government/businesses" }, { name: "Energy Sources", icon: <Zap size={20} />, path: "/government/energy-sources" }] },
    { title: "Analisis & Laporan", items: [{ name: "Recommendations", icon: <Brain size={20} />, path: "/government/recommendations" }, { name: "Impact Reports", icon: <FileText size={20} />, path: "/government/reports" }] }
  ],
  provider: [
    { title: "Utama", items: [{ name: "Overview", icon: <LayoutDashboard size={20} />, path: "/provider" }, { name: "Businesses", icon: <Building2 size={20} />, path: "/provider/businesses" }] },
    { title: "Manajemen Energi", items: [{ name: "Energy Sources", icon: <Zap size={20} />, path: "/provider/energy-sources" }, { name: "Recommendations", icon: <Brain size={20} />, path: "/provider/recommendations" }, { name: "Distributions", icon: <Truck size={20} />, path: "/provider/distributions" }] },
    { title: "Kemitraan", items: [{ name: "Partnerships", icon: <Handshake size={20} />, path: "/provider/partnerships" }] }
  ],
  partner: [
    { title: "Utama", items: [{ name: "Overview", icon: <LayoutDashboard size={20} />, path: "/partner" }, { name: "Opportunities", icon: <Building2 size={20} />, path: "/partner/businesses" }] },
    { title: "Energi Bersih", items: [{ name: "Energy Sources", icon: <Zap size={20} />, path: "/partner/energy-sources" }, { name: "Recommendations", icon: <Brain size={20} />, path: "/partner/recommendations" }] },
    { title: "Bisnis", items: [{ name: "Marketplace", icon: <ShoppingBag size={20} />, path: "/partner/marketplace" }, { name: "Partnerships", icon: <Handshake size={20} />, path: "/partner/partnerships" }] }
  ]
};

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const { userRole } = useAuth();
  const role = userRole || "umkm";
  const menuGroups = menuMap[role] || [];

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => location.pathname === path || (path !== `/${role}` && location.pathname.startsWith(path)),
    [location.pathname, role]
  );

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-2">
      {items.map((nav, index) => {
        const active = nav.path ? isActive(nav.path) : false;
        return (
          <li key={nav.name}>
            {nav.path && (
              <Link
                to={nav.path}
                className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 font-medium transition-colors duration-200
                  ${active 
                    ? "bg-emerald-50 text-emerald-700 dark:bg-white/10 dark:text-white" 
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white"
                  }
                  ${!isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"}
                `}
              >
                <span
                  className={`w-5 h-5 flex items-center justify-center transition-colors
                    ${active 
                      ? "text-emerald-600 dark:text-white" 
                      : "text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"
                    }
                  `}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="truncate">{nav.name}</span>
                )}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center"><Leaf size={22} className="text-white" /></div>
          {(isExpanded || isHovered || isMobileOpen) && (
            <div>
              <span className="text-lg font-bold tracking-tight text-emerald-500">EnergEco</span>
              <span className="text-[10px] text-slate-400 block -mt-1 uppercase tracking-widest">GlobalChain</span>
            </div>
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            {menuGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                <h2
                  className={`mb-4 text-xs font-semibold uppercase flex leading-[20px] text-gray-400 dark:text-gray-500 ${
                    !isExpanded && !isHovered
                      ? "lg:justify-center"
                      : "justify-start"
                  }`}
                >
                  {isExpanded || isHovered || isMobileOpen ? (
                    group.title
                  ) : (
                    <HorizontaLDots className="w-5 h-5" />
                  )}
                </h2>
                {renderMenuItems(group.items, "main")}
              </div>
            ))}
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
