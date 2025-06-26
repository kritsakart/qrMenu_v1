import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MenuCategory } from "@/types/models";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface CategoryListProps {
  categories: MenuCategory[];
  isLoading: boolean;
  selectedCategoryId: string | null;
  onSelectCategory: (id: string) => void;
  onAddCategory: () => void;
}

export function CategoryList({
  categories,
  isLoading,
  selectedCategoryId,
  onSelectCategory,
  onAddCategory,
}: CategoryListProps) {
  console.log('[DEBUG] CategoryList: categories =', categories);
  console.log('[DEBUG] CategoryList: selectedCategoryId =', selectedCategoryId);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Categories
          <Button onClick={onAddCategory} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No categories yet.</p>
            <p className="text-sm">Click "Add Category" to get started.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategoryId === category.id ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => onSelectCategory(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
