// src/pages/profile/settings/Settings.tsx
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Settings() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">تنظیمات</h1>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">تغییر رمز عبور</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              رمز عبور فعلی
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">
              رمز عبور جدید
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">
              تکرار رمز عبور جدید
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <Button>ذخیره تغییرات</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">تنظیمات اعلان‌ها</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4" />
            <span>اعلان‌های سفارش</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4" />
            <span>اعلان‌های تخفیف و پیشنهادات</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-4 h-4" />
            <span>خبرنامه ایمیلی</span>
          </label>
        </CardContent>
      </Card>
    </div>
  );
}
