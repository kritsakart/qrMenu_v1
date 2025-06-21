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
import LocationBrandingDialog from "@/components/branding/LocationBrandingDialog";

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
  const [isBrandingDialogOpen, setIsBrandingDialogOpen] = useState(false);
  const [brandingLocation, setBrandingLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [deletingLocation, setDeletingLocation] = useState<Location | null>(null);

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
        shortId: loc.short_id || undefined,
        coverImage: loc.cover_image || undefined,
        logoImage: loc.logo_image || undefined,
        promoImages: (loc.promo_images as any) || [],
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
        shortId: data.short_id || undefined,
        createdAt: data.created_at
      }]);
      
      setIsAddDialogOpen(false);
      setNewLocation({ name: "", address: "" });
      
      toast({
        title: "Location added",
        description: `${newLocation.name} has been successfully added.`,
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
        title: "Location updated",
        description: `${editingLocation.name} has been successfully updated.`,
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
    if (!deletingLocation) return;
    
    try {
      const { error } = await supabaseAdmin
        .from('locations')
        .delete()
        .eq('id', deletingLocation.id);
        
      if (error) throw error;
      
      setLocations(locations.filter((location) => location.id !== deletingLocation.id));
      setIsDeleteDialogOpen(false);
      setDeletingLocation(null);
      
      toast({
        title: "Location deleted",
        description: `${deletingLocation.name} has been successfully deleted.`,
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
    setDeletingLocation(location);
    setIsDeleteDialogOpen(true);
  };

  const viewTables = (locationId: string) => {
    navigate(`/cafe-admin/tables/${locationId}`);
  };

  const openBrandingDialog = (location: Location) => {
    setBrandingLocation(location);
    setIsBrandingDialogOpen(true);
  };

  const handleLocationUpdate = (updatedLocation: Location) => {
    setLocations(locations.map(loc => 
      loc.id === updatedLocation.id ? updatedLocation : loc
    ));
  };

  return (
    <DashboardLayout title="Locations Management">
      <div className="mb-6 flex justify-between items-center">
        <p className="text-muted-foreground">
          Manage your cafe locations and their details.
        </p>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Location</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Location</DialogTitle>
              <DialogDescription>
                Create a new location for your cafe.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Location Name</Label>
                <Input
                  id="name"
                  value={newLocation.name}
                  onChange={(e) =>
                    setNewLocation({ ...newLocation, name: e.target.value })
                  }
                  placeholder="Enter location name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={newLocation.address}
                  onChange={(e) =>
                    setNewLocation({ ...newLocation, address: e.target.value })
                  }
                  placeholder="Enter location address"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddLocation}>Add Location</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cafe Locations</CardTitle>
          <CardDescription>
            List of all your cafe locations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <p>Loading locations...</p>
            </div>
          ) : locations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No locations found. Add the first location to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {locations.map((location) => {
                const tableCount = tables.find(t => t.locationId === location.id)?.count || 0;
                return (
                  <Card key={location.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{location.name}</h3>
                        <p className="text-muted-foreground">{location.address}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Tables: {tableCount} | Created: {new Date(location.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => viewTables(location.id)}
                        >
                          Tables
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => openBrandingDialog(location)}
                        >
                          Branding
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingLocation(location);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setDeletingLocation(location);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Location</DialogTitle>
            <DialogDescription>
              Update the details for this location.
            </DialogDescription>
          </DialogHeader>
          {editingLocation && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Location Name</Label>
                <Input
                  id="edit-name"
                  value={editingLocation.name}
                  onChange={(e) =>
                    setEditingLocation({ ...editingLocation, name: e.target.value })
                  }
                  placeholder="Enter location name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-address">Address</Label>
                <Input
                  id="edit-address"
                  value={editingLocation.address}
                  onChange={(e) =>
                    setEditingLocation({ ...editingLocation, address: e.target.value })
                  }
                  placeholder="Enter location address"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditLocation}>Update Location</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Location</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this location? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {deletingLocation && (
            <div className="py-4">
              <p>
                <strong>Location:</strong> {deletingLocation.name}
              </p>
              <p>
                <strong>Address:</strong> {deletingLocation.address}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteLocation}>
              Delete Location
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Branding Dialog */}
      <LocationBrandingDialog
        location={brandingLocation}
        isOpen={isBrandingDialogOpen}
        onClose={() => setIsBrandingDialogOpen(false)}
        onUpdate={handleLocationUpdate}
      />
    </DashboardLayout>
  );
};

export default LocationsManagement;
