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
import { generateSingleQRCodePDF, generateSingleQRCodeSVG } from "@/utils/qrPdfGenerator";
import { useToast } from "@/hooks/use-toast";
import { Download, Loader2, FileImage } from "lucide-react";
import { useState } from "react";

interface ViewQRDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTable: Table | null;
  locationName?: string;
}

export const ViewQRDialog = ({ 
  open, 
  onOpenChange, 
  selectedTable,
  locationName = "Restaurant"
}: ViewQRDialogProps) => {
  const { toast } = useToast();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isGeneratingSVG, setIsGeneratingSVG] = useState(false);

  const handleDownloadPDF = async () => {
    if (!selectedTable) return;
    
    setIsGeneratingPDF(true);
    try {
      await generateSingleQRCodePDF(selectedTable, locationName);
      toast({
        title: "PDF Downloaded",
        description: `QR code for ${selectedTable.name} has been downloaded successfully.`,
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        variant: "destructive",
        title: "Download Error",
        description: "Failed to generate PDF. Please try again.",
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleDownloadSVG = async () => {
    if (!selectedTable) return;
    
    setIsGeneratingSVG(true);
    try {
      await generateSingleQRCodeSVG(selectedTable, locationName);
      toast({
        title: "SVG Downloaded",
        description: `QR code SVG for ${selectedTable.name} has been downloaded successfully.`,
      });
    } catch (error) {
      console.error('Error generating SVG:', error);
      toast({
        variant: "destructive",
        title: "Download Error",
        description: "Failed to generate SVG. Please try again.",
      });
    } finally {
      setIsGeneratingSVG(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
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
          <div className="flex flex-col gap-2 w-full">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                if (selectedTable?.qrCodeUrl) {
                  window.open(`${window.location.origin}${selectedTable.qrCodeUrl}`, '_blank');
                }
              }}
            >
              Open Menu
            </Button>
            <div className="flex gap-2">
              <Button 
                variant="default" 
                className="flex-1"
                onClick={handleDownloadPDF}
                disabled={isGeneratingPDF}
              >
                {isGeneratingPDF ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    PDF
                  </>
                )}
              </Button>
              <Button 
                variant="secondary" 
                className="flex-1"
                onClick={handleDownloadSVG}
                disabled={isGeneratingSVG}
              >
                {isGeneratingSVG ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileImage className="w-4 h-4 mr-2" />
                    SVG
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
