
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddTableDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTable: (tableName: string) => void;
}

export const AddTableDialog = ({ open, onOpenChange, onAddTable }: AddTableDialogProps) => {
  const [tableName, setTableName] = useState("");

  const handleAddTable = () => {
    onAddTable(tableName);
    setTableName("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>Add Table</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Table</DialogTitle>
          <DialogDescription>
            Create a new table for this location.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Table Name</Label>
            <Input
              id="name"
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              placeholder="Enter table name (e.g., Table 1, Window Seat)"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddTable}>Add Table</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
