
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { AddOwnerDialog } from "@/components/cafe-owners/AddOwnerDialog";
import { OwnersTable } from "@/components/cafe-owners/OwnersTable";
import { useCafeOwners } from "@/hooks/useCafeOwners";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const CafeOwnersList = () => {
  const { owners, isLoading, error, fetchCafeOwners, deleteOwner } = useCafeOwners();

  return (
    <DashboardLayout title="Власники кафе">
      <div className="mb-6 flex justify-between items-center">
        <p className="text-muted-foreground">
          Управляйте акаунтами власників кафе та їхнім доступом до платформи.
        </p>
        <AddOwnerDialog onOwnerAdded={fetchCafeOwners} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Власники кафе</CardTitle>
          <CardDescription>
            Список всіх власників кафе, зареєстрованих на платформі.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OwnersTable 
            owners={owners} 
            isLoading={isLoading} 
            error={error}
            onStatusChange={fetchCafeOwners} 
            onDeleteOwner={deleteOwner}
          />
        </CardContent>
        {!isLoading && owners.length === 0 && !error && (
          <CardFooter className="border-t px-6 py-4">
            <p className="text-sm text-muted-foreground">
              Щоб додати нового власника кафе, натисніть кнопку "Додати власника" вгорі сторінки.
            </p>
          </CardFooter>
        )}
      </Card>
    </DashboardLayout>
  );
};

export default CafeOwnersList;
