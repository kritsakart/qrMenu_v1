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

  // Ensuring Supabase auth state change listener is fully functional
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Supabase auth state changed: ", event, session);
        if (session) {
          console.log("Supabase auth state changed: session set, refreshing user data");
          // Ensure the session is set and user data is refreshed in AuthContext
          await supabase.auth.setSession(session);
          await supabase.auth.refreshSession(); // Оновити сесію, якщо потрібно
          await supabase.auth.getUser(); // Оновити дані користувача
        } else {
          console.log("Supabase auth state changed: session cleared");
          // Це має оброблятися в useAuthState через onAuthStateChange
          // Але для впевненості можна також очистити сесію тут, якщо необхідно
          // supabase.auth.signOut(); 
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/menu/:locationShortId/:tableShortId" element={<MenuPage />} />
              <Route path="/cafe-owners-table" element={<CafeOwnersTable />} />
              
              {/* Super Admin Routes */}
              <Route path="/super-admin" element={
                <ProtectedRoute allowedRoles={["super_admin"]}>
                  <SuperAdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/super-admin/cafe-owners" element={
                <ProtectedRoute allowedRoles={["super_admin"]}>
                  <CafeOwnersList />
                </ProtectedRoute>
              } />
              
              {/* Cafe Admin Routes */}
              <Route path="/cafe-admin" element={
                <ProtectedRoute allowedRoles={["cafe_owner"]}>
                  <CafeAdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/cafe-admin/locations" element={
                <ProtectedRoute allowedRoles={["cafe_owner"]}>
                  <LocationsManagement />
                </ProtectedRoute>
              } />
              <Route path="/cafe-admin/tables/:locationId" element={
                <ProtectedRoute allowedRoles={["cafe_owner"]}>
                  <TablesManagement />
                </ProtectedRoute>
              } />
              <Route path="/cafe-admin/menu" element={
                <ProtectedRoute allowedRoles={["cafe_owner"]}>
                  <MenuPageAdmin />
                </ProtectedRoute>
              } />
              <Route path="/cafe-admin/orders" element={
                <ProtectedRoute allowedRoles={["cafe_owner"]}>
                  <OrdersDashboard />
                </ProtectedRoute>
              } />
              
              {/* Redirect root to login */}
              <Route path="/" element={<LoginPage />} />
              
              {/* 404 Not Found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
