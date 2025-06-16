
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useCafeOwners } from "@/hooks/useCafeOwners";
import { DashboardStatistics } from "@/components/super-admin/DashboardStatistics";
import { OwnersTableCard } from "@/components/super-admin/OwnersTableCard";

const SuperAdminDashboard = () => {
  const { owners, isLoading, error, fetchCafeOwners } = useCafeOwners();
  
  return (
    <DashboardLayout title="Super Admin Dashboard">
      <div className="mb-4 flex justify-end">
        {/* Refresh button has been moved to OwnersTableCard */}
      </div>
      
      <DashboardStatistics owners={owners} />

      <div className="mt-8">
        <OwnersTableCard 
          owners={owners}
          isLoading={isLoading}
          error={error}
          onRefresh={fetchCafeOwners}
        />
      </div>
    </DashboardLayout>
  );
};

export default SuperAdminDashboard;
