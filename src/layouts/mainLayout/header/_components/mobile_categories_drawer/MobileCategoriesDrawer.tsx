import { useState, useEffect } from "react";
import { Link } from "react-router";
import { IconX, IconChevronLeft, IconChevronDown } from "@tabler/icons-react";

const categories = [
  {
    name: "داروها",
    href: "/products/medications",
    icon: "💊",
    subcategories: [
      {
        name: "مسکن و ضد التهاب",
        href: "/products/medications/painkillers",
        desc: "ایبوپروفن، استامینوفن و ...",
        items: [
          { name: "ایبوپروفن ۴۰۰mg", href: "/products/medications/painkillers/ibuprofen-400", desc: "ضد درد و تب" },
          { name: "استامینوفن کدئین", href: "/products/medications/painkillers/acetaminophen", desc: "مسکن قوی" },
          { name: "دیکلوفناک موضعی", href: "/products/medications/painkillers/diclofenac", desc: "ژل ضد التهاب" },
          { name: "ناپروکسن ۵۰۰mg", href: "/products/medications/painkillers/naproxen", desc: "ضد التهاب غیر استروئیدی" },
        ],
      },
      {
        name: "داروهای گوارشی",
        href: "/products/medications/digestive",
        desc: "سلامت معده و روده",
        items: [
          { name: "امپرازول ۲۰mg", href: "/products/medications/digestive/omeprazole", desc: "ضد اسید معده" },
          { name: "متوکلوپرامید", href: "/products/medications/digestive/metoclopramide", desc: "ضد تهوع" },
          { name: "قرص سیمتیکون", href: "/products/medications/digestive/simethicone", desc: "ضد نفخ" },
          { name: "بیزاکودیل", href: "/products/medications/digestive/bisacodyl", desc: "ملین ملایم" },
        ],
      },
      {
        name: "داروهای قلبی",
        href: "/products/medications/cardiac",
        desc: "کنترل فشار و کلسترول",
        items: [
          { name: "آتورواستاتین", href: "/products/medications/cardiac/atorvastatin", desc: "کاهش کلسترول" },
          { name: "آملودیپین ۵mg", href: "/products/medications/cardiac/amlodipine", desc: "کنترل فشار خون" },
          { name: "لوزارتان", href: "/products/medications/cardiac/losartan", desc: "ضد فشار خون" },
          { name: "آسپرین ۸۰mg", href: "/products/medications/cardiac/aspirin-80", desc: "رقیق‌کننده خون" },
        ],
      },
    ],
  },
  {
    name: "ویتامین و مکمل",
    href: "/products/supplements",
    icon: "🌿",
    subcategories: [
      {
        name: "ویتامین‌ها",
        href: "/products/supplements/vitamins",
        desc: "ویتامین D، C، B12 و ...",
        items: [
          { name: "ویتامین D3 1000IU", href: "/products/supplements/vitamins/d3", desc: "تقویت استخوان" },
          { name: "ویتامین C 1000mg", href: "/products/supplements/vitamins/c", desc: "تقویت ایمنی" },
          { name: "ویتامین B12", href: "/products/supplements/vitamins/b12", desc: "سلامت اعصاب" },
          { name: "مولتی ویتامین", href: "/products/supplements/vitamins/multi", desc: "ترکیب کامل ویتامین‌ها" },
        ],
      },
      {
        name: "مینرال‌ها",
        href: "/products/supplements/minerals",
        desc: "آهن، کلسیم، منیزیم",
        items: [
          { name: "کلسیم + D3", href: "/products/supplements/minerals/calcium", desc: "سلامت استخوان" },
          { name: "آهن ۳۰mg", href: "/products/supplements/minerals/iron", desc: "درمان کم‌خونی" },
          { name: "منیزیم ۲۵۰mg", href: "/products/supplements/minerals/magnesium", desc: "آرامش عضلات" },
          { name: "روی (زینک) ۱۵mg", href: "/products/supplements/minerals/zinc", desc: "تقویت ایمنی" },
        ],
      },
    ],
  },
  {
    name: "مراقبت پوست",
    href: "/products/skincare",
    icon: "✨",
    subcategories: [
      {
        name: "کرم مرطوب‌کننده",
        href: "/products/skincare/moisturizer",
        desc: "مراقبت روزانه پوست",
        items: [
          { name: "کرم سریلن", href: "/products/skincare/moisturizer/cerave", desc: "پوست خشک و حساس" },
          { name: "لوسیون یوریا ۱۰٪", href: "/products/skincare/moisturizer/urea", desc: "پوست خیلی خشک" },
          { name: "ژل آلوئه‌ورا", href: "/products/skincare/moisturizer/aloe", desc: "آبرسان طبیعی" },
        ],
      },
      {
        name: "ضد آفتاب",
        href: "/products/skincare/sunscreen",
        desc: "SPF 30 تا SPF 100",
        items: [
          { name: "ضد آفتاب SPF50 بی‌رنگ", href: "/products/skincare/sunscreen/spf50-clear", desc: "روزانه بدون رنگ" },
          { name: "ضد آفتاب رنگی SPF50", href: "/products/skincare/sunscreen/spf50-tinted", desc: "پوشش یکنواخت" },
          { name: "اسپری ضد آفتاب", href: "/products/skincare/sunscreen/spray", desc: "استفاده آسان" },
        ],
      },
    ],
  },
  {
    name: "مراقبت مو",
    href: "/products/haircare",
    icon: "💆",
    subcategories: [
      {
        name: "شامپو درمانی",
        href: "/products/haircare/shampoo",
        desc: "ضد ریزش، ضد شوره",
        items: [
          { name: "شامپو ضد ریزش بایوتین", href: "/products/haircare/shampoo/biotin", desc: "تقویت فولیکول مو" },
          { name: "شامپو ضد شوره زینک", href: "/products/haircare/shampoo/zinc", desc: "کنترل شوره سر" },
        ],
      },
    ],
  },
  {
    name: "بهداشت دهان",
    href: "/products/oral",
    icon: "🦷",
    subcategories: [
      {
        name: "خمیردندان",
        href: "/products/oral/toothpaste",
        desc: "سفید‌کننده، ضد حساسیت",
        items: [
          { name: "خمیردندان سنسوداین", href: "/products/oral/toothpaste/sensodyne", desc: "ضد حساسیت دندان" },
          { name: "خمیردندان کلگیت", href: "/products/oral/toothpaste/colgate", desc: "سفیدکننده و ضدعفونی" },
        ],
      },
    ],
  },
  {
    name: "مادر و کودک",
    href: "/products/mother-baby",
    icon: "👶",
    subcategories: [
      {
        name: "شیر خشک",
        href: "/products/mother-baby/formula",
        desc: "انواع شیر خشک نوزاد",
        items: [
          { name: "شیر خشک نان ۱", href: "/products/mother-baby/formula/nan-1", desc: "۰ تا ۶ ماه" },
          { name: "شیر خشک هیپ ارگانیک", href: "/products/mother-baby/formula/hipp-organic", desc: "فرمول ارگانیک" },
        ],
      },
    ],
  },
  {
    name: "تجهیزات پزشکی",
    href: "/products/medical-equipment",
    icon: "🩺",
    subcategories: [
      {
        name: "فشارسنج",
        href: "/products/medical-equipment/blood-pressure",
        desc: "دیجیتال و بازویی",
        items: [
          { name: "فشارسنج بازویی امرون", href: "/products/medical-equipment/blood-pressure/omron", desc: "دقت پزشکی" },
          { name: "فشارسنج مچی", href: "/products/medical-equipment/blood-pressure/wrist", desc: "قابل‌حمل" },
        ],
      },
    ],
  },
];

