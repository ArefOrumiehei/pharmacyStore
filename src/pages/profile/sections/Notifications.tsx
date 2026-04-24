// src/pages/profile/notifications/Notifications.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Bell, Package, Tag, Info } from "lucide-react";

export default function Notifications() {
  const notifications = [
    {
      id: 1,
      type: "order",
      title: "سفارش شما ارسال شد",
      message: "سفارش ORD-1002 با موفقیت ارسال شد",
      time: "2 ساعت پیش",
      read: false,
    },
    {
      id: 2,
      type: "offer",
      title: "تخفیف ویژه",
      message: "20% تخفیف برای محصولات بهداشتی",
      time: "1 روز پیش",
      read: true,
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "order":
        return Package;
      case "offer":
        return Tag;
      default:
        return Info;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">اعلان‌ها</h1>

      {notifications.length === 0 ? (
        <Card className="p-12 text-center">
          <Bell className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">اعلانی وجود ندارد</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => {
            const Icon = getIcon(notif.type);
            return (
              <Card
                key={notif.id}
                className={notif.read ? "opacity-60" : ""}
              >
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{notif.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {notif.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {notif.time}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
