import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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

  // Ensuring Supabase auth state change listener is properly configured
  useEffect(() => {
    console.log("🚀 Setting up Supabase auth state listener in App.tsx");
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("🔄 App.tsx - Supabase auth state changed:", event, session?.user?.id || 'no session');
        
        // Не втручаємося в логіку, просто логуємо для діагностики
        // Вся логіка обробки сесій повинна бути в useAuthState
        if (event === 'SIGNED_OUT') {
          console.log("🚪 User signed out in App.tsx");
        } else if (event === 'SIGNED_IN') {
          console.log("🔑 User signed in in App.tsx");
        } else if (event === 'TOKEN_REFRESHED') {
          console.log("🔄 Token refreshed in App.tsx");
        } else if (event === 'INITIAL_SESSION') {
          console.log("🎯 Initial session loaded in App.tsx");
        }
      }
    );

    return () => {
      console.log("🧹 Cleaning up Supabase auth listener in App.tsx");
      subscription.unsubscribe();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/branding/:shortId" element={<BrandingPage />} />
              <Route path="/menu/:shortId" element={<MenuPage />} />
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
