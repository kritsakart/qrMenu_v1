import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import PublicLayout from "@/components/layouts/PublicLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogPortal, DialogOverlay } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { OrderItem, MenuItem } from "@/types/models";
import { usePublicMenu } from "@/hooks/usePublicMenu";
import { Loader2, Image as ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const MenuItemImage = ({ imageUrl, itemName, size = "md" }: { 
  imageUrl?: string; 
  itemName: string;
  size?: "sm" | "md"
}) => {
  const [imageError, setImageError] = useState(false);
  
  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-24 h-24"
  };
  
  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-8 h-8"
  };
  
  if (!imageUrl || imageError) {
    return (
      <div className={`${sizeClasses[size]} bg-gray-100 flex items-center justify-center rounded border`}>
        <ImageIcon className={`${iconSizes[size]} text-gray-400`} />
      </div>
    );
  }
  
  return (
    <img
      src={imageUrl}
      alt={itemName}
      className={`${sizeClasses[size]} object-cover rounded border`}
      onError={() => setImageError(true)}
      loading="lazy"
    />
  );
};

const MenuPage = () => {
  const { locationId, tableId } = useParams<{ locationId: string, tableId: string }>();
  const { toast } = useToast();
  
  console.log("🔍 PUBLIC MENU PAGE: locationId:", locationId, "tableId:", tableId);
  
  const {
    location,
    table,
    categories,
    menuItems,
    isLoading,
    error,
    allLocations
  } = usePublicMenu(locationId || "", tableId || "");
  
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isCartDialogOpen, setIsCartDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isOrderSuccessDialogOpen, setIsOrderSuccessDialogOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [isMenuItemDialogOpen, setIsMenuItemDialogOpen] = useState(false);

  // Set first category as selected when categories load
  useEffect(() => {
    if (categories.length > 0 && !selectedCategoryId) {
      setSelectedCategoryId(categories[0].id);
      console.log("🔍 PUBLIC MENU PAGE: Auto-selected category:", categories[0].id);
    }
  }, [categories, selectedCategoryId]);

  // Calculate total amount
  useEffect(() => {
    const total = cart.reduce((sum, item) => {
      const itemTotal = item.price * item.quantity;
      const optionsTotal = item.selectedOptions?.reduce((optSum, opt) => optSum + opt.price, 0) || 0;
      return sum + itemTotal + (optionsTotal * item.quantity);
    }, 0);
    
    setTotalAmount(total);
  }, [cart]);

  const addToCart = (item: any) => {
    const cartItem: OrderItem = {
      id: `order-item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      selectedOptions: []
    };
    
    setCart([...cart, cartItem]);
    
    toast({
      title: "Додано до замовлення",
      description: `${item.name} додано до вашого замовлення.`,
    });
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const handleCheckout = () => {
    setIsCartDialogOpen(false);
    setIsPaymentDialogOpen(true);
  };

  const handlePayment = () => {
    setIsPaymentDialogOpen(false);
    setIsOrderSuccessDialogOpen(true);
    setCart([]);
  };

  const openMenuItemDialog = (item: MenuItem) => {
    setSelectedMenuItem(item);
    // Встановлюємо дефолтний варіант якщо є варіанти
    if (item.variants && item.variants.length > 0) {
      const defaultVariant = item.variants.find(v => v.isDefault) || item.variants[0];
      setSelectedVariant(defaultVariant.id);
    } else {
      setSelectedVariant(null);
    }
    setIsMenuItemDialogOpen(true);
  };

  const addToCartFromDialog = () => {
    if (selectedMenuItem) {
      // Обчислюємо фінальну ціну з урахуванням варіанту
      let finalPrice = selectedMenuItem.price;
      let finalName = selectedMenuItem.name;
      
      if (selectedVariant && selectedMenuItem.variants) {
        const variant = selectedMenuItem.variants.find(v => v.id === selectedVariant);
        if (variant) {
          // Додаємо ціну варіанту до базової ціни
          finalPrice += variant.price;
          finalName += ` (${variant.name})`;
        }
      }
      
      const cartItem: OrderItem = {
        id: `order-item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        menuItemId: selectedMenuItem.id,
        name: finalName,
        price: finalPrice,
        quantity: 1,
        selectedOptions: []
      };
      
      setCart([...cart, cartItem]);
      
      toast({
        title: "Додано до замовлення",
        description: `${finalName} додано до вашого замовлення.`,
      });
      
      setIsMenuItemDialogOpen(false);
    }
  };

  // Show error state
  if (error) {
    return (
      <PublicLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Помилка завантаження меню</h1>
            <p className="text-muted-foreground mb-4">{error.message}</p>
            {allLocations && allLocations.length > 0 && (
              <div className="text-left text-xs bg-gray-100 rounded p-2 mb-2">
                <div className="font-bold mb-1">Локації у базі:</div>
                <ul>
                  {allLocations.map(loc => (
                    <li key={loc.id}>
                      id: <b>{loc.id}</b>, name: {loc.name}, cafe_id: {loc.cafe_id}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <Button onClick={() => window.location.reload()}>
              Спробувати ще раз
            </Button>
          </div>
        </div>
      </PublicLayout>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <PublicLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-muted-foreground">Завантаження меню...</p>
          </div>
        </div>
      </PublicLayout>
    );
  }

  // Show not found state
  if (!location || !table) {
    return (
      <PublicLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Заклад або столик не знайдено</h1>
            <p className="text-muted-foreground">Перевірте правильність QR-коду або спробуйте ще раз.</p>
          </div>
        </div>
      </PublicLayout>
    );
  }

  console.log("🔍 PUBLIC MENU PAGE: Rendering with location:", location, "categories:", categories);

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{location.name}</h1>
                <p className="text-sm text-muted-foreground">Столик: {table.name}</p>
                <p className="text-xs text-muted-foreground">{location.address}</p>
              </div>
              <Button 
                variant="outline"
                className="relative"
                onClick={() => setIsCartDialogOpen(true)}
              >
                Кошик {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6">
          {categories.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-2">Меню поки що порожнє</h2>
              <p className="text-muted-foreground">Категорії та страви будуть додані незабаром.</p>
            </div>
          ) : (
            <div>
              {/* Categories as pills */}
              <div className="mb-6">
                <div className="overflow-x-auto pb-2">
                  <div className="flex gap-3 w-max min-w-full">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategoryId(category.id)}
                        className={`px-6 py-3 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                          selectedCategoryId === category.id
                            ? 'bg-black text-white shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Content for selected category */}
              {selectedCategoryId && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {menuItems
                    .filter((item) => item.categoryId === selectedCategoryId)
                    .sort((a, b) => {
                      // Fallback на created_at якщо order не існує
                      if (a.order !== undefined && b.order !== undefined) {
                        return a.order - b.order;
                      }
                      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                    })
                    .map((item) => (
                      <Card 
                        key={item.id} 
                        className="overflow-hidden flex flex-col cursor-pointer hover:shadow-lg transition-shadow" 
                        onClick={() => openMenuItemDialog(item)}
                      >
                        <CardContent className="p-4 flex flex-row items-center justify-between flex-grow">
                          <div className="flex-1 pr-4">
                            <h3 className="text-lg font-semibold mb-1">{item.name}</h3>
                            {item.description && (
                              <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                            )}
                            <div className="flex justify-between items-center">
                              <span className="text-primary font-medium text-lg">
                                ${(() => {
                                  // Завжди починаємо з базової ціни
                                  let finalPrice = item.price;
                                  
                                  // Якщо є варіанти і є дефолтний варіант, додаємо його ціну
                                  if (item.variants && item.variants.length > 0) {
                                    const defaultVariant = item.variants.find(v => v.isDefault);
                                    if (defaultVariant) {
                                      finalPrice += defaultVariant.price;
                                    }
                                  }
                                  
                                  return finalPrice.toFixed(2);
                                })()}
                              </span>
                              {item.weight && (
                                <span className="text-xs text-gray-500">{item.weight}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex-shrink-0 ml-4">
                            <MenuItemImage 
                              imageUrl={item.imageUrl} 
                              itemName={item.name}
                              size="md"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              )}
              
              {selectedCategoryId && menuItems.filter((item) => item.categoryId === selectedCategoryId).length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">У цій категорії поки що немає страв.</p>
                </div>
              )}
            </div>
          )}
        </main>

        {/* Menu Item Detail Dialog */}
        <Dialog open={isMenuItemDialogOpen} onOpenChange={setIsMenuItemDialogOpen}>
          <DialogPortal>
            <DialogOverlay />
            <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-md translate-x-[-50%] translate-y-[-50%] gap-0 border bg-background shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg overflow-hidden">
              {selectedMenuItem && (
                <>
                  {/* Image section with proper aspect ratio */}
                  <div className="relative w-full aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                    {selectedMenuItem.imageUrl ? (
                      <img 
                        src={selectedMenuItem.imageUrl} 
                        alt={selectedMenuItem.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-gray-400 text-6xl">🍽️</div>
                    )}
                    <button 
                      onClick={() => setIsMenuItemDialogOpen(false)}
                      className="absolute top-4 right-4 w-8 h-8 bg-white bg-opacity-80 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all"
                    >
                      ✕
                    </button>
                  </div>
                  
                  {/* Content section */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h2 className="text-xl font-bold mb-2">{selectedMenuItem.name}</h2>
                      <p className="text-sm text-gray-600 mb-3">{selectedMenuItem.description}</p>
                      
                      {/* Price display */}
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-2xl font-bold text-primary">
                          ${(() => {
                            // Завжди починаємо з базової ціни
                            let finalPrice = selectedMenuItem.price;
                            
                            // Якщо є варіанти та вибрано якийсь варіант
                            if (selectedMenuItem.variants && selectedMenuItem.variants.length > 0 && selectedVariant) {
                              const variant = selectedMenuItem.variants.find(v => v.id === selectedVariant);
                              if (variant) {
                                // Додаємо ціну вибраного варіанту до базової ціни
                                finalPrice += variant.price;
                              }
                            } else if (selectedMenuItem.variants && selectedMenuItem.variants.length > 0) {
                              // Якщо нічого не вибрано, додаємо дефолтний варіант
                              const defaultVariant = selectedMenuItem.variants.find(v => v.isDefault);
                              if (defaultVariant) {
                                finalPrice += defaultVariant.price;
                              }
                            }
                            
                            return finalPrice.toFixed(2);
                          })()}
                        </span>
                        {selectedMenuItem.weight && (
                          <span className="text-sm text-gray-500">{selectedMenuItem.weight}</span>
                        )}
                      </div>

                      {/* Variants selection */}
                      {selectedMenuItem.variants && selectedMenuItem.variants.length > 0 && (
                        <div className="space-y-3 mb-4">
                          <h3 className="font-medium text-sm text-gray-700">Choose variant:</h3>
                          <div className="space-y-2">
                            {selectedMenuItem.variants.map((variant) => (
                              <div 
                                key={variant.id}
                                className={`border rounded-lg p-3 cursor-pointer transition-all ${
                                  selectedVariant === variant.id 
                                    ? 'border-primary bg-primary/5' 
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                                onClick={() => setSelectedVariant(variant.id)}
                              >
                                <div className="flex justify-between items-center">
                                  <span className="font-medium">{variant.name}</span>
                                                                  <span className="text-sm">
                                  {variant.price === 0 
                                    ? 'No extra charge' 
                                    : variant.price > 0 
                                      ? `+$${variant.price.toFixed(2)}`
                                      : `-$${Math.abs(variant.price).toFixed(2)}`
                                  }
                                </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <Button 
                      onClick={addToCartFromDialog}
                      className="w-full bg-black hover:bg-gray-800 text-white h-12"
                    >
                      Add to Cart
                    </Button>
                  </div>
                </>
              )}
            </div>
          </DialogPortal>
        </Dialog>

        {/* Cart Dialog */}
        <Dialog open={isCartDialogOpen} onOpenChange={setIsCartDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Ваше замовлення</DialogTitle>
              <DialogDescription>
                Перевірте страви перед оформленням
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Ваш кошик порожній</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => {
                    // Знаходимо відповідний menuItem для отримання imageUrl
                    const menuItem = menuItems.find(mi => mi.id === item.menuItemId);
                    
                    return (
                      <div key={item.id} className="flex items-center space-x-3">
                        <MenuItemImage 
                          imageUrl={menuItem?.imageUrl} 
                          itemName={item.name}
                          size="sm"
                        />
                        <div className="flex-grow">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            ${item.price.toFixed(2)} x {item.quantity}
                          </p>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveFromCart(item.id)}
                        >
                          Видалити
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            {cart.length > 0 && (
              <DialogFooter className="flex justify-between items-center">
                <div className="text-lg font-bold">
                  Загалом: ${totalAmount.toFixed(2)}
                </div>
                <Button onClick={handleCheckout} className="bg-black hover:bg-gray-800 text-white">
                  Оформити замовлення
                </Button>
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>

        {/* Payment Dialog */}
        <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Оплата замовлення</DialogTitle>
              <DialogDescription>
                Оберіть спосіб оплати
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full h-12 text-left justify-start"
                  onClick={handlePayment}
                >
                  💳 Картою
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full h-12 text-left justify-start"
                  onClick={handlePayment}
                >
                  💵 Готівкою
                </Button>
              </div>
            </div>
            <DialogFooter>
              <div className="text-lg font-bold">
                До сплати: ${totalAmount.toFixed(2)}
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Order Success Dialog */}
        <Dialog open={isOrderSuccessDialogOpen} onOpenChange={setIsOrderSuccessDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>🎉 Замовлення прийнято!</DialogTitle>
              <DialogDescription>
                Ваше замовлення було успішно оформлено. Очікуйте приготування.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 text-center">
              <p className="text-muted-foreground">
                Орієнтовний час приготування: 15-20 хвилин
              </p>
            </div>
            <DialogFooter>
              <Button 
                onClick={() => setIsOrderSuccessDialogOpen(false)}
                className="w-full bg-black hover:bg-gray-800 text-white"
              >
                Закрити
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PublicLayout>
  );
};

export default MenuPage;
