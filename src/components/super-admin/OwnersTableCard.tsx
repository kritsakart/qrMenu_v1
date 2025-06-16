
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";
import { RecentOwnersTable } from "@/components/super-admin/RecentOwnersTable";
import { CafeOwner } from "@/types/models";

interface OwnersTableCardProps {
  owners: CafeOwner[];
  isLoading: boolean;
  error: Error | null;
  onRefresh: () => void;
}

export const OwnersTableCard = ({ 
  owners, 
  isLoading, 
  error, 
  onRefresh 
}: OwnersTableCardProps) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <CardTitle>Recent Café Owners</CardTitle>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate("/super-admin/cafe-owners")}
        >
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end mb-4">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={onRefresh}
            disabled={isLoading}
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            {isLoading ? "Оновлення..." : "Оновити дані"}
          </Button>
        </div>
        
        <RecentOwnersTable 
          owners={owners}
          isLoading={isLoading}
          error={error}
        />
      </CardContent>
    </Card>
  );
};
