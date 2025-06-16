import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import { Table } from "@/types/models";

interface ViewQRDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTable: Table | null;
}

export const ViewQRDialog = ({ 
  open, 
  onOpenChange, 
  selectedTable 
}: ViewQRDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Table QR Code</DialogTitle>
          <DialogDescription>
            This QR code takes guests directly to the menu for {selectedTable?.name}.
          </DialogDescription>
        </DialogHeader>
        <div className="py-6 flex flex-col items-center justify-center">
          <div 
            className="bg-white p-4 border rounded-md shadow-sm mb-4 w-64 h-64 flex items-center justify-center cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => {
              if (selectedTable?.qrCodeUrl) {
                window.open(`${window.location.origin}${selectedTable.qrCodeUrl}`, '_blank');
              }
            }}
          >
            <QRCodeSVG 
              value={selectedTable ? `${window.location.origin}${selectedTable.qrCodeUrl}` : ''}
              size={200}
              bgColor={"#ffffff"}
              fgColor={"#000000"}
              level={"L"}
              includeMargin={true}
            />
          </div>
          <p className="text-sm text-center text-muted-foreground mb-4">
            URL: {window.location.origin}{selectedTable?.qrCodeUrl}
          </p>
          <div className="flex gap-2">
            <Button onClick={() => {
              if (selectedTable?.qrCodeUrl) {
                window.open(`${window.location.origin}${selectedTable.qrCodeUrl}`, '_blank');
              }
            }}>
              Відкрити меню
            </Button>
            <Button variant="outline">Завантажити QR-код</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
