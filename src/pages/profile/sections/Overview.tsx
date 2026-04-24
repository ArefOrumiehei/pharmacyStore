// src/pages/profile/Overview.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Heart, MapPin, Bell, ShoppingBag, TrendingUp } from "lucide-react";
import { Link } from "react-router";

export default function Overview() {
  // داده‌های نمونه
  const stats = [
    { label: "سفارش‌های فعال", value: "2", icon: Package, link: "/profile/orders" },
    { label: "علاقه‌مندی‌ها", value: "8", icon: Heart, link: "/profile/favorites" },
    { label: "آدرس‌ها", value: "3", icon: MapPin, link: "/profile/addresses" },
    { label: "اعلان‌های جدید", value: "5", icon: Bell, link: "/profile/notifications" },
  ];

  const recentOrders = [
    { id: "#12345", date: "1403/02/01", status: "در حال ارسال", total: "450,000" },
    { id: "#12344", date: "1403/01/28", status: "تحویل شده", total: "280,000" },
  ];

  return (
    <div className="space-y-6">
      {/* خوش‌آمدگویی */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-2">خوش آمدید، علی محمدی</h2>
          <p className="text-muted-foreground">
            از پنل کاربری خود می‌توانید سفارش‌ها، آدرس‌ها و اطلاعات حساب خود را مدیریت کنید.
          </p>
        </CardContent>
      </Card>

      {/* آمار کلی */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link key={stat.label} to={stat.link}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className="w-10 h-10 text-primary opacity-80" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* سفارش‌های اخیر */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              سفارش‌های اخیر
            </CardTitle>
            <Link to="/profile/orders">
              <Button variant="ghost" size="sm">
                مشاهده همه
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-4">
                  <Package className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-muted-foreground">{order.date}</p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium">{order.status}</p>
                  <p className="text-sm text-muted-foreground">{order.total} تومان</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* پیشنهادات */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            پیشنهاد ویژه برای شما
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-l from-primary/10 to-primary/5 p-6 rounded-lg">
            <h3 className="font-bold text-lg mb-2">تخفیف ویژه محصولات سلامت</h3>
            <p className="text-muted-foreground mb-4">
              تا ۳۰٪ تخفیف روی محصولات منتخب سلامت و بهداشت
            </p>
            <Button>مشاهده محصولات</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
