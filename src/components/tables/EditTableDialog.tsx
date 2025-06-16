
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table } from "@/types/models";

interface EditTableDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingTable: Table | null;
  onUpdateTable: (editedTable: Table) => void;
  onEditingTableChange: (table: Table | null) => void;
}

export const EditTableDialog = ({ 
  open, 
  onOpenChange, 
  editingTable, 
  onUpdateTable,
  onEditingTableChange 
}: EditTableDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Table</DialogTitle>
          <DialogDescription>
            Update the details for this table.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Table Name</Label>
            <Input
              id="edit-name"
              value={editingTable?.name || ""}
              onChange={(e) =>
                onEditingTableChange(
                  editingTable
                    ? { ...editingTable, name: e.target.value }
                    : null
                )
              }
              placeholder="Enter table name"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => editingTable && onUpdateTable(editingTable)}>Update Table</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
