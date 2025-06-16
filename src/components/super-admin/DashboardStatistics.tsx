
import { StatisticsCard } from "@/components/super-admin/StatisticsCard";
import { CafeOwner } from "@/types/models";

interface DashboardStatisticsProps {
  owners: CafeOwner[];
}

export const DashboardStatistics = ({ owners }: DashboardStatisticsProps) => {
  // Calculate stats
  const activeOwners = owners.filter(owner => owner.status === "active").length;
  const inactiveOwners = owners.length - activeOwners;
  
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <StatisticsCard
        title="Total Café Owners"
        value={owners.length}
        description="Registered café owners"
      />
      
      <StatisticsCard
        title="Active Owners"
        value={activeOwners}
        valueClassName="text-3xl font-bold text-green-600"
        description="Active café accounts"
      />
      
      <StatisticsCard
        title="Inactive Owners"
        value={inactiveOwners}
        valueClassName="text-3xl font-bold text-amber-600"
        description="Inactive café accounts"
      />
    </div>
  );
};
