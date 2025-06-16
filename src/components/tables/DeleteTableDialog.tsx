
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table } from "@/types/models";

interface DeleteTableDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingTable: Table | null;
  onDeleteTable: () => void;
}

export const DeleteTableDialog = ({ 
  open, 
  onOpenChange, 
  editingTable, 
  onDeleteTable 
}: DeleteTableDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Table</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this table? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p>
            <strong>Table:</strong> {editingTable?.name}
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onDeleteTable}>
            Delete Table
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
