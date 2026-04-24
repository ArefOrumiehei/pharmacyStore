// src/pages/profile/orders/Orders.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Eye } from "lucide-react";

export default function Orders() {
  const orders = [
    {
      id: "ORD-1001",
      date: "1403/02/01",
      status: "تحویل شده",
      total: "450,000",
      items: 3,
    },
    {
      id: "ORD-1002",
      date: "1403/01/28",
      status: "در حال ارسال",
      total: "280,000",
      items: 2,
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">سفارش‌های من</h1>

      {orders.length === 0 ? (
        <Card className="p-12 text-center">
          <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">هنوز سفارشی ثبت نکرده‌اید</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="space-y-1">
                    <p className="font-semibold">سفارش {order.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.date} • {order.items} محصول
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-left">
                      <p className="text-sm text-muted-foreground">مبلغ کل</p>
                      <p className="font-semibold">{order.total} تومان</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-sm bg-primary/10 text-primary">
                      {order.status}
                    </span>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 ml-2" />
                      جزئیات
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
