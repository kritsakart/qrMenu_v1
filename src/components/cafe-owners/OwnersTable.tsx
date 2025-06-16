
import { useToast } from "@/components/ui/use-toast";
import { CafeOwner } from "@/types/models";
import { supabaseAdmin } from "@/integrations/supabase/admin-client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OwnerTableRow } from "./OwnerTableRow";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle, Database } from "lucide-react";
import { useState } from "react";

interface OwnersTableProps {
  owners: CafeOwner[];
  isLoading: boolean;
  error: Error | null;
  onStatusChange: () => void;
  onDeleteOwner: (id: string) => Promise<void>;
}

export const OwnersTable = ({ owners, isLoading, error, onStatusChange, onDeleteOwner }: OwnersTableProps) => {
  const { toast } = useToast();
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);

  const toggleOwnerStatus = async (id: string, currentStatus: string) => {
    try {
      setStatusUpdateLoading(true);
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      
      console.log(`Updating owner ${id} status to ${newStatus}`);
      
      const { error: updateError } = await supabaseAdmin
        .from("cafe_owners")
        .update({ status: newStatus })
        .eq("id", id);
      
      if (updateError) {
        throw new Error(updateError.message);
      }
      
      toast({
        title: "Статус оновлено",
        description: `Новий статус: ${newStatus === "active" ? "активний" : "неактивний"}`,
      });
      
      onStatusChange();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Невідома помилка';
      console.error("Error updating cafe owner status:", errorMessage);
      toast({
        variant: "destructive",
        title: "Помилка",
        description: `Не вдалося оновити статус: ${errorMessage}`
      });
      throw error;
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  const EmptyState = () => (
    <TableRow>
      <TableCell colSpan={6} className="text-center py-16">
        <div className="flex flex-col items-center gap-4">
          <div className="bg-gray-100 p-4 rounded-full">
            <Database className="h-10 w-10 text-gray-400" />
          </div>
          <div>
            <p className="text-lg font-medium text-gray-600">Немає зареєстрованих власників кафе</p>
            <p className="text-sm text-gray-400 max-w-md mx-auto mt-2">
              Додайте власників кафе, використовуючи кнопку "Додати власника" вгорі сторінки
            </p>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-gray-500">Завантаження списку власників кафе...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center py-12 text-center">
        <div className="bg-red-100 p-4 rounded-full mb-4">
          <AlertCircle className="h-10 w-10 text-red-500" />
        </div>
        <p className="text-lg font-medium text-red-600">Помилка завантаження даних</p>
        <p className="text-sm text-gray-600 max-w-md mx-auto mt-2 mb-4">{error.message}</p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onStatusChange}
          className="flex items-center gap-1"
        >
          <RefreshCw size={16} />
          Спробувати знову
        </Button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-end mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onStatusChange}
          disabled={isLoading}
          className="flex items-center gap-1"
        >
          <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          {isLoading ? "Оновлення..." : "Оновити список"}
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Назва</TableHead>
            <TableHead>Логін</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead>Створено</TableHead>
            <TableHead className="text-right">Дії</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {owners.length > 0 ? (
            owners.map((owner) => (
              <OwnerTableRow 
                key={owner.id} 
                owner={owner} 
                onStatusChange={toggleOwnerStatus}
                onDeleteOwner={onDeleteOwner} 
              />
            ))
          ) : (
            <EmptyState />
          )}
        </TableBody>
      </Table>
    </div>
  );
};
