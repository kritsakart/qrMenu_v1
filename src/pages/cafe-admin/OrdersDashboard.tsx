
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Order, OrderStatus } from "@/types/models";
import { getCafeOwnerData } from "@/data/mockData";

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
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between">
                            <div>
                              <span className="font-medium">{item.quantity}x </span>
                              <span>{item.name}</span>
                              {item.selectedOptions && item.selectedOptions.length > 0 && (
                                <ul className="text-sm text-muted-foreground ml-6 mt-1">
                                  {item.selectedOptions.map((option, index) => (
                                    <li key={index}>
                                      {option.name}: {option.option}
                                      {option.price > 0 && ` (+$${option.price.toFixed(2)})`}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                            <div className="text-right">
                              ${(item.price * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        ))}
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
