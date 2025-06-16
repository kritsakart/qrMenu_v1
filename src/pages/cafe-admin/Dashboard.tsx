import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCafeOwnerData } from "@/data/mockData";
import { QRCodeSVG } from "qrcode.react";

const CafeAdminDashboard = () => {
  const { user } = useAuth();
  const cafeId = user?.cafeId || "cafe-1";
  const data = getCafeOwnerData(cafeId);
  const navigate = useNavigate();

  // Count orders by status
  const orderCounts = {
    new: data.orders.filter(order => order.status === "new").length,
    in_progress: data.orders.filter(order => order.status === "in_progress").length,
    served: data.orders.filter(order => order.status === "served").length,
    total: data.orders.length
  };

  return (
    <DashboardLayout title="Café Dashboard">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="cursor-pointer hover:shadow-md" onClick={() => navigate("/cafe-admin/locations")}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.locations.length}</div>
            <p className="text-xs text-muted-foreground pt-1">
              Total locations
            </p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md" onClick={() => navigate("/cafe-admin/menu")}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Menu Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.menuItems.length}</div>
            <p className="text-xs text-muted-foreground pt-1">
              Total menu items
            </p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md" onClick={() => navigate("/cafe-admin/orders")}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Active Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-500">
              {orderCounts.new + orderCounts.in_progress}
            </div>
            <p className="text-xs text-muted-foreground pt-1">
              New: {orderCounts.new} | In Progress: {orderCounts.in_progress}
            </p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md" onClick={() => navigate("/cafe-admin/orders")}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Today's Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{orderCounts.total}</div>
            <p className="text-xs text-muted-foreground pt-1">
              Total orders today
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Table</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.orders.slice(0, 5).map((order) => {
                    const table = data.tables.find(t => t.id === order.tableId);
                    const location = data.locations.find(l => l.id === order.locationId);
                    
                    return (
                      <tr
                        key={order.id}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => navigate("/cafe-admin/orders")}
                      >
                        <td className="px-4 py-4 whitespace-nowrap">
                          {table?.name} ({location?.name})
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {order.items.length} items
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          ${order.total.toFixed(2)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            order.status === "new" 
                              ? "bg-blue-100 text-blue-800" 
                              : order.status === "in_progress"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                          }`}>
                            {order.status.replace("_", " ")}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Access QR Codes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {data.tables.slice(0, 6).map((table) => {
                const location = data.locations.find(l => l.id === table.locationId);
                return (
                  <div key={table.id} className="flex flex-col items-center p-2 border rounded-lg">
                    <div className="bg-white p-1 rounded-lg">
                      <QRCodeSVG 
                        value={`${window.location.origin}/menu/${location?.id}/${table.id}`} 
                        size={100}
                        bgColor={"#ffffff"}
                        fgColor={"#000000"}
                        level={"L"}
                        includeMargin={false}
                      />
                    </div>
                    <div className="mt-2 text-center">
                      <div className="font-semibold text-sm">{table.name}</div>
                      <div className="text-xs text-muted-foreground">{location?.name}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CafeAdminDashboard;
