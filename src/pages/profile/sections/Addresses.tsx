// src/pages/profile/addresses/Addresses.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Plus, Edit, Trash2 } from "lucide-react";

export default function Addresses() {
  const addresses = [
    {
      id: 1,
      title: "منزل",
      address: "تهران، خیابان ولیعصر، پلاک 123",
      postalCode: "1234567890",
      receiver: "علی احمدی",
      phone: "09123456789",
      isDefault: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">آدرس‌های من</h1>
        <Button>
          <Plus className="w-4 h-4 ml-2" />
          افزودن آدرس جدید
        </Button>
      </div>

      {addresses.length === 0 ? (
        <Card className="p-12 text-center">
          <MapPin className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground mb-4">آدرسی ثبت نشده است</p>
          <Button>
            <Plus className="w-4 h-4 ml-2" />
            افزودن آدرس
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {addresses.map((addr) => (
            <Card key={addr.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold">{addr.title}</h3>
                  {addr.isDefault && (
                    <span className="px-2 py-1 rounded text-xs bg-primary/10 text-primary">
                      پیش‌فرض
                    </span>
                  )}
                </div>
                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <p>{addr.address}</p>
                  <p>کد پستی: {addr.postalCode}</p>
                  <p>گیرنده: {addr.receiver}</p>
                  <p>تلفن: {addr.phone}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="w-4 h-4 ml-2" />
                    ویرایش
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
