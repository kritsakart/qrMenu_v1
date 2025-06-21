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
      // Generate a unique table ID first
      const tempId = nanoid();
      const qrCodeUrl = `/menu/${locationId}/${tempId}`;
      
      console.log("🔧 Creating table with URL:", qrCodeUrl);
      console.log("🔧 Location ID:", locationId);
      console.log("🔧 Table name:", tableName);
      
      const { data, error } = await supabaseAdmin
        .from('tables')
        .insert({
          id: tempId,
          location_id: locationId,
          name: tableName,
          qr_code: `table-${tempId}`,
          qr_code_url: qrCodeUrl
        })
        .select()
        .single();
        
      if (error) {
        console.error("❌ Error adding table:", error);
        throw error;
      }
      
      if (data) {
        console.log("✅ Table created successfully:", {
          tableId: data.id,
          locationId: data.location_id,
          qrCodeUrl: data.qr_code_url,
          fullUrl: `${window.location.origin}${data.qr_code_url}`
        });
        
        const newTableData: Table = {
          id: data.id,
          locationId: data.location_id,
          name: data.name,
          qrCode: data.qr_code,
          qrCodeUrl: data.qr_code_url,
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
