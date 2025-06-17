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
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 flex items-center justify-center rounded">
        <ImageIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
      </div>
    );
  }
  
  return (
    <img
      src={imageUrl}
      alt={itemName}
      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded transition-opacity duration-200 hover:opacity-90"
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
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle>{title}</CardTitle>
        <Button disabled={!selectedCategoryId} onClick={onAddItem}>Додати пункт</Button>
      </CardHeader>
      <CardContent className="max-h-[500px] sm:max-h-[600px] overflow-y-auto custom-scrollbar">
        {!selectedCategoryId ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Виберіть або створіть категорію для керування пунктами меню.</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">У цій категорії ще немає пунктів меню. Додайте свій перший пункт.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    {/* Зображення зліва */}
                    <div className="flex-shrink-0">
                      <MenuItemImage imageUrl={item.imageUrl} itemName={item.name} />
                    </div>
                    
                    {/* Контент по центру */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-semibold text-base truncate pr-2">{item.name}</h3>
                        <div className="text-base sm:text-lg font-bold text-green-600 whitespace-nowrap">
                          ₴{item.price.toFixed(2)}
                        </div>
                      </div>
                      
                      {item.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {item.description}
                        </p>
                      )}
                      
                      {item.weight && (
                        <span className="text-xs text-muted-foreground bg-gray-100 rounded px-2 py-1 inline-block">
                          {item.weight}
                        </span>
                      )}
                    </div>
                    
                    {/* Кнопки справа */}
                    <div className="flex flex-col sm:flex-col gap-1 sm:gap-2 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEditItem(item)}
                        className="w-16 sm:w-20 text-xs sm:text-sm px-2"
                      >
                        <Edit className="h-3 w-3 sm:mr-1" />
                        <span className="hidden sm:inline">Ред.</span>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDeleteItem(item)}
                        className="w-16 sm:w-20 text-xs sm:text-sm px-2"
                      >
                        <Trash className="h-3 w-3 sm:mr-1" />
                        <span className="hidden sm:inline">Вид.</span>
                      </Button>
                    </div>
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
