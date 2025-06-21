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
import { generateQRCodesPDF, generateMultipleQRCodesSVG } from "@/utils/qrPdfGenerator";
import { useToast } from "@/hooks/use-toast";
import { Download, Loader2, FileImage } from "lucide-react";
import { useState } from "react";

const TablesManagement = () => {
  const { locationId } = useParams<{ locationId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isGeneratingAllPDF, setIsGeneratingAllPDF] = useState(false);
  const [isGeneratingAllSVG, setIsGeneratingAllSVG] = useState(false);
  
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

  const handleDownloadAllQRCodes = async () => {
    if (!location || tables.length === 0) {
      toast({
        variant: "destructive",
        title: "No Tables",
        description: "There are no tables to generate QR codes for.",
      });
      return;
    }
    
    setIsGeneratingAllPDF(true);
    try {
      await generateQRCodesPDF(tables, location.name);
      toast({
        title: "PDF Downloaded",
        description: `QR codes for ${location.name} have been downloaded successfully.`,
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        variant: "destructive",
        title: "Download Error",
        description: "Failed to generate PDF. Please try again.",
      });
    } finally {
      setIsGeneratingAllPDF(false);
    }
  };

  const handleDownloadAllQRCodesSVG = async () => {
    if (!location || tables.length === 0) {
      toast({
        variant: "destructive",
        title: "No Tables",
        description: "There are no tables to generate QR codes for.",
      });
      return;
    }
    
    setIsGeneratingAllSVG(true);
    try {
      await generateMultipleQRCodesSVG(tables, location.name);
      toast({
        title: "SVG ZIP Downloaded",
        description: `QR codes SVG files for ${location.name} have been downloaded as ZIP archive.`,
      });
    } catch (error) {
      console.error('Error generating SVG files:', error);
      toast({
        variant: "destructive",
        title: "Download Error",
        description: "Failed to generate SVG files. Please try again.",
      });
    } finally {
      setIsGeneratingAllSVG(false);
    }
  };

  return (
    <DashboardLayout title={`Tables for ${location?.name || "Location"}`}>
      <div className="mb-6 flex justify-between items-center">
        <p className="text-muted-foreground">
          Manage the tables for this location and generate QR codes.
        </p>
        <div className="flex gap-2">
          {tables.length > 0 && (
            <>
              <Button 
                variant="outline"
                onClick={handleDownloadAllQRCodes}
                disabled={isGeneratingAllPDF}
              >
                {isGeneratingAllPDF ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Download All PDF
                  </>
                )}
              </Button>
              <Button 
                variant="secondary"
                onClick={handleDownloadAllQRCodesSVG}
                disabled={isGeneratingAllSVG}
              >
                {isGeneratingAllSVG ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Generating SVG...
                  </>
                ) : (
                  <>
                    <FileImage className="w-4 h-4 mr-2" />
                    Download All SVG
                  </>
                )}
              </Button>
            </>
          )}
          <AddTableDialog 
            open={isAddDialogOpen}
            onOpenChange={setIsAddDialogOpen}
            onAddTable={handleAddTable}
          />
        </div>
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
        locationName={location?.name}
      />
    </DashboardLayout>
  );
};

export default TablesManagement;
