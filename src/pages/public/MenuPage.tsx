import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PublicLayout from "@/components/layouts/PublicLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { OrderItem } from "@/types/models";
import { usePublicMenu } from "@/hooks/usePublicMenu";
import { Loader2 } from "lucide-react";

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
        <div style={{ padding: '20px', textAlign: 'center', fontSize: '24px' }}>
          Завантаження...
        </div>
      </PublicLayout>
    );
  }

  // Show not found state
  if (!location || !table) {
    return (
      <PublicLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Меню не знайдено</h1>
            <p className="text-muted-foreground mb-4">
              Перевірте QR-код та спробуйте ще раз. Можливо, посилання застаріло або столик більше не доступний.
            </p>
            <Button onClick={() => window.location.reload()}>
              Оновити сторінку
            </Button>
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
            <Tabs 
              value={selectedCategoryId || ""} 
              onValueChange={(value) => setSelectedCategoryId(value)}
              className="mb-6"
            >
              <div className="overflow-x-auto pb-2">
                <TabsList className="inline-flex">
                  {categories.map((category) => (
                    <TabsTrigger key={category.id} value={category.id}>
                      {category.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {categories.map((category) => (
                <TabsContent key={category.id} value={category.id}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {menuItems
                      .filter((item) => item.categoryId === category.id)
                      .map((item) => (
                        <Card key={item.id} className="overflow-hidden flex flex-col">
                          <CardContent className="p-4 flex flex-row items-center justify-between flex-grow">
                            <div className="flex-1 pr-4">
                              <h3 className="text-lg font-semibold mb-1">{item.name}</h3>
                              {item.description && (
                                <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                              )}
                              <div className="flex justify-between items-center">
                                <span className="text-primary font-medium text-lg">
                                  {item.price.toFixed(2)} грн
                                </span>
                                {item.weight && (
                                  <span className="text-xs text-gray-500">{item.weight}</span>
                                )}
                              </div>
                            </div>
                            {item.imageUrl && (
                              <div className="w-24 h-24 flex-shrink-0 ml-4">
                                <img
                                  src={item.imageUrl}
                                  alt={item.name}
                                  className="w-full h-full object-cover rounded"
                                />
                              </div>
                            )}
                          </CardContent>
                          <div className="p-4 pt-0">
                            <Button 
                              className="w-full" 
                              onClick={() => addToCart(item)}
                            >
                              Додати до замовлення
                            </Button>
                          </div>
                        </Card>
                      ))}
                  </div>
                  {menuItems.filter((item) => item.categoryId === category.id).length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">У цій категорії поки що немає страв.</p>
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          )}
        </main>

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
                      <div key={item.id} className="flex justify-between items-start pb-4 border-b">
                        <div className="flex items-center">
                          {menuItem?.imageUrl && (
                            <img
                              src={menuItem.imageUrl}
                              alt={item.name}
                              className="w-10 h-10 object-cover rounded mr-2 border"
                            />
                          )}
                          <div>
                            <div className="flex items-center">
                              <span className="font-medium">{item.quantity}x </span>
                              <span className="ml-1">{item.name}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            {(item.price * item.quantity).toFixed(2)} грн
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveFromCart(item.id)}
                          >
                            ✕
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                  <div className="flex justify-between font-bold pt-4">
                    <span>Всього</span>
                    <span>{totalAmount.toFixed(2)} грн</span>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCartDialogOpen(false)}>
                Повернутися до меню
              </Button>
              <Button 
                onClick={handleCheckout}
                disabled={cart.length === 0}
              >
                Оформити замовлення
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Оплата</DialogTitle>
              <DialogDescription>
                Завершіть ваше замовлення
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="text-center py-4">
                <p className="text-lg font-bold mb-4">Всього: {totalAmount.toFixed(2)} грн</p>
                <p className="text-sm text-muted-foreground mb-6">
                  У реальному додатку тут буде інтеграція з платіжною системою
                </p>
                <Button onClick={handlePayment} className="w-full">
                  Оплатити зараз
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog 
          open={isOrderSuccessDialogOpen} 
          onOpenChange={setIsOrderSuccessDialogOpen}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Замовлення підтверджено!</DialogTitle>
              <DialogDescription>
                Ваше замовлення успішно оформлено
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-8 text-center">
              <div className="text-5xl mb-4">✅</div>
              <p className="font-medium">Дякуємо за ваше замовлення</p>
              <p className="text-sm text-muted-foreground">
                Ваше замовлення передано на кухню. Персонал незабаром подасть ваші страви.
              </p>
            </div>
            <DialogFooter>
              <Button 
                className="w-full" 
                onClick={() => setIsOrderSuccessDialogOpen(false)}
              >
                Повернутися до меню
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PublicLayout>
  );
};

export default MenuPage;
