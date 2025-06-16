
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface StatisticsCardProps {
  title: string;
  value: number | string;
  description: string;
  valueClassName?: string;
}

export const StatisticsCard = ({ 
  title, 
  value, 
  description, 
  valueClassName = "text-3xl font-bold" 
}: StatisticsCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={valueClassName}>{value}</div>
        <p className="text-xs text-muted-foreground pt-1">
          {description}
        </p>
      </CardContent>
    </Card>
  );
};
