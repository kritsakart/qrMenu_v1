import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { CafeOwner } from "@/types/models";
import { AlertCircle, Trash2, Copy, Check } from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface OwnerTableRowProps {
  owner: CafeOwner;
  onStatusChange: (id: string, currentStatus: string) => Promise<void>;
  onDeleteOwner: (id: string) => Promise<void>;
}

export const OwnerTableRow = ({ owner, onStatusChange, onDeleteOwner }: OwnerTableRowProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [rowError, setRowError] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const handleStatusChange = async () => {
    try {
      setIsLoading(true);
      setRowError(null);
      await onStatusChange(owner.id, owner.status);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setRowError(errorMessage);
      console.error(`Error updating status for owner ${owner.id}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      setRowError(null);
      await onDeleteOwner(owner.id);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setRowError(errorMessage);
      console.error(`Error deleting owner ${owner.id}:`, error);
      setShowDeleteDialog(false);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      toast({
        title: "Copied",
        description: `Username "${text}" copied to clipboard`,
      });
      
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
      toast({
        variant: "destructive",
        title: "Copy error",
        description: "Failed to copy text to clipboard"
      });
    }
  };

  const formattedDate = new Date(owner.createdAt).toLocaleDateString();

  return (
    <>
      <TableRow key={owner.id} className={rowError ? "bg-red-50 hover:bg-red-100" : "hover:bg-gray-50"}>
        <TableCell>{owner.name}</TableCell>
        <TableCell className="font-mono text-sm">
          <div className="flex items-center gap-1">
            <span>{owner.username}</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => copyToClipboard(owner.username)}
              title="Copy username"
            >
              {isCopied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
            </Button>
          </div>
        </TableCell>
        <TableCell>{owner.email}</TableCell>
        <TableCell>
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              owner.status === "active"
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {owner.status === "active" ? "active" : "inactive"}
          </span>
        </TableCell>
        <TableCell className="text-sm text-gray-500">{formattedDate}</TableCell>
        <TableCell className="text-right space-x-2">
          {rowError && (
            <div className="flex items-center text-red-600 mb-1 text-xs">
              <AlertCircle className="h-3 w-3 mr-1" />
              <span>{rowError}</span>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleStatusChange}
              disabled={isLoading}
            >
              {isLoading && !showDeleteDialog ? (
                <span className="inline-flex items-center">
                  <span className="animate-spin mr-2 h-4 w-4 border-b-2 rounded-full border-primary"></span>
                  Updating...
                </span>
              ) : (
                owner.status === "active" ? "Deactivate" : "Activate"
              )}
            </Button>
            
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
              disabled={isLoading}
              className="ml-2"
            >
              <Trash2 size={16} className="mr-1" />
              Delete
            </Button>
          </div>
        </TableCell>
      </TableRow>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete cafe owner</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the owner "{owner.name}"?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? (
                <span className="inline-flex items-center">
                  <span className="animate-spin mr-2 h-4 w-4 border-b-2 rounded-full border-destructive-foreground"></span>
                  Deleting...
                </span>
              ) : (
                "Yes, delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
