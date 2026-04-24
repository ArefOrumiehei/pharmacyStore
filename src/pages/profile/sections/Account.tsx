// src/pages/profile/account/Account.tsx
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

export default function Account() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">اطلاعات حساب کاربری</h1>
        <Button variant="outline" size="sm">
          <Edit className="w-4 h-4 ml-2" />
          ویرایش
        </Button>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">اطلاعات شخصی</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm text-muted-foreground">نام</label>
              <p className="font-medium mt-1">علی</p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">نام خانوادگی</label>
              <p className="font-medium mt-1">احمدی</p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">شماره موبایل</label>
              <p className="font-medium mt-1">09123456789</p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">ایمیل</label>
              <p className="font-medium mt-1">ali@example.com</p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">کد ملی</label>
              <p className="font-medium mt-1">1234567890</p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">تاریخ تولد</label>
              <p className="font-medium mt-1">1370/05/15</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
