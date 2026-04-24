import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function Terms() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold">قوانین و مقررات</h1>
        <p className="text-muted-foreground mt-2">
          لطفاً پیش از استفاده از خدمات، این قوانین را مطالعه نمایید.
        </p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>شرایط استفاده از خدمات</CardTitle>
        </CardHeader>

        <Separator />

        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>1. قوانین عمومی</AccordionTrigger>
              <AccordionContent>
                <p className="leading-7">
                  با ثبت‌نام و استفاده از خدمات این سایت، شما موافقت خود را با
                  تمامی قوانین و مقررات اعلام می‌کنید. استفاده از هر بخش از
                  خدمات به معنای پذیرش کامل این شرایط است. در صورت عدم موافقت با
                  هر یک از بندهای این قوانین، از استفاده از خدمات خودداری نمایید.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>2. شرایط ثبت‌نام و حساب کاربری</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 leading-7">
                  <p>
                    برای استفاده از خدمات، ثبت‌نام و ایجاد حساب کاربری الزامی
                    است. اطلاعات ثبت شده باید دقیق، کامل و به‌روز باشد.
                  </p>
                  <p>
                    شما مسئول حفظ امنیت رمز عبور و تمامی فعالیت‌های انجام شده از
                    طریق حساب کاربری خود هستید.
                  </p>
                  <p>
                    در صورت مشاهده هرگونه استفاده غیرمجاز از حساب خود، بلافاصله
                    به ما اطلاع دهید.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>3. شرایط ثبت سفارش</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 leading-7">
                  <p>
                    ثبت سفارش به منزله انعقاد قرارداد خرید می‌باشد. اطلاعات ثبت
                    شده توسط شما باید دقیق و کامل باشد.
                  </p>
                  <p>
                    مسئولیت هرگونه خطا در اطلاعات آدرس، شماره تماس یا سایر
                    جزئیات بر عهده کاربر است.
                  </p>
                  <p>
                    سایت حق دارد در صورت مشاهده هرگونه تخلف یا سوء استفاده،
                    سفارش را لغو کند.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>4. قیمت‌ها و موجودی</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 leading-7">
                  <p>
                    تمامی قیمت‌های نمایش داده شده به تومان بوده و شامل مالیات بر
                    ارزش افزوده می‌باشد.
                  </p>
                  <p>
                    سایت حق تغییر قیمت‌ها را بدون اطلاع قبلی محفوظ می‌دارد، اما
                    قیمت سفارشات ثبت شده تغییر نخواهد کرد.
                  </p>
                  <p>
                    در صورت عدم موجودی محصول، سایت متعهد به اطلاع‌رسانی و
                    بازگشت وجه یا ارائه جایگزین مناسب است.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>5. پرداخت و بازگشت وجه</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 leading-7">
                  <p>
                    تمامی پرداخت‌ها از طریق درگاه‌های امن بانکی معتبر انجام
                    می‌شود.
                  </p>
                  <p>
                    در صورت بروز مشکل در پرداخت یا کسر مبلغ بدون تکمیل سفارش،
                    وجه ظرف ۷۲ ساعت به حساب شما بازگردانده می‌شود.
                  </p>
                  <p>
                    درخواست بازگشت وجه پس از تحویل کالا، مطابق با قوانین حمایت
                    از مصرف‌کننده و شرایط هر محصول بررسی خواهد شد.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger>6. ارسال و تحویل</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 leading-7">
                  <p>
                    زمان ارسال بسته به موقعیت جغرافیایی و نوع محصول متفاوت است
                    و در صفحه محصول قید شده است.
                  </p>
                  <p>
                    مسئولیت تحویل کالا تا درب منزل بر عهده سایت است. پس از
                    تحویل، مسئولیت نگهداری با خریدار خواهد بود.
                  </p>
                  <p>
                    در صورت عدم حضور در زمان تحویل، با شماره تماس ثبت شده
                    هماهنگی انجام خواهد شد.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7">
              <AccordionTrigger>7. ضمانت و گارانتی</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 leading-7">
                  <p>
                    تمامی محصولات دارای گارانتی معتبر بوده و اصالت کالا تضمین
                    می‌شود.
                  </p>
                  <p>
                    شرایط گارانتی هر محصول در صفحه مربوطه قید شده و باید توسط
                    خریدار رعایت شود.
                  </p>
                  <p>
                    در صورت وجود مشکل در محصول، می‌توانید ظرف مدت مشخص شده
                    درخواست مرجوعی یا تعویض ارسال کنید.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8">
              <AccordionTrigger>8. حریم خصوصی</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 leading-7">
                  <p>
                    اطلاعات شخصی شما نزد ما محفوظ بوده و صرفاً جهت ارائه خدمات
                    بهتر استفاده می‌شود.
                  </p>
                  <p>
                    اطلاعات شخصی کاربران بدون رضایت آن‌ها در اختیار اشخاص ثالث
                    قرار نخواهد گرفت.
                  </p>
                  <p>
                    برای اطلاعات بیشتر، سیاست حریم خصوصی ما را مطالعه نمایید.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-9">
              <AccordionTrigger>9. مسئولیت‌ها و محدودیت‌ها</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 leading-7">
                  <p>
                    سایت هیچ‌گونه مسئولیتی در قبال سوء استفاده از حساب کاربری
                    ناشی از عدم رعایت امنیت رمز عبور ندارد.
                  </p>
                  <p>
                    مسئولیت استفاده صحیح از محصولات و رعایت دستورالعمل‌ها بر
                    عهده خریدار است.
                  </p>
                  <p>
                    سایت در قبال خسارات غیرمستقیم ناشی از استفاده یا عدم
                    استفاده از خدمات مسئولیتی ندارد.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-10">
              <AccordionTrigger>10. تغییرات در قوانین</AccordionTrigger>
              <AccordionContent>
                <p className="leading-7">
                  سایت حق دارد این قوانین را در هر زمان بدون اطلاع قبلی
                  به‌روزرسانی کند. استفاده مستمر از خدمات پس از اعمال تغییرات،
                  به منزله پذیرش قوانین جدید است. توصیه می‌شود این صفحه را
                  به‌طور دوره‌ای بررسی کنید.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-11">
              <AccordionTrigger>11. قوانین حاکم و حل اختلاف</AccordionTrigger>
              <AccordionContent>
                <p className="leading-7">
                  این قوانین تابع قوانین جمهوری اسلامی ایران است. در صورت بروز
                  هرگونه اختلاف، مراجع قضایی صالح کشور رسیدگی خواهند کرد. برای
                  حل سریع‌تر مسائل، توصیه می‌شود ابتدا با پشتیبانی سایت تماس
                  بگیرید.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground mt-6 text-center">
        آخرین بروزرسانی: ۱۴۰۵/۰۱/۰۱
      </div>
    </div>
  )
}
