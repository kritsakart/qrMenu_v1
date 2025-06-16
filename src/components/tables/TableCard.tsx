
import { Table } from "@/types/models";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";

interface TableCardProps {
  table: Table;
  onEdit: (table: Table) => void;
  onDelete: (table: Table) => void;
  onViewQR: (table: Table) => void;
}

export const TableCard = ({ table, onEdit, onDelete, onViewQR }: TableCardProps) => {
  return (
    <Card key={table.id} className="overflow-hidden">
      <div className="p-6 flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{table.name}</h3>
          <p className="text-sm text-muted-foreground">
            Created on {new Date(table.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex flex-col items-center">
          <div 
            className="w-20 h-20 bg-white border flex items-center justify-center cursor-pointer mb-1"
            onClick={() => onViewQR(table)}
          >
            <QRCodeSVG 
              value={`${window.location.origin}${table.qrCodeUrl}`}
              size={70}
              bgColor={"#ffffff"}
              fgColor={"#000000"}
              level={"L"}
              includeMargin={false}
            />
          </div>
          <span className="text-xs text-blue-600">View QR</span>
        </div>
      </div>
      <div className="px-6 pb-6 pt-0 flex gap-2 justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(table)}
        >
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(table)}
        >
          Delete
        </Button>
      </div>
    </Card>
  );
};
