import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import PublicLayout from "@/components/layouts/PublicLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogPortal, DialogOverlay } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { OrderItem, MenuItem } from "@/types/models";
import { usePublicMenu } from "@/hooks/usePublicMenu";
import { Loader2, Image as ImageIcon, Trash2 } from "lucide-react";
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
  const { locationShortId, tableShortId } = useParams<{ locationShortId: string, tableShortId: string }>();
  const { toast } = useToast();
  
  console.log("🔍 PUBLIC MENU PAGE: locationShortId:", locationShortId, "tableShortId:", tableShortId);
  
  const {
    location,
    table,
    categories,
    menuItems,
    isLoading,
    error,
    allLocations
  } = usePublicMenu(locationShortId || "", tableShortId || "");
  
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isFoodListDialogOpen, setIsFoodListDialogOpen] = useState(false);
  const [isMenuItemDialogOpen, setIsMenuItemDialogOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [isOpenedFromCart, setIsOpenedFromCart] = useState(false);
  const [editingCartItemId, setEditingCartItemId] = useState<string | null>(null);

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

  const addToFoodList = (item: any) => {
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
      title: "Added to Food List",
      description: `${item.name} added to your food list.`,
      duration: 2000,
    });
  };

  const handleRemoveFromFoodList = (itemId: string) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const openMenuItemDialog = (item: MenuItem, fromCart = false, cartItemId?: string) => {
    setSelectedMenuItem(item);
    setIsOpenedFromCart(fromCart);
    setEditingCartItemId(cartItemId || null);
    
    // If opened from cart, find the existing cart item to get its variant
    if (fromCart && cartItemId) {
      const cartItem = cart.find(ci => ci.id === cartItemId);
      if (cartItem && item.variants && item.variants.length > 0) {
        // Try to find the variant that matches the cart item name
        const matchingVariant = item.variants.find(v => 
          cartItem.name.includes(`(${v.name})`)
        );
        if (matchingVariant) {
          setSelectedVariant(matchingVariant.id);
        } else {
          // If no matching variant found, try to match by price
          const cartItemPrice = cartItem.price - item.price; // Get variant price difference
          const priceMatchingVariant = item.variants.find(v => 
            Math.abs(v.price - cartItemPrice) < 0.01 // Allow small floating point differences
          );
          if (priceMatchingVariant) {
            setSelectedVariant(priceMatchingVariant.id);
          } else {
            // Fallback to default variant
            const defaultVariant = item.variants.find(v => v.isDefault) || item.variants[0];
            setSelectedVariant(defaultVariant.id);
          }
        }
      } else {
        // Set default variant if variants exist
        if (item.variants && item.variants.length > 0) {
          const defaultVariant = item.variants.find(v => v.isDefault) || item.variants[0];
          setSelectedVariant(defaultVariant.id);
        } else {
          setSelectedVariant(null);
        }
      }
    } else {
      // Set default variant if variants exist
      if (item.variants && item.variants.length > 0) {
        const defaultVariant = item.variants.find(v => v.isDefault) || item.variants[0];
        setSelectedVariant(defaultVariant.id);
      } else {
        setSelectedVariant(null);
      }
    }
    setIsMenuItemDialogOpen(true);
  };

  const addToFoodListFromDialog = () => {
    if (selectedMenuItem) {
      // Calculate final price including variant
      let finalPrice = selectedMenuItem.price;
      let finalName = selectedMenuItem.name;
      
      if (selectedVariant && selectedMenuItem.variants) {
        const variant = selectedMenuItem.variants.find(v => v.id === selectedVariant);
        if (variant) {
          // Add variant price to base price
          finalPrice += variant.price;
          finalName += ` (${variant.name})`;
        }
      }
      
      const cartItem: OrderItem = {
        id: editingCartItemId || `order-item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        menuItemId: selectedMenuItem.id,
        name: finalName,
        price: finalPrice,
        quantity: 1,
        selectedOptions: []
      };
      
      if (isOpenedFromCart && editingCartItemId) {
        // Replace existing item in cart
        setCart(cart.map(item => 
          item.id === editingCartItemId ? cartItem : item
        ));
      } else {
        // Add new item to cart
        setCart([...cart, cartItem]);
      }
      
      toast({
        title: isOpenedFromCart ? "Saved" : "Added to Food List",
        description: `${finalName} ${isOpenedFromCart ? 'saved successfully.' : 'added to your food list.'}`,
        duration: 2000,
      });
      
      setIsMenuItemDialogOpen(false);
      setEditingCartItemId(null);
    }
  };

  // Show error state
  if (error) {
    return (
      <PublicLayout>
        <div className="bg-gray-50 flex items-center justify-center py-12">
          <div className="text-center max-w-md mx-auto p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Menu Loading Error</h1>
            <p className="text-muted-foreground mb-4">{error.message}</p>
            {allLocations && allLocations.length > 0 && (
              <div className="text-left text-xs bg-gray-100 rounded p-2 mb-2">
                <div className="font-bold mb-1">Locations in database:</div>
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
              Try Again
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
        <div className="bg-gray-50 flex items-center justify-center py-12">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-muted-foreground">Loading menu...</p>
          </div>
        </div>
      </PublicLayout>
    );
  }

  // Show not found state
  if (!location || !table) {
    return (
      <PublicLayout>
        <div className="bg-gray-50 flex items-center justify-center py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Restaurant or Table Not Found</h1>
            <p className="text-muted-foreground">Please check your QR code or try again.</p>
          </div>
        </div>
      </PublicLayout>
    );
  }

  console.log("🔍 PUBLIC MENU PAGE: Rendering with location:", location, "categories:", categories);

  return (
    <PublicLayout>
      <div className="bg-gray-50">
        <header className="bg-white shadow">
          <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{location.name}</h1>
                <p className="text-sm text-muted-foreground">Table: {table.name}</p>
                <p className="text-xs text-muted-foreground">{location.address}</p>
              </div>
              <Button 
                variant="outline"
                className="relative"
                onClick={() => setIsFoodListDialogOpen(true)}
              >
                Food List {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6 pb-20">
          {categories.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-2">Menu is Empty</h2>
              <p className="text-muted-foreground">Categories and dishes will be added soon.</p>
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
                      // Fallback to created_at if order doesn't exist
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
                                  // Always start with base price
                                  let finalPrice = item.price;
                                  
                                  // If variants exist and there's a default variant, add its price
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
                  <p className="text-muted-foreground">No dishes in this category yet.</p>
                </div>
              )}
            </div>
          )}
        </main>

        {/* Menu Item Dialog */}
        <Dialog open={isMenuItemDialogOpen} onOpenChange={(open) => {
          setIsMenuItemDialogOpen(open);
          if (!open) {
            setEditingCartItemId(null);
            setIsOpenedFromCart(false);
          }
        }}>
          <DialogContent className="max-w-md p-0 gap-0 overflow-hidden max-h-[90vh] flex flex-col [&>button]:bg-gray-200 [&>button]:rounded-full [&>button]:w-8 [&>button]:h-8 [&>button]:hover:bg-gray-300 [&>button]:transition-all [&>button]:shadow-none">
            {selectedMenuItem && (
              <>
                {/* Image section with proper aspect ratio */}
                <div className="relative w-full aspect-square bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {selectedMenuItem.imageUrl ? (
                    <img 
                      src={selectedMenuItem.imageUrl} 
                      alt={selectedMenuItem.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-gray-400 text-6xl">🍽️</div>
                  )}
                </div>
                
                {/* Content section - scrollable */}
                <div className="p-6 space-y-4 flex-1 overflow-y-auto">
                  <div>
                    <h2 className="text-xl font-bold mb-2">{selectedMenuItem.name}</h2>
                    <p className="text-sm text-gray-600 mb-3">{selectedMenuItem.description}</p>
                    
                    {/* Price display */}
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-bold text-primary">
                        ${(() => {
                          // Always start with base price
                          let finalPrice = selectedMenuItem.price;
                          
                          // If variants exist and one is selected
                          if (selectedMenuItem.variants && selectedMenuItem.variants.length > 0 && selectedVariant) {
                            const variant = selectedMenuItem.variants.find(v => v.id === selectedVariant);
                            if (variant) {
                              // Add selected variant price to base price
                              finalPrice += variant.price;
                            }
                          } else if (selectedMenuItem.variants && selectedMenuItem.variants.length > 0) {
                            // If nothing selected, add default variant
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
                    onClick={addToFoodListFromDialog}
                    className="w-full bg-black hover:bg-gray-800 text-white h-12"
                  >
                    {isOpenedFromCart ? "Save" : "Add to Food List"}
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Food List Dialog */}
        <Dialog open={isFoodListDialogOpen} onOpenChange={setIsFoodListDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader className="text-left">
              <DialogTitle className="text-left">Your Food List</DialogTitle>
              <DialogDescription className="text-left">
                Review your items before checkout
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Your food list is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => {
                    // Find corresponding menuItem to get imageUrl
                    const menuItem = menuItems.find(mi => mi.id === item.menuItemId);
                    
                    // Extract variant name from item name if it contains parentheses
                    const baseItemName = item.name.split(' (')[0];
                    const variantName = item.name.includes(' (') ? item.name.split(' (')[1].replace(')', '') : null;
                    
                    return (
                      <div key={item.id} className="flex items-start space-x-3">
                        <div 
                          className="cursor-pointer flex-shrink-0"
                          onClick={() => {
                            if (menuItem) {
                              openMenuItemDialog(menuItem, true, item.id);
                              setIsFoodListDialogOpen(false);
                            }
                          }}
                        >
                          <MenuItemImage 
                            imageUrl={menuItem?.imageUrl} 
                            itemName={item.name}
                            size="sm"
                          />
                        </div>
                        <div 
                          className="flex-grow cursor-pointer min-w-0"
                          onClick={() => {
                            if (menuItem) {
                              openMenuItemDialog(menuItem, true, item.id);
                              setIsFoodListDialogOpen(false);
                            }
                          }}
                        >
                          <h4 className="font-medium truncate">{baseItemName}</h4>
                          {variantName && (
                            <div className="flex items-center gap-1 mt-1">
                              <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-xs font-bold leading-none">+</span>
                              </div>
                              <span className="text-xs text-gray-600">{variantName}</span>
                            </div>
                          )}
                          <p className="text-sm text-muted-foreground mt-1">
                            ${item.price.toFixed(2)} x {item.quantity}
                          </p>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveFromFoodList(item.id)}
                          className="flex-shrink-0 p-2 h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            {cart.length > 0 && (
              <DialogFooter className="flex justify-start items-center sm:justify-start">
                <div className="text-lg font-bold text-left ml-[52px]">
                  Total: ${totalAmount.toFixed(2)}
                </div>
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </PublicLayout>
  );
};

export default MenuPage;
