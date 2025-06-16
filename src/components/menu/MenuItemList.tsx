
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MenuItem } from "@/types/models";

interface MenuItemListProps {
  title: string;
  menuItems: MenuItem[];
  isLoading: boolean;
  error: Error | null;
  selectedCategoryId: string | null;
  onAddItem: () => void;
  onEditItem: (item: MenuItem) => void;
  onDeleteItem: (item: MenuItem) => void;
}

export const MenuItemList = ({
  title,
  menuItems,
  isLoading,
  error,
  selectedCategoryId,
  onAddItem,
  onEditItem,
  onDeleteItem
}: MenuItemListProps) => {
  return (
    <Card className="lg:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle>{title}</CardTitle>
        <Button disabled={!selectedCategoryId} onClick={onAddItem}>Додати пункт</Button>
      </CardHeader>
      <CardContent>
        {!selectedCategoryId ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Виберіть або створіть категорію для керування пунктами меню.</p>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            <p className="text-muted-foreground">Завантаження пунктів меню...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col justify-center items-center h-40">
            <AlertCircle className="h-6 w-6 text-destructive mb-2" />
            <p className="text-destructive">Помилка завантаження пунктів меню</p>
            <p className="text-muted-foreground">{error.message}</p>
          </div>
        ) : menuItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">У цій категорії ще немає пунктів меню. Додайте свій перший пункт.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {menuItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-40 object-cover"
                  />
                )}
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{item.name}</h3>
                    <div className="text-lg font-medium">{item.price.toFixed(2)} грн</div>
                  </div>
                  {item.description && (
                    <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                  )}
                  {item.weight && (
                    <p className="text-xs text-muted-foreground">{item.weight}</p>
                  )}
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditItem(item)}
                    >
                      Редагувати
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDeleteItem(item)}
                    >
                      Видалити
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
