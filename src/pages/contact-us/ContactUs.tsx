import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactUs() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      <div className="text-center mb-12 space-y-2">
        <h1 className="text-4xl font-bold">تماس با ما</h1>
        <p className="text-muted-foreground">
          برای سوالات، پیشنهادات یا پشتیبانی با ما در ارتباط باشید
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* فرم */}
        <Card className="p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-2">ارسال پیام</h2>
          <p className="text-sm text-muted-foreground mb-6">
            فرم زیر را پر کنید تا در سریع‌ترین زمان پاسخ دهیم
          </p>

          <form className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium">نام و نام خانوادگی</label>
              <Input placeholder="نام خود را وارد کنید" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">ایمیل</label>
              <Input type="email" placeholder="example@email.com" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">موضوع</label>
              <Input placeholder="موضوع پیام" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">پیام</label>
              <textarea
                placeholder="متن پیام شما..."
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              />
            </div>

            <Button type="submit" className="w-full">
              ارسال پیام
            </Button>
          </form>
        </Card>

        {/* اطلاعات تماس */}
        <div className="space-y-6">
          <Card className="p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <Mail className="text-primary w-5 h-5" />
              <div>
                <p className="font-medium">ایمیل</p>
                <p className="text-sm text-muted-foreground">
                  support@example.com
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <Phone className="text-primary w-5 h-5" />
              <div>
                <p className="font-medium">تلفن</p>
                <p className="text-sm text-muted-foreground">021-12345678</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <MapPin className="text-primary w-5 h-5" />
              <div>
                <p className="font-medium">آدرس</p>
                <p className="text-sm text-muted-foreground">
                  تهران، ایران
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
