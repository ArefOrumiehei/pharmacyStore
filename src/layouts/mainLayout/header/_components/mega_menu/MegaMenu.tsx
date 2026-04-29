import { ArrowLeft, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

const categories = [
  {
    name: "داروها",
    href: "/products/medications",
    icon: "💊",
    subcategories: [
      { name: "مسکن و ضد التهاب", href: "/products/medications/painkillers", desc: "ایبوپروفن، استامینوفن و ..." },
      { name: "داروهای گوارشی", href: "/products/medications/digestive", desc: "سلامت معده و روده" },
      { name: "داروهای قلبی", href: "/products/medications/cardiac", desc: "کنترل فشار و کلسترول" },
      { name: "آنتی‌هیستامین", href: "/products/medications/antihistamine", desc: "درمان آلرژی و حساسیت" },
      { name: "داروهای تنفسی", href: "/products/medications/respiratory", desc: "آسم، سرفه و سرماخوردگی" },
    ],
  },
  {
    name: "ویتامین و مکمل",
    href: "/products/supplements",
    icon: "🌿",
    subcategories: [
      { name: "ویتامین‌ها", href: "/products/supplements/vitamins", desc: "ویتامین D، C، B12 و ..." },
      { name: "مینرال‌ها", href: "/products/supplements/minerals", desc: "آهن، کلسیم، منیزیم" },
      { name: "مکمل‌های ورزشی", href: "/products/supplements/sports", desc: "پروتئین، کراتین و BCAA" },
      { name: "امگا و روغن ماهی", href: "/products/supplements/omega", desc: "سلامت قلب و مغز" },
      { name: "پروبیوتیک", href: "/products/supplements/probiotics", desc: "تقویت سیستم گوارش" },
    ],
  },
  {
    name: "مراقبت پوست",
    href: "/products/skincare",
    icon: "✨",
    subcategories: [
      { name: "کرم مرطوب‌کننده", href: "/products/skincare/moisturizer", desc: "مراقبت روزانه پوست" },
      { name: "ضد آفتاب", href: "/products/skincare/sunscreen", desc: "SPF 30 تا SPF 100" },
      { name: "کرم‌های ضد جوش", href: "/products/skincare/acne", desc: "درمان و پیشگیری از آکنه" },
      { name: "سرم و آمپول", href: "/products/skincare/serum", desc: "مراقبت تخصصی پوست" },
      { name: "کرم دور چشم", href: "/products/skincare/eye-cream", desc: "کاهش خستگی و تیرگی" },
    ],
  },
  {
    name: "مراقبت مو",
    href: "/products/haircare",
    icon: "💆",
    subcategories: [
      { name: "شامپو درمانی", href: "/products/haircare/shampoo", desc: "ضد ریزش، ضد شوره" },
      { name: "نرم‌کننده و ماسک", href: "/products/haircare/conditioner", desc: "تغذیه و ترمیم مو" },
      { name: "سرم مو", href: "/products/haircare/serum", desc: "تقویت و براق‌کننده مو" },
      { name: "رنگ مو", href: "/products/haircare/color", desc: "رنگ‌های طبیعی و دائمی" },
      { name: "مکمل رشد مو", href: "/products/haircare/supplement", desc: "بیوتین و تقویت‌کننده" },
    ],
  },
  {
    name: "بهداشت دهان",
    href: "/products/oral",
    icon: "🦷",
    subcategories: [
      { name: "خمیردندان", href: "/products/oral/toothpaste", desc: "سفید‌کننده، ضد حساسیت" },
      { name: "مسواک", href: "/products/oral/toothbrush", desc: "مکانیکی و الکتریکی" },
      { name: "دهانشویه", href: "/products/oral/mouthwash", desc: "ضدعفونی و خوشبوکننده" },
      { name: "نخ دندان", href: "/products/oral/floss", desc: "بهداشت بین دندانی" },
      { name: "ژل درمانی لثه", href: "/products/oral/gum-gel", desc: "تسکین دردهای لثه" },
    ],
  },
  {
    name: "مادر و کودک",
    href: "/products/mother-baby",
    icon: "👶",
    subcategories: [
      { name: "شیر خشک", href: "/products/mother-baby/formula", desc: "انواع شیر خشک نوزاد" },
      { name: "پوشک و بهداشت", href: "/products/mother-baby/diapers", desc: "پوشک و دستمال مرطوب" },
      { name: "کرم پوست کودک", href: "/products/mother-baby/baby-cream", desc: "مراقبت پوست نوزاد" },
      { name: "مکمل کودک", href: "/products/mother-baby/supplement", desc: "ویتامین D، قطره آهن" },
      { name: "محصولات بارداری", href: "/products/mother-baby/pregnancy", desc: "مراقبت دوران بارداری" },
    ],
  },
  {
    name: "تجهیزات پزشکی",
    href: "/products/medical-equipment",
    icon: "🩺",
    subcategories: [
      { name: "فشارسنج", href: "/products/medical-equipment/blood-pressure", desc: "دیجیتال و بازویی" },
      { name: "گلوکومتر", href: "/products/medical-equipment/glucometer", desc: "اندازه‌گیری قند خون" },
      { name: "ترمومتر", href: "/products/medical-equipment/thermometer", desc: "تب‌سنج دیجیتال" },
      { name: "پالس اکسیمتر", href: "/products/medical-equipment/oximeter", desc: "اندازه‌گیری اکسیژن خون" },
      { name: "زانوبند و گردن‌بند", href: "/products/medical-equipment/brace", desc: "ارتوپدی و حمایتی" },
    ],
  },
];

function MegaMenu() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => {
        setIsOpen(false);
        setActiveIndex(0);
      }}
      
    >
      {/* Trigger button */}
      <button
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
          ${isOpen
            ? "bg-blue-300/20 text-white"
            : "text-white/90 hover:bg-blue-300/20 hover:text-white"
          }`}
      >
        <span>دسته‌بندی‌ها</span>
      </button>

      {/* Invisible bridge */}
      {isOpen && (
        <div className="absolute right-0 top-full w-full h-2 bg-transparent" />
      )}

      {/* Dropdown */}
      <div
        className={`
          absolute right-0 top-[calc(100%+8px)] z-50
          flex flex-row
          bg-white rounded-2xl shadow-2xl border border-blue-100
          overflow-hidden
          transition-all duration-300 ease-out
          ${isOpen
            ? "opacity-100 visible translate-y-0"
            : "opacity-0 invisible -translate-y-2 pointer-events-none"
          }
        `}
        style={{ minWidth: "640px" }}
      >
        {/* Left col — category list */}
        <div className="w-60 bg-blue-50 border-l border-blue-100 py-3 flex-shrink-0">
          <p className="text-xs font-bold text-blue-300 uppercase tracking-widest px-5 pb-3 pt-1">
            دسته‌بندی‌ها
          </p>
          {categories.map((cat, index) => (
            <button
              key={cat.name}
              onMouseEnter={() => setActiveIndex(index)}
              className={`
                w-full flex items-center justify-between gap-3
                px-5 py-2.5 text-sm font-medium
                transition-all duration-150 cursor-pointer
                ${activeIndex === index
                  ? "bg-blue-800 text-white"
                  : "text-gray-600 hover:bg-blue-100 hover:text-blue-800"
                }
              `}
            >
              <div className="flex items-center gap-3">
                <span className="text-base">{cat.icon}</span>
                <span>{cat.name}</span>
              </div>
              <ChevronLeft
                className={`w-4 h-4 flex-shrink-0 transition-all duration-150 ${
                  activeIndex === index ? "opacity-100 text-white" : "opacity-0"
                }`}
              />
            </button>
          ))}
        </div>

        {/* Right col — subcategories */}
        <div className="flex-1 p-5 bg-white flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-blue-50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-lg flex-shrink-0">
                {categories[activeIndex].icon}
              </div>
              <div>
                <h3 className="text-sm font-bold text-blue-800">
                  {categories[activeIndex].name}
                </h3>
                <p className="text-xs text-gray-400">زیردسته‌های مرتبط</p>
              </div>
            </div>
            <Link
              to={categories[activeIndex].href}
              className="flex items-center gap-1 text-xs font-semibold text-blue-800 hover:text-blue-600 transition-colors bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg"
            >
              <span>مشاهده همه</span>
              <ChevronLeft className="w-3 h-3" />
            </Link>
          </div>

          {/* Subcategory items */}
          <ul className="space-y-1">
            {categories[activeIndex].subcategories.map((sub) => (
              <li key={sub.name}>
                <Link
                  to={sub.href}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-blue-50 group transition-all duration-150"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-50 group-hover:bg-blue-800 flex items-center justify-center flex-shrink-0 transition-colors duration-150">
                    <ArrowLeft size={14} className="text-blue-800 group-hover:text-white transition-colors duration-150" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700 group-hover:text-blue-800 transition-colors">
                      {sub.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{sub.desc}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default MegaMenu;