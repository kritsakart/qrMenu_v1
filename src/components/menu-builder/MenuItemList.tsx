import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MenuItem } from "@/types/models";
import { Edit, Trash, Image as ImageIcon, GripVertical, Move } from "lucide-react";
import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useUpdateMultipleMenuItemsOrder } from '@/hooks/menu/useUpdateMenuItemOrder';

interface MenuItemListProps {
  title: string;
  menuItems: MenuItem[];
  selectedCategoryId: string | null;
  onAddItem: () => void;
  onEditItem: (item: MenuItem) => void;
  onDeleteItem: (item: MenuItem) => void;
}

interface SortableMenuItemProps {
  item: MenuItem;
  onEdit: (item: MenuItem) => void;
  onDelete: (item: MenuItem) => void;
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

const SortableMenuItem = ({ item, onEdit, onDelete }: SortableMenuItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card 
      ref={setNodeRef} 
      style={style} 
      className={`overflow-hidden hover:shadow-md transition-shadow duration-200 ${
        isDragging ? 'shadow-lg z-10' : ''
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Drag handle */}
          <div 
            {...attributes} 
            {...listeners} 
            className="flex-shrink-0 cursor-grab active:cursor-grabbing hover:bg-gray-200 p-2 rounded-md transition-colors border border-gray-300 bg-gray-100 flex flex-col items-center justify-center min-w-[32px]"
            title="Перетягніть для зміни порядку"
          >
            <GripVertical className="h-4 w-4 text-gray-600" />
          </div>
          
          {/* Зображення */}
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
              onClick={() => onEdit(item)}
              className="w-16 sm:w-20 text-xs sm:text-sm px-2"
            >
              <Edit className="h-3 w-3 sm:mr-1" />
              <span className="hidden sm:inline">Ред.</span>
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(item)}
              className="w-16 sm:w-20 text-xs sm:text-sm px-2"
            >
              <Trash className="h-3 w-3 sm:mr-1" />
              <span className="hidden sm:inline">Вид.</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
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
    ? menuItems.filter(item => item.categoryId === selectedCategoryId).sort((a, b) => (a.order || 0) - (b.order || 0))
    : [];
  
  console.log("🔍 MenuItemList Debug:", {
    selectedCategoryId,
    totalMenuItems: menuItems.length,
    filteredItemsCount: filteredItems.length,
    filteredItems: filteredItems
  });
  
  const [localItems, setLocalItems] = useState<MenuItem[]>(filteredItems);
  const [lastFilteredItemsIds, setLastFilteredItemsIds] = useState<string>('');
  const updateOrderMutation = useUpdateMultipleMenuItemsOrder();
  
  // Update local items when filtered items change (but preserve order if items are the same)
  useEffect(() => {
    const currentFilteredIds = filteredItems.map(item => item.id).sort().join(',');
    
    if (currentFilteredIds !== lastFilteredItemsIds) {
      console.log('🔄 Items composition changed, updating local items');
      
      // Спробуємо завантажити збережений порядок з localStorage
      let orderedItems = [...filteredItems];
      
      if (selectedCategoryId) {
        const savedOrderRaw = localStorage.getItem(`menuItemOrder_${selectedCategoryId}`);
        if (savedOrderRaw) {
          try {
            const savedOrder = JSON.parse(savedOrderRaw) as Record<string, number>;
            console.log("📂 Loading saved order from localStorage:", savedOrder);
            
            // Сортуємо товари згідно збереженого порядку
            orderedItems.sort((a, b) => {
              const orderA = savedOrder[a.id] ?? 999;
              const orderB = savedOrder[b.id] ?? 999;
              return orderA - orderB;
            });
            
            console.log("✅ Applied saved order to items");
          } catch (e) {
            console.log("⚠️ Could not parse saved order, using default");
          }
        }
      }
      
      setLocalItems(orderedItems);
      setLastFilteredItemsIds(currentFilteredIds);
    } else {
      console.log('✅ Items composition unchanged, preserving local order');
    }
  }, [filteredItems, lastFilteredItemsIds, selectedCategoryId]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    console.log("🔄 Drag end event:", { 
      activeId: active.id, 
      overId: over?.id,
      localItemsCount: localItems.length 
    });

    if (active.id !== over?.id) {
      const oldIndex = localItems.findIndex((item) => item.id === active.id);
      const newIndex = localItems.findIndex((item) => item.id === over?.id);
      
      console.log("📊 Drag indices:", { oldIndex, newIndex });
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newItems = arrayMove(localItems, oldIndex, newIndex);
        console.log("📦 New items order:", newItems.map((item, index) => ({ id: item.id, name: item.name, newOrder: index })));
        
        setLocalItems(newItems);
        
        // Зберігаємо порядок у localStorage
        if (selectedCategoryId) {
          const orderMap = newItems.reduce((acc, item, index) => {
            acc[item.id] = index;
            return acc;
          }, {} as Record<string, number>);
          
          const key = `menuItemOrder_${selectedCategoryId}`;
          const value = JSON.stringify(orderMap);
          
          localStorage.setItem(key, value);
          console.log("💾 Saved order to localStorage:", orderMap);
          
          // Тригеримо кастомну подію для оновлення в інших вкладках/компонентах
          window.dispatchEvent(new CustomEvent('localStorageChange', {
            detail: { key, newValue: value, oldValue: localStorage.getItem(key) }
          }));
          
          console.log("📡 Triggered storage change event for public menu sync");
        }
        
        // Prepare updates with new order values
        const updates = newItems.map((item, index) => ({
          itemId: item.id,
          newOrder: index,
          categoryId: item.categoryId,
        }));
        
        console.log("📤 Sending updates to database:", updates);
        
        // Update the order in the database
        updateOrderMutation.mutate(updates);
      } else {
        console.error("❌ Invalid indices for drag operation:", { oldIndex, newIndex });
      }
    } else {
      console.log("⏭️ No position change, skipping update");
    }
  };

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
        ) : localItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">У цій категорії ще немає пунктів меню. Додайте свій перший пункт.</p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={localItems.map(item => item.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {localItems.map((item) => (
                  <SortableMenuItem
                    key={item.id}
                    item={item}
                    onEdit={onEditItem}
                    onDelete={onDeleteItem}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </CardContent>
    </Card>
  );
};