interface MobileCategoriesDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileCategoriesDrawer({ open, onClose }: MobileCategoriesDrawerProps) {
  const [openCat, setOpenCat] = useState<number | null>(null);
  const [openSub, setOpenSub] = useState<number | null>(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Reset state when closed
  useEffect(() => {
    if (!open) { setOpenCat(null); setOpenSub(null); }
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer — full height, from right, sits above bottom bar (pb-20) */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-[85vw] max-w-sm bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-blue-50 flex-shrink-0 bg-blue-800">
          <h2 className="text-base font-bold text-white">دسته‌بندی محصولات</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
          >
            <IconX size={20} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto pb-24">
          {categories.map((cat, ci) => (
            <div key={cat.href} className="border-b border-blue-50 last:border-0">

              {/* Category row */}
              <button
                onClick={() => { setOpenCat(openCat === ci ? null : ci); setOpenSub(null); }}
                className={`w-full flex items-center justify-between gap-3 px-5 py-4 transition-colors duration-150 ${
                  openCat === ci ? "bg-blue-50" : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{cat.icon}</span>
                  <span className={`text-sm font-semibold ${openCat === ci ? "text-blue-800" : "text-gray-700"}`}>
                    {cat.name}
                  </span>
                </div>
                <IconChevronDown
                  size={16}
                  className={`text-blue-300 transition-transform duration-200 flex-shrink-0 ${
                    openCat === ci ? "rotate-180 text-blue-800" : ""
                  }`}
                />
              </button>

              {/* Subcategories accordion */}
              {openCat === ci && (
                <div className="bg-blue-50/50">
                  {/* View all link */}
                  <Link
                    to={cat.href}
                    onClick={onClose}
                    className="flex items-center justify-between px-5 py-2.5 text-xs font-bold text-blue-800 hover:bg-blue-100 transition-colors border-b border-blue-100"
                  >
                    <span>مشاهده همه {cat.name}</span>
                    <IconChevronLeft size={13} />
                  </Link>

                  {cat.subcategories.map((sub, si) => (
                    <div key={sub.href}>
                      {/* Subcategory row */}
                      <button
                        onClick={() => setOpenSub(openSub === si ? null : si)}
                        className={`w-full flex items-center justify-between gap-2 px-5 py-3 transition-colors duration-150 ${
                          openSub === si ? "bg-white" : "hover:bg-blue-50"
                        }`}
                      >
                        <div className="flex flex-col items-start text-right min-w-0">
                          <span className={`text-sm font-medium ${openSub === si ? "text-blue-800" : "text-gray-600"}`}>
                            {sub.name}
                          </span>
                          <span className="text-xs text-gray-400 mt-0.5 truncate">{sub.desc}</span>
                        </div>
                        <IconChevronDown
                          size={14}
                          className={`text-gray-300 flex-shrink-0 transition-transform duration-200 ${
                            openSub === si ? "rotate-180 text-blue-800" : ""
                          }`}
                        />
                      </button>

                      {/* Items list */}
                      {openSub === si && (
                        <div className="bg-white border-t border-blue-50 pb-1">
                          {sub.items.map((item) => (
                            <Link
                              key={item.href}
                              to={item.href}
                              onClick={onClose}
                              className="flex items-center justify-between px-6 py-2.5 hover:bg-blue-50 transition-colors group"
                            >
                              <div className="flex flex-col min-w-0">
                                <span className="text-sm text-gray-700 group-hover:text-blue-800 font-medium transition-colors truncate">
                                  {item.name}
                                </span>
                                <span className="text-xs text-gray-400">{item.desc}</span>
                              </div>
                              <IconChevronLeft size={13} className="text-gray-300 flex-shrink-0" />
                            </Link>
                          ))}
                          <Link
                            to={sub.href}
                            onClick={onClose}
                            className="flex items-center gap-1 mx-6 mt-1 mb-2 text-xs font-bold text-blue-800 hover:text-blue-600 transition-colors"
                          >
                            مشاهده همه
                            <IconChevronLeft size={11} />
                          </Link>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}