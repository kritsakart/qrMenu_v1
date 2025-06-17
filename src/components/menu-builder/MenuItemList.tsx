import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MenuItem } from "@/types/models";
import { Edit, Trash, Image as ImageIcon } from "lucide-react";
import { useState } from "react";

interface MenuItemListProps {
  title: string;
  menuItems: MenuItem[];
  selectedCategoryId: string | null;
  onAddItem: () => void;
  onEditItem: (item: MenuItem) => void;
  onDeleteItem: (item: MenuItem) => void;
}

const MenuItemImage = ({ imageUrl, itemName }: { imageUrl?: string; itemName: string }) => {
  const [imageError, setImageError] = useState(false);
  
  if (!imageUrl || imageError) {
    return (
      <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
        <ImageIcon className="w-12 h-12 text-gray-400" />
      </div>
    );
  }
  
  return (
    <img
      src={imageUrl}
      alt={itemName}
      className="w-full h-40 object-cover transition-opacity duration-200 hover:opacity-90"
      onError={() => setImageError(true)}
      loading="lazy"
    />
  );
};

export const MenuItemList = ({
  title,
  menuItems,
  selectedCategoryId,
  onAddItem,
  onEditItem,
  onDeleteItem,
}: MenuItemListProps) => {
  const filteredItems = selectedCategoryId 
    ? menuItems.filter(item => item.categoryId === selectedCategoryId)
    : [];

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
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">У цій категорії ще немає пунктів меню. Додайте свій перший пункт.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredItems.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                <MenuItemImage imageUrl={item.imageUrl} itemName={item.name} />
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg truncate pr-2">{item.name}</h3>
                    <div className="text-lg font-bold text-green-600 whitespace-nowrap">
                      ₴{item.price.toFixed(2)}
                    </div>
                  </div>
                  {item.description && (
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  {item.weight && (
                    <p className="text-xs text-muted-foreground bg-gray-100 rounded px-2 py-1 inline-block">
                      {item.weight}
                    </p>
                  )}
                  <div className="flex justify-end space-x-2 mt-4 pt-2 border-t border-gray-100">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditItem(item)}
                    >
                      <Edit className="h-4 w-4 mr-1" /> Редагувати
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDeleteItem(item)}
                    >
                      <Trash className="h-4 w-4 mr-1" /> Видалити
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
