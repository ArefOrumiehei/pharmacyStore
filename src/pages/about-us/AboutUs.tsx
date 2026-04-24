import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Heart, Users, Award, ShieldCheck } from "lucide-react";

export default function AboutUs() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      <div className="text-center mb-12 space-y-2">
        <h1 className="text-4xl font-bold">درباره ما</h1>
        <p className="text-muted-foreground">
          داروخانه آنلاین شما، همراه مطمئن در مسیر سلامتی
        </p>
      </div>

      <Card className="shadow-sm mb-8">
        <CardHeader>
          <h2 className="text-2xl font-semibold">ماموریت ما</h2>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            ما با هدف تسهیل دسترسی به داروها و محصولات بهداشتی با کیفیت، خدمات
            داروخانه آنلاین را با بالاترین استانداردها ارائه می‌دهیم. تلاش ما این
            است که شما بتوانید با اطمینان کامل، نیازهای دارویی خود را در کمترین
            زمان و با بهترین قیمت تامین کنید.
          </p>
          <p>
            تیم ما متشکل از داروسازان مجرب، متخصصان فناوری اطلاعات و کارشناسان
            خدمات مشتری است که با تعهد و دقت، در خدمت سلامت شما هستند.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm text-center p-6">
          <Heart className="w-10 h-10 mx-auto mb-4 text-primary" />
          <h3 className="font-semibold mb-2">سلامت شما، اولویت ما</h3>
          <p className="text-sm text-muted-foreground">
            ارائه محصولات اصل و مرغوب با مجوزهای معتبر
          </p>
        </Card>

        <Card className="shadow-sm text-center p-6">
          <ShieldCheck className="w-10 h-10 mx-auto mb-4 text-primary" />
          <h3 className="font-semibold mb-2">تضمین اصالت</h3>
          <p className="text-sm text-muted-foreground">
            تمامی محصولات دارای مجوز از وزارت بهداشت
          </p>
        </Card>

        <Card className="shadow-sm text-center p-6">
          <Users className="w-10 h-10 mx-auto mb-4 text-primary" />
          <h3 className="font-semibold mb-2">مشاوره تخصصی</h3>
          <p className="text-sm text-muted-foreground">
            پشتیبانی ۲۴ ساعته توسط داروسازان مجرب
          </p>
        </Card>

        <Card className="shadow-sm text-center p-6">
          <Award className="w-10 h-10 mx-auto mb-4 text-primary" />
          <h3 className="font-semibold mb-2">تحویل سریع</h3>
          <p className="text-sm text-muted-foreground">
            ارسال فوری و ایمن به سراسر کشور
          </p>
        </Card>
      </div>
    </div>
  );
}
