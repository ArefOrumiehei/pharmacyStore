import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export default function FAQ() {
  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">سوالات متداول</h1>
      <Accordion type="single" collapsible className="space-y-2">
        <AccordionItem value="q1">
          <AccordionTrigger>سوال اول: چگونه ثبت نام کنم؟</AccordionTrigger>
          <AccordionContent>
            خیلی ساده است! کافی است روی دکمه ثبت نام کلیک کنید و فرم را تکمیل کنید.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="q2">
          <AccordionTrigger>سوال دوم: پشتیبانی چگونه است؟</AccordionTrigger>
          <AccordionContent>
            تیم پشتیبانی ما ۲۴ ساعته آماده پاسخگویی به شماست.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="q3">
          <AccordionTrigger>سوال سوم: روش پرداخت چیست؟</AccordionTrigger>
          <AccordionContent>
            پرداخت آنلاین و امن با کارت‌های بانکی امکان‌پذیر است.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
