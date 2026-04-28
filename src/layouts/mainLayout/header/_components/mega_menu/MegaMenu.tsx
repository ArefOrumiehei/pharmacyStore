import { ArrowLeft, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

const categories = [
  {
    name: "سلامتی",
    href: "#",
    icon: "💊",
    subcategories: [
      { name: "ویتامین‌ها", href: "#", desc: "انواع ویتامین و مینرال" },
      { name: "مکمل‌های ورزشی", href: "#", desc: "پروتئین، کراتین و..." },
      { name: "مکمل‌های تقویتی", href: "#", desc: "تقویت سیستم ایمنی" },
    ],
  },
  {
    name: "مراقبت‌های پوستی",
    href: "#",
    icon: "✨",
    subcategories: [
      { name: "کرم‌های مرطوب‌کننده", href: "#", desc: "مراقبت روزانه پوست" },
      { name: "ضد آفتاب", href: "#", desc: "محافظت در برابر UV" },
      { name: "کرم‌های شب", href: "#", desc: "ترمیم پوست در شب" },
    ],
  },
  {
    name: "داروهای بدون نسخه",
    href: "#",
    icon: "🩺",
    subcategories: [
      { name: "مسکن‌ها", href: "#", desc: "تسکین درد سریع" },
      { name: "آنتی‌بیوتیک‌ها", href: "#", desc: "درمان عفونت‌ها" },
      { name: "داروهای گوارشی", href: "#", desc: "سلامت دستگاه گوارش" },
    ],
  },
  {
    name: "بهداشت و زیبایی",
    href: "#",
    icon: "🌿",
    subcategories: [
      { name: "شامپو و نرم‌کننده", href: "#", desc: "مراقبت از مو" },
      { name: "محصولات دندان", href: "#", desc: "بهداشت دهان و دندان" },
      { name: "عطر و اسپری", href: "#", desc: "خوشبو کننده بدن" },
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
      <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200">
        <span>دسته‌بندی‌ها</span>
        <span
          className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        >
          ▾
        </span>
      </button>

      <div
        className={`
          absolute right-0 top-full  z-50
          flex flex-row
          bg-white rounded-2xl shadow-2xl border border-gray-100
          overflow-hidden
          transition-all duration-300 ease-out
          ${isOpen
            ? "opacity-100 visible translate-y-0"
            : "opacity-0 invisible -translate-y-3 pointer-events-none"
          }
        `}
        style={{ minWidth: "580px" }}
      >
        {/* Right Col */}
        <div className="w-56 bg-gray-50 border-l border-gray-100 py-3">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-5 pb-3 pt-1">
            دسته‌بندی‌ها
          </p>
          {categories.map((cat, index) => (
            <button
              key={cat.name}
              onMouseEnter={() => setActiveIndex(index)}
              className={`
                w-full flex items-center justify-between gap-3
                px-5 py-3 text-sm font-medium
                transition-all duration-150 cursor-pointer
                ${activeIndex === index
                  ? "bg-indigo-500 text-white"
                  : "text-gray-700 hover:bg-gray-100"
                }
              `}
            >
              <div className="flex items-center gap-3">
                <span className="text-base">{cat.icon}</span>
                <Link to={cat.href}>{cat.name}</Link>
              </div>
              <ChevronLeft
                className={`w-4 h-4 transition-opacity ${
                  activeIndex === index ? "opacity-100" : "opacity-0"
                }`}
              />
            </button>
          ))}
        </div>

        {/* Left Col*/}
        <div className="flex-1 p-6 bg-white">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
            <span className="text-2xl">{categories[activeIndex].icon}</span>
            <div>
              <h3 className="text-base font-bold text-gray-800">
                {categories[activeIndex].name}
              </h3>
              <p className="text-xs text-gray-400">زیردسته‌های مرتبط</p>
            </div>
          </div>

          {/* Items */}
          <ul className="space-y-2">
            {categories[activeIndex].subcategories.map((sub) => (
              <li key={sub.name}>
                <a
                  href={sub.href}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-indigo-50 group transition-all duration-150"
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 group-hover:bg-indigo-500 flex items-center justify-center flex-shrink-0 transition-colors duration-150">
                    <span className="text-indigo-500 group-hover:text-white text-xs font-bold">
                      <ArrowLeft size={"16px"} />
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700 group-hover:text-indigo-600 transition-colors">
                      {sub.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{sub.desc}</p>
                  </div>
                </a>
              </li>
            ))}
          </ul>

          {/* See All */}
          <a
            href={categories[activeIndex].href}
            className="mt-5 flex items-center gap-2 text-xs font-semibold text-indigo-500 hover:text-indigo-700 transition-colors"
          >
            <span>مشاهده همه {categories[activeIndex].name}</span>
            <ChevronLeft className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default MegaMenu;
