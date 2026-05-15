import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { Toaster } from "sonner";

// Layouts
import DashboardLayout from "@/layouts/DashboardLayout";

// Public
import LandingPage from "@/pages/public/LandingPage";
import MarketplacePage from "@/pages/public/MarketplacePage";

// Auth
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";

// Dashboard Overviews
import AdminOverview from "@/pages/admin/AdminOverview";
import UmkmOverview from "@/pages/umkm/UmkmOverview";
import GovernmentOverview from "@/pages/government/GovernmentOverview";
import ProviderOverview from "@/pages/provider/ProviderOverview";
import PartnerOverview from "@/pages/partner/PartnerOverview";

// Admin Pages
import UserManagement from "@/pages/admin/UserManagement";
import BusinessList from "@/pages/admin/BusinessList";
import EnergySourceList from "@/pages/admin/EnergySourceList";
import RecommendationList from "@/pages/admin/RecommendationList";

// UMKM Pages
import BusinessProfile from "@/pages/umkm/BusinessProfile";

// Shared Pages
import EnergyNeedsPage from "@/pages/shared/EnergyNeedsPage";
import DistributionList from "@/pages/shared/DistributionList";
import PartnershipList from "@/pages/shared/PartnershipList";

// Shared
import ComingSoon from "@/pages/ComingSoon";
import ProtectedRoute from "@/routes/ProtectedRoute";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30000 } },
});

function RoleRedirect() {
  const { userRole, isLoading } = useAuth();
  if (isLoading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500" /></div>;
  if (!userRole) return <Navigate to="/login" replace />;
  return <Navigate to={`/${userRole}`} replace />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Toaster position="top-right" theme="dark" richColors />
          <Routes>
            {/* Public */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<RoleRedirect />} />

            {/* Admin */}
            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route element={<DashboardLayout />}>
                <Route path="/admin" element={<AdminOverview />} />
                <Route path="/admin/users" element={<UserManagement />} />
                <Route path="/admin/businesses" element={<BusinessList />} />
                <Route path="/admin/energy-sources" element={<EnergySourceList />} />
                <Route path="/admin/energy-needs" element={<EnergyNeedsPage />} />
                <Route path="/admin/recommendations" element={<RecommendationList />} />
                <Route path="/admin/distributions" element={<DistributionList />} />
                <Route path="/admin/products" element={<ComingSoon title="Products" />} />
                <Route path="/admin/partnerships" element={<PartnershipList />} />
                <Route path="/admin/reports" element={<ComingSoon title="Reports" />} />
              </Route>
            </Route>

            {/* UMKM */}
            <Route element={<ProtectedRoute allowedRoles={["umkm"]} />}>
              <Route element={<DashboardLayout />}>
                <Route path="/umkm" element={<UmkmOverview />} />
                <Route path="/umkm/business" element={<BusinessProfile />} />
                <Route path="/umkm/energy-needs" element={<EnergyNeedsPage />} />
                <Route path="/umkm/recommendations" element={<ComingSoon title="Recommendations" />} />
                <Route path="/umkm/products" element={<ComingSoon title="Products" />} />
                <Route path="/umkm/partnerships" element={<PartnershipList />} />
              </Route>
            </Route>

            {/* Government */}
            <Route element={<ProtectedRoute allowedRoles={["government"]} />}>
              <Route element={<DashboardLayout />}>
                <Route path="/government" element={<GovernmentOverview />} />
                <Route path="/government/map" element={<ComingSoon title="Priority Map" />} />
                <Route path="/government/businesses" element={<BusinessList />} />
                <Route path="/government/energy-sources" element={<EnergySourceList />} />
                <Route path="/government/recommendations" element={<RecommendationList />} />
                <Route path="/government/reports" element={<ComingSoon title="Impact Reports" />} />
              </Route>
            </Route>

            {/* Provider */}
            <Route element={<ProtectedRoute allowedRoles={["provider"]} />}>
              <Route element={<DashboardLayout />}>
                <Route path="/provider" element={<ProviderOverview />} />
                <Route path="/provider/energy-sources" element={<EnergySourceList />} />
                <Route path="/provider/distributions" element={<DistributionList />} />
              </Route>
            </Route>

            {/* Partner */}
            <Route element={<ProtectedRoute allowedRoles={["partner"]} />}>
              <Route element={<DashboardLayout />}>
                <Route path="/partner" element={<PartnerOverview />} />
                <Route path="/partner/businesses" element={<BusinessList />} />
                <Route path="/partner/marketplace" element={<ComingSoon title="Marketplace" />} />
                <Route path="/partner/partnerships" element={<PartnershipList />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
