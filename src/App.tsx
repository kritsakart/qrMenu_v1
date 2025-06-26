import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useState } from "react";

// Pages
import LoginPage from "@/pages/auth/LoginPage";
import SuperAdminDashboard from "@/pages/super-admin/Dashboard";
import CafeOwnersList from "@/pages/super-admin/CafeOwnersList";
import CafeAdminDashboard from "@/pages/cafe-admin/Dashboard";
import LocationsManagement from "@/pages/cafe-admin/LocationsManagement";
import TablesManagement from "@/pages/cafe-admin/TablesManagement";
import MenuBuilder from "@/pages/cafe-admin/MenuBuilder";
import OrdersDashboard from "@/pages/cafe-admin/OrdersDashboard";
import BrandingPage from "@/pages/public/BrandingPage";
import MenuPage from "@/pages/public/MenuPage";
import MenuPageAdmin from "@/pages/cafe-admin/MenuPage";
import NotFound from "@/pages/NotFound";
import CafeOwnersTable from "@/pages/CafeOwnersTable";

const App = () => {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 0,
        gcTime: 0,
        refetchOnWindowFocus: false,
        retry: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />
              
              {/* QR Code routes with two parameters (for existing QR codes) */}
              <Route path="/:locationShortId/:tableShortId" element={<BrandingPage />} />
              <Route path="/menu/:locationShortId/:tableShortId" element={<MenuPage />} />
              
              {/* Single parameter routes (for new format) */}
              <Route path="/branding/:shortId" element={<BrandingPage />} />
              <Route path="/menu/:shortId" element={<MenuPage />} />
              
              {/* Admin routes */}
              <Route path="/admin/menu/:locationId" element={<MenuPageAdmin />} />
              
              {/* Protected routes */}
              <Route 
                path="/super-admin" 
                element={
                  <ProtectedRoute allowedRoles={["super_admin"]}>
                    <SuperAdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/super-admin/cafe-owners" 
                element={
                  <ProtectedRoute allowedRoles={["super_admin"]}>
                    <CafeOwnersList />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/cafe-admin" 
                element={
                  <ProtectedRoute allowedRoles={["cafe_owner"]}>
                    <CafeAdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/cafe-admin/locations" 
                element={
                  <ProtectedRoute allowedRoles={["cafe_owner"]}>
                    <LocationsManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/cafe-admin/tables" 
                element={
                  <ProtectedRoute allowedRoles={["cafe_owner"]}>
                    <TablesManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/cafe-admin/menu-builder" 
                element={
                  <ProtectedRoute allowedRoles={["cafe_owner"]}>
                    <MenuBuilder />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/cafe-admin/orders" 
                element={
                  <ProtectedRoute allowedRoles={["cafe_owner"]}>
                    <OrdersDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Default redirect */}
              <Route path="/" element={<LoginPage />} />
              <Route path="/cafe-owners" element={<CafeOwnersTable />} />
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
