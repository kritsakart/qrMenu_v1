
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MenuCategory } from "@/types/models";

interface CategoryListProps {
  categories: MenuCategory[];
  selectedCategoryId: string | null;
  setSelectedCategoryId: (id: string) => void;
  onAddCategory: () => void;
  onEditCategory: (category: MenuCategory) => void;
  onDeleteCategory: (categoryId: string) => void;
  isLoading: boolean;
}

export const CategoryList = ({
  categories,
  selectedCategoryId,
  setSelectedCategoryId,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  isLoading
}: CategoryListProps) => {
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
          <div className="space-y-1">
            {categories.map(category => (
              <div 
                key={category.id}
                className={`flex items-center justify-between p-2 rounded-md ${
                  selectedCategoryId === category.id ? "bg-primary text-primary-foreground" : "hover:bg-gray-100"
                } cursor-pointer`}
                onClick={() => setSelectedCategoryId(category.id)}
              >
                <span>{category.name}</span>
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditCategory(category);
                    }}
                  >
                    ✏️
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteCategory(category.id);
                    }}
                  >
                    🗑️
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
