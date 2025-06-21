import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Table, Location } from "@/types/models";
import { supabaseAdmin } from "@/integrations/supabase/admin-client";
import { nanoid } from "nanoid";

export const useTablesManagement = (locationId: string) => {
  const [tables, setTables] = useState<Table[]>([]);
  const [location, setLocation] = useState<Location | null>(null);
  const [newTable, setNewTable] = useState({ name: "" });
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewQRDialogOpen, setIsViewQRDialogOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (locationId) {
      fetchLocationData();
      fetchTables();
    }
  }, [locationId]);

  const fetchLocationData = async () => {
    try {
      if (!locationId) return;
      
      const { data, error } = await supabaseAdmin
        .from('locations')
        .select('*')
        .eq('id', locationId)
        .single();
        
      if (error) {
        console.error("Error fetching location:", error);
        throw error;
      }
      
      if (data) {
        setLocation({
          id: data.id,
          cafeId: data.cafe_id,
          name: data.name,
          address: data.address,
          shortId: data.short_id || undefined, // Fallback to undefined if short_id doesn't exist
          createdAt: data.created_at
        });
      }
    } catch (error) {
      console.error("Error fetching location details:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch location details."
      });
    }
  };

  const fetchTables = async () => {
    try {
      if (!locationId) return;
      
      setIsLoading(true);
      
      const { data, error } = await supabaseAdmin
        .from('tables')
        .select('*')
        .eq('location_id', locationId);
        
      if (error) {
        console.error("Error fetching tables:", error);
        throw error;
      }
      
      if (data) {
        setTables(data.map(table => ({
          id: table.id,
          locationId: table.location_id,
          name: table.name,
          qrCode: table.qr_code,
          qrCodeUrl: table.qr_code_url,
          shortId: table.short_id || undefined, // Fallback to undefined if short_id doesn't exist
          createdAt: table.created_at
        })));
      }
    } catch (error) {
      console.error("Error fetching tables:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch tables."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTable = async (tableName: string) => {
    if (!locationId) return;
    
    try {
      console.log("🔧 Location ID:", locationId);
      console.log("🔧 Table name:", tableName);
      
      // Check if short_id columns exist by trying to get location data
      let qrCodeUrl = `/menu/${locationId}`; // fallback URL with location ID only
      let shortId = null;
      
      try {
        const { data: locationData, error: locationError } = await supabaseAdmin
          .from('locations')
          .select('short_id')
          .eq('id', locationId)
          .single();
          
        if (!locationError && locationData && locationData.short_id) {
          // If short_id exists, use it
          shortId = nanoid(6);
          qrCodeUrl = `/menu/${locationData.short_id}/${shortId}`;
          console.log("🔧 Using short IDs - Location short ID:", locationData.short_id, "Table short ID:", shortId);
        } else {
          console.log("🔧 Short IDs not available, using full UUIDs");
        }
      } catch (shortIdError) {
        console.log("🔧 Short ID columns don't exist yet, using fallback URL");
      }
      
      const insertData: any = {
        location_id: locationId,
        name: tableName,
        qr_code: `table-${Date.now()}`, // Use timestamp for QR code reference
        qr_code_url: qrCodeUrl
      };
      
      // Only add short_id if we have it
      if (shortId) {
        insertData.short_id = shortId;
      }
      
      // Let Supabase generate the UUID automatically
      const { data, error } = await supabaseAdmin
        .from('tables')
        .insert(insertData)
        .select()
        .single();
        
      if (error) {
        console.error("❌ Error adding table:", error);
        throw error;
      }
      
      if (data) {
        // Update QR code URL to include the actual table ID
        let finalQrCodeUrl = data.qr_code_url;
        
        if (shortId && data.short_id) {
          // Short ID already included in URL
          finalQrCodeUrl = data.qr_code_url;
        } else {
          // Add table ID to URL for full UUID version
          finalQrCodeUrl = `/menu/${locationId}/${data.id}`;
        }
        
        // Update the table record with the correct QR code URL
        if (finalQrCodeUrl !== data.qr_code_url) {
          await supabaseAdmin
            .from('tables')
            .update({ qr_code_url: finalQrCodeUrl })
            .eq('id', data.id);
        }
        
        console.log("✅ Table created successfully:", {
          tableId: data.id,
          locationId: data.location_id,
          qrCodeUrl: finalQrCodeUrl,
          fullUrl: `${window.location.origin}${finalQrCodeUrl}`
        });
        
        const newTableData: Table = {
          id: data.id,
          locationId: data.location_id,
          name: data.name,
          qrCode: data.qr_code,
          qrCodeUrl: finalQrCodeUrl,
          shortId: data.short_id || undefined, // Fallback to undefined if short_id doesn't exist
          createdAt: data.created_at
        };
        
        setTables([...tables, newTableData]);
        setIsAddDialogOpen(false);
        setNewTable({ name: "" });
        
        toast({
          title: "Стіл додано",
          description: `Стіл "${tableName}" успішно додано.`,
        });
      }
    } catch (error) {
      console.error("Error adding table:", error);
      toast({
        variant: "destructive",
        title: "Помилка",
        description: "Не вдалося додати стіл. Спробуйте ще раз."
      });
    }
  };

  const handleEditTable = async () => {
    if (!editingTable) return;
    
    try {
      const { error } = await supabaseAdmin
        .from('tables')
        .update({
          name: editingTable.name
        })
        .eq('id', editingTable.id);
        
      if (error) {
        console.error("Error updating table:", error);
        throw error;
      }
      
      setTables(
        tables.map((table) =>
          table.id === editingTable.id ? editingTable : table
        )
      );
      
      setIsEditDialogOpen(false);
      setEditingTable(null);
      
      toast({
        title: "Стіл оновлено",
        description: `Стіл "${editingTable.name}" успішно оновлено.`,
      });
    } catch (error) {
      console.error("Error updating table:", error);
      toast({
        variant: "destructive",
        title: "Помилка",
        description: "Не вдалося оновити стіл. Спробуйте ще раз."
      });
    }
  };

  const handleDeleteTable = async () => {
    if (!editingTable) return;
    
    try {
      const { error } = await supabaseAdmin
        .from('tables')
        .delete()
        .eq('id', editingTable.id);
        
      if (error) {
        console.error("Error deleting table:", error);
        throw error;
      }
      
      setTables(tables.filter((table) => table.id !== editingTable.id));
      setIsDeleteDialogOpen(false);
      setEditingTable(null);
      
      toast({
        title: "Стіл видалено",
        description: `Стіл "${editingTable.name}" успішно видалено.`,
      });
    } catch (error) {
      console.error("Error deleting table:", error);
      toast({
        variant: "destructive",
        title: "Помилка",
        description: "Не вдалося видалити стіл. Спробуйте ще раз."
      });
    }
  };

  const openEditDialog = (table: Table) => {
    setEditingTable(table);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (table: Table) => {
    setEditingTable(table);
    setIsDeleteDialogOpen(true);
  };

  const viewQRCode = (table: Table) => {
    setSelectedTable(table);
    setIsViewQRDialogOpen(true);
  };

  return {
    tables,
    location,
    newTable,
    editingTable,
    selectedTable,
    isLoading,
    isAddDialogOpen,
    isEditDialogOpen,
    isDeleteDialogOpen,
    isViewQRDialogOpen,
    setNewTable,
    setEditingTable,
    setIsAddDialogOpen,
    setIsEditDialogOpen,
    setIsDeleteDialogOpen,
    setIsViewQRDialogOpen,
    handleAddTable,
    handleEditTable,
    handleDeleteTable,
    openEditDialog,
    openDeleteDialog,
    viewQRCode,
  };
};
