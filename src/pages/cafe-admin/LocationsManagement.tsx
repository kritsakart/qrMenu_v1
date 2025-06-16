import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Location } from "@/types/models";
import { supabase } from "@/integrations/supabase/client";
import { supabaseAdmin } from "@/integrations/supabase/admin-client";

const LocationsManagement = () => {
  const { user } = useAuth();
  const cafeId = user?.id || user?.cafeId || "";
  const [locations, setLocations] = useState<Location[]>([]);
  const [tables, setTables] = useState<{ locationId: string, count: number }[]>([]);
  const [newLocation, setNewLocation] = useState({ name: "", address: "" });
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (cafeId) {
      fetchLocations();
    }
  }, [cafeId]);

  const fetchLocations = async () => {
    try {
      setIsLoading(true);
      
      console.log("Fetching locations for cafe ID:", cafeId);
      
      // Use supabaseAdmin instead of supabase client to fetch locations
      // This bypasses RLS policies since we're authenticated as admin
      const { data: locationsData, error: locationsError } = await supabaseAdmin
        .from('locations')
        .select('*')
        .eq('cafe_id', cafeId);
        
      if (locationsError) {
        console.error("Error fetching locations:", locationsError);
        throw locationsError;
      }
      
      console.log("Fetched locations:", locationsData);
      
      // Отримуємо кількість столиків для кожної локації
      // Використовуємо підхід з окремими запитами для кожної локації замість групування
      const locationIds = locationsData?.map(loc => loc.id) || [];
      let tableCountsData: { locationId: string, count: number }[] = [];
      
      // Якщо є локації, отримуємо кількість столиків для кожної
      if (locationIds.length > 0) {
        // Для кожної локації окремо рахуємо кількість столиків
        const tablesCountPromises = locationIds.map(async (locationId) => {
          const { data, error } = await supabaseAdmin
            .from('tables')
            .select('id', { count: 'exact' })
            .eq('location_id', locationId);
            
          if (error) {
            console.error("Error fetching tables count:", error);
            throw error;
          }
          
          return {
            locationId,
            count: data?.length || 0
          };
        });
        
        tableCountsData = await Promise.all(tablesCountPromises);
      }
      
      setLocations(locationsData?.map(loc => ({
        id: loc.id,
        cafeId: loc.cafe_id,
        name: loc.name,
        address: loc.address,
        createdAt: loc.created_at
      })) || []);
      
      setTables(tableCountsData);
      
    } catch (error) {
      console.error("Помилка при завантаженні локацій:", error);
      toast({
        variant: "destructive",
        title: "Помилка завантаження",
        description: "Не вдалося завантажити дані локацій."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddLocation = async () => {
    try {
      // Verify we have a valid cafe ID
      if (!cafeId) {
        throw new Error("No cafe ID available. Please log in again.");
      }
      
      console.log("Adding new location with cafe ID:", cafeId);
      
      // Use supabaseAdmin to bypass RLS policies
      const { data, error } = await supabaseAdmin
        .from('locations')
        .insert({
          cafe_id: cafeId,
          name: newLocation.name,
          address: newLocation.address
        })
        .select()
        .single();
        
      if (error) {
        console.error("Error adding location:", error);
        throw error;
      }
      
      console.log("New location added:", data);
      
      setLocations([...locations, {
        id: data.id,
        cafeId: data.cafe_id,
        name: data.name,
        address: data.address,
        createdAt: data.created_at
      }]);
      
      setIsAddDialogOpen(false);
      setNewLocation({ name: "", address: "" });
      
      toast({
        title: "Локацію додано",
        description: `${newLocation.name} успішно додано.`,
      });
    } catch (error) {
      console.error("Помилка при додаванні локації:", error);
      toast({
        variant: "destructive",
        title: "Помилка",
        description: "Не вдалося додати локацію. Спробуйте ще раз."
      });
    }
  };

  const handleEditLocation = async () => {
    if (!editingLocation) return;
    
    try {
      const { error } = await supabaseAdmin
        .from('locations')
        .update({
          name: editingLocation.name,
          address: editingLocation.address
        })
        .eq('id', editingLocation.id);
        
      if (error) throw error;
      
      setLocations(
        locations.map((location) =>
          location.id === editingLocation.id ? editingLocation : location
        )
      );
      
      setIsEditDialogOpen(false);
      setEditingLocation(null);
      
      toast({
        title: "Локацію оновлено",
        description: `${editingLocation.name} успішно оновлено.`,
      });
    } catch (error) {
      console.error("Помилка при оновленні локації:", error);
      toast({
        variant: "destructive",
        title: "Помилка",
        description: "Не вдалося оновити локацію. Спробуйте ще раз."
      });
    }
  };

  const handleDeleteLocation = async () => {
    if (!editingLocation) return;
    
    try {
      const { error } = await supabaseAdmin
        .from('locations')
        .delete()
        .eq('id', editingLocation.id);
        
      if (error) throw error;
      
      setLocations(locations.filter((location) => location.id !== editingLocation.id));
      setIsDeleteDialogOpen(false);
      setEditingLocation(null);
      
      toast({
        title: "Локацію видалено",
        description: `${editingLocation.name} успішно видалено.`,
      });
    } catch (error) {
      console.error("Помилка при видаленні локації:", error);
      toast({
        variant: "destructive",
        title: "Помилка",
        description: "Не вдалося видалити локацію. Можливо, вона містить столики або замовлення."
      });
    }
  };

  const openEditDialog = (location: Location) => {
    setEditingLocation(location);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (location: Location) => {
    setEditingLocation(location);
    setIsDeleteDialogOpen(true);
  };

  const viewTables = (locationId: string) => {
    navigate(`/cafe-admin/tables/${locationId}`);
  };

  return (
    <DashboardLayout title="Управління локаціями">
      <div className="mb-6 flex justify-between items-center">
        <p className="text-muted-foreground">
          Управляйте локаціями вашого кафе та їх деталями.
        </p>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Додати локацію</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Додати нову локацію</DialogTitle>
              <DialogDescription>
                Створіть нову локацію для вашого кафе.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Назва локації</Label>
                <Input
                  id="name"
                  value={newLocation.name}
                  onChange={(e) =>
                    setNewLocation({ ...newLocation, name: e.target.value })
                  }
                  placeholder="Введіть назву локації"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Адреса</Label>
                <Input
                  id="address"
                  value={newLocation.address}
                  onChange={(e) =>
                    setNewLocation({ ...newLocation, address: e.target.value })
                  }
                  placeholder="Введіть адресу локації"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Скасувати
              </Button>
              <Button onClick={handleAddLocation}>Додати локацію</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Локації кафе</CardTitle>
          <CardDescription>
            Список всіх локацій вашого кафе.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <p>Завантаження локацій...</p>
            </div>
          ) : locations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Немає локацій. Додайте першу локацію, щоб почати.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Назва
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Адреса
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Столики
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Створено
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Дії
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {locations.map((location) => {
                    const tableCount = tables.find(t => t.locationId === location.id)?.count || 0;
                    
                    return (
                      <tr key={location.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {location.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {location.address}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {tableCount} столиків
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(location.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => viewTables(location.id)}
                          >
                            Столики
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(location)}
                          >
                            Редагувати
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => openDeleteDialog(location)}
                          >
                            Видалити
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Location Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редагувати локацію</DialogTitle>
            <DialogDescription>
              Оновіть деталі цієї локації.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Назва локації</Label>
              <Input
                id="edit-name"
                value={editingLocation?.name || ""}
                onChange={(e) =>
                  setEditingLocation(
                    editingLocation
                      ? { ...editingLocation, name: e.target.value }
                      : null
                  )
                }
                placeholder="Введіть назву локації"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-address">Адреса</Label>
              <Input
                id="edit-address"
                value={editingLocation?.address || ""}
                onChange={(e) =>
                  setEditingLocation(
                    editingLocation
                      ? { ...editingLocation, address: e.target.value }
                      : null
                  )
                }
                placeholder="Введіть адресу локації"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Скасувати
            </Button>
            <Button onClick={handleEditLocation}>Оновити локацію</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Location Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Видалити локацію</DialogTitle>
            <DialogDescription>
              Ви впевнені, що хочете видалити цю локацію? Це дія незворотна.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p>
              <strong>Локація:</strong> {editingLocation?.name}
            </p>
            <p>
              <strong>Адреса:</strong> {editingLocation?.address}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Скасувати
            </Button>
            <Button variant="destructive" onClick={handleDeleteLocation}>
              Видалити локацію
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default LocationsManagement;
