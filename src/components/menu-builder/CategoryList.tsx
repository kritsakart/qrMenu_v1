import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MenuCategory } from "@/types/models";
import { Pencil, Trash, GripVertical } from "lucide-react";
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

interface CategoryListProps {
  categories: MenuCategory[];
  selectedCategoryId: string | null;
  setSelectedCategoryId: (id: string) => void;
  onAddCategory: () => void;
  onEditCategory: (categoryId: string) => void;
  onDeleteCategory: (categoryId: string) => void;
  onReorderCategories?: (reorderedCategories: MenuCategory[]) => void;
  isLoading?: boolean;
}

interface SortableCategoryItemProps {
  category: MenuCategory;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const SortableCategoryItem = ({ 
  category, 
  isSelected, 
  onSelect, 
  onEdit, 
  onDelete 
}: SortableCategoryItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between p-2 rounded-md ${
        isSelected ? "bg-primary text-primary-foreground" : "hover:bg-gray-100"
      } cursor-pointer ${isDragging ? 'z-50' : ''}`}
      onClick={onSelect}
    >
      <div className="flex items-center space-x-2 flex-1">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-200 rounded"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="h-4 w-4 text-gray-400" />
        </div>
        <span className="flex-1">{category.name}</span>
      </div>
      
      <div className="flex space-x-1">
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export const CategoryList = ({
  categories,
  selectedCategoryId,
  setSelectedCategoryId,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onReorderCategories,
  isLoading = false
}: CategoryListProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = categories.findIndex(category => category.id === active.id);
    const newIndex = categories.findIndex(category => category.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const reorderedCategories = arrayMove(categories, oldIndex, newIndex);
      console.log('🔄 Categories reordered:', { 
        from: oldIndex, 
        to: newIndex, 
        reorderedCategories: reorderedCategories.map(c => ({ id: c.id, name: c.name }))
      });
      
      if (onReorderCategories) {
        onReorderCategories(reorderedCategories);
      }
    }
  };

  return (
    <Card className="lg:col-span-1">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle>Категорії</CardTitle>
        <Button size="sm" variant="outline" onClick={onAddCategory}>Додати</Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Завантаження категорій...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Ще немає категорій. Створіть першу категорію, щоб почати.</p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={categories.map(c => c.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-1">
                {categories.map(category => (
                  <SortableCategoryItem
                    key={category.id}
                    category={category}
                    isSelected={selectedCategoryId === category.id}
                    onSelect={() => setSelectedCategoryId(category.id)}
                    onEdit={() => onEditCategory(category.id)}
                    onDelete={() => onDeleteCategory(category.id)}
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
