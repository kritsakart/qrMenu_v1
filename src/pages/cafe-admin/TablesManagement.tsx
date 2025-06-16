
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TableCard } from "@/components/tables/TableCard";
import { AddTableDialog } from "@/components/tables/AddTableDialog";
import { EditTableDialog } from "@/components/tables/EditTableDialog";
import { DeleteTableDialog } from "@/components/tables/DeleteTableDialog";
import { ViewQRDialog } from "@/components/tables/ViewQRDialog";
import { useTablesManagement } from "@/hooks/tables/useTablesManagement";

const TablesManagement = () => {
  const { locationId } = useParams<{ locationId: string }>();
  const { user } = useAuth();
  const {
    tables,
    location,
    editingTable,
    selectedTable,
    isLoading,
    isAddDialogOpen,
    isEditDialogOpen,
    isDeleteDialogOpen,
    isViewQRDialogOpen,
    setIsAddDialogOpen,
    setIsEditDialogOpen,
    setIsDeleteDialogOpen,
    setIsViewQRDialogOpen,
    setEditingTable,
    handleAddTable,
    handleEditTable,
    handleDeleteTable,
    openEditDialog,
    openDeleteDialog,
    viewQRCode,
  } = useTablesManagement(locationId || "");

  return (
    <DashboardLayout title={`Tables for ${location?.name || "Location"}`}>
      <div className="mb-6 flex justify-between items-center">
        <p className="text-muted-foreground">
          Manage the tables for this location and generate QR codes.
        </p>
        <AddTableDialog 
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onAddTable={handleAddTable}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tables at {location?.name}</CardTitle>
          <CardDescription>
            {location?.address}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tables.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No tables yet. Add your first table to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tables.map((table) => (
                <TableCard 
                  key={table.id}
                  table={table}
                  onEdit={openEditDialog}
                  onDelete={openDeleteDialog}
                  onViewQR={viewQRCode}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Table Dialog */}
      <EditTableDialog 
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        editingTable={editingTable}
        onUpdateTable={handleEditTable}
        onEditingTableChange={setEditingTable}
      />

      {/* Delete Table Dialog */}
      <DeleteTableDialog 
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        editingTable={editingTable}
        onDeleteTable={handleDeleteTable}
      />

      {/* View QR Code Dialog */}
      <ViewQRDialog 
        open={isViewQRDialogOpen}
        onOpenChange={setIsViewQRDialogOpen}
        selectedTable={selectedTable}
      />
    </DashboardLayout>
  );
};

export default TablesManagement;
