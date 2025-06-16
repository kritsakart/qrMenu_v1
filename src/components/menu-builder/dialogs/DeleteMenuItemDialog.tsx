
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MenuItem } from "@/types/models";

interface DeleteMenuItemDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleteMenuItem: () => Promise<boolean | undefined>;
  menuItem: MenuItem | null;
}

export const DeleteMenuItemDialog = ({ 
  isOpen, 
  onOpenChange, 
  onDeleteMenuItem,
  menuItem 
}: DeleteMenuItemDialogProps) => {
  const handleDelete = async () => {
    const result = await onDeleteMenuItem();
    if (result) {
      onOpenChange(false);
    }
  };

  if (!menuItem) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Menu Item</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this menu item? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p>
            <strong>Item:</strong> {menuItem.name}
          </p>
          <p>
            <strong>Price:</strong> ${menuItem.price.toFixed(2)}
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete Item
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
