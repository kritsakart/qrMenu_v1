import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Order, OrderStatus } from "@/types/models";
import { getCafeOwnerData } from "@/data/mockData";

// Add MenuItemImage component
const MenuItemImage = ({ imageUrl, itemName }: { imageUrl?: string; itemName: string }) => {
  const [imageError, setImageError] = useState(false);
  
  if (!imageUrl || imageError) {
    return (
      <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded border">
        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }
  
  return (
    <img
      src={imageUrl}
      alt={itemName}
      className="w-16 h-16 object-cover rounded border"
      onError={() => setImageError(true)}
      loading="lazy"
    />
  );
};

const OrdersDashboard = () => {
  const { user } = useAuth();
  const cafeId = user?.cafeId || "cafe-1";
  const cafeData = getCafeOwnerData(cafeId);
  
  const [orders, setOrders] = useState<Order[]>(cafeData.orders);
  const [selectedTab, setSelectedTab] = useState<OrderStatus>("new");
  const { toast } = useToast();

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId
          ? { ...order, status, updatedAt: new Date().toISOString() }
          : order
      )
    );
    
    toast({
      title: "Order status updated",
      description: `Order #${orderId} has been updated to "${status.replace('_', ' ')}".`,
    });
  };

  // Filter orders by status
  const filteredOrders = orders.filter((order) => order.status === selectedTab);

  // Get table and location info for each order
  const orderDetails = filteredOrders.map((order) => {
    const table = cafeData.tables.find((t) => t.id === order.tableId);
    const location = cafeData.locations.find((l) => l.id === order.locationId);
    
    return {
      ...order,
      tableName: table?.name || "Unknown Table",
      locationName: location?.name || "Unknown Location",
    };
  });

  return (
    <DashboardLayout title="Orders Dashboard">
      <div className="mb-6">
        <p className="text-muted-foreground">
          Monitor and manage all orders from your café.
        </p>
      </div>

      <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as OrderStatus)}>
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="new" className="relative">
            New
            <span className="absolute top-0 -right-1 bg-blue-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
              {orders.filter(o => o.status === "new").length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="in_progress" className="relative">
            In Progress
            <span className="absolute top-0 -right-1 bg-yellow-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
              {orders.filter(o => o.status === "in_progress").length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="served" className="relative">
            Served
            <span className="absolute top-0 -right-1 bg-green-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
              {orders.filter(o => o.status === "served").length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="paid" className="relative">
            Paid
            <span className="absolute top-0 -right-1 bg-gray-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
              {orders.filter(o => o.status === "paid").length}
            </span>
          </TabsTrigger>
        </TabsList>

        {["new", "in_progress", "served", "paid"].map((status) => (
          <TabsContent key={status} value={status} className="space-y-4">
            {orderDetails.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <p className="text-muted-foreground">No {status.replace('_', ' ')} orders at the moment.</p>
              </div>
            ) : (
              orderDetails.map((order) => (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="bg-gray-50 py-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-lg">{order.tableName}</CardTitle>
                        <p className="text-sm text-muted-foreground">{order.locationName}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${order.total.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Items</h3>
                      <div className="space-y-3">
                        {order.items.map((item) => {
                          // Find the menu item to get imageUrl
                          const menuItem = cafeData.menuItems.find(mi => mi.id === item.menuItemId);
                          
                          return (
                            <div key={item.id} className="flex items-start space-x-3 py-2 border-b border-gray-100 last:border-b-0">
                              {/* Photo */}
                              <div className="flex-shrink-0">
                                <MenuItemImage imageUrl={menuItem?.imageUrl} itemName={item.name} />
                              </div>
                              
                              {/* Item details */}
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                      <span className="font-medium text-gray-900">{item.quantity}x</span>
                                      <span className="text-gray-900">{item.name}</span>
                                    </div>
                                    {item.selectedOptions && item.selectedOptions.length > 0 && (
                                      <ul className="text-sm text-muted-foreground mt-1">
                                        {item.selectedOptions.map((option, index) => (
                                          <li key={index}>
                                            {option.name}: {option.option}
                                            {option.price > 0 && ` (+$${option.price.toFixed(2)})`}
                                          </li>
                                        ))}
                                      </ul>
                                    )}
                                  </div>
                                  <div className="text-right ml-4">
                                    <div className="font-medium text-gray-900">
                                      ${(item.price * item.quantity).toFixed(2)}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      <div className="border-t pt-4 flex justify-between font-bold">
                        <span>Total</span>
                        <span>${order.total.toFixed(2)}</span>
                      </div>
                      
                      <div className="border-t pt-4 flex justify-end space-x-2">
                        {order.status === "new" && (
                          <Button onClick={() => updateOrderStatus(order.id, "in_progress")}>
                            Start Preparing
                          </Button>
                        )}
                        {order.status === "in_progress" && (
                          <Button onClick={() => updateOrderStatus(order.id, "served")}>
                            Mark as Served
                          </Button>
                        )}
                        {order.status === "served" && (
                          <Button onClick={() => updateOrderStatus(order.id, "paid")}>
                            Mark as Paid
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        ))}
      </Tabs>
    </DashboardLayout>
  );
};

export default OrdersDashboard;
