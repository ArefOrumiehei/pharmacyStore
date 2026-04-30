import { ArrowLeft, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

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
          { name: "ایبوپروفن ۴۰۰mg",     href: "/products/medications/painkillers/ibuprofen-400",  desc: "ضد درد و تب"              },
          { name: "استامینوفن کدئین",      href: "/products/medications/painkillers/acetaminophen",  desc: "مسکن قوی"                 },
          { name: "دیکلوفناک موضعی",      href: "/products/medications/painkillers/diclofenac",     desc: "ژل ضد التهاب"             },
          { name: "ناپروکسن ۵۰۰mg",       href: "/products/medications/painkillers/naproxen",       desc: "ضد التهاب غیر استروئیدی"  },
        ],
      },
      {
        name: "داروهای گوارشی",
        href: "/products/medications/digestive",
        desc: "سلامت معده و روده",
        items: [
          { name: "امپرازول ۲۰mg",         href: "/products/medications/digestive/omeprazole",      desc: "ضد اسید معده"             },
          { name: "متوکلوپرامید",           href: "/products/medications/digestive/metoclopramide",  desc: "ضد تهوع"                  },
          { name: "قرص سیمتیکون",          href: "/products/medications/digestive/simethicone",     desc: "ضد نفخ"                   },
          { name: "بیزاکودیل",             href: "/products/medications/digestive/bisacodyl",       desc: "ملین ملایم"               },
        ],
      },
      {
        name: "داروهای قلبی",
        href: "/products/medications/cardiac",
        desc: "کنترل فشار و کلسترول",
        items: [
          { name: "آتورواستاتین",           href: "/products/medications/cardiac/atorvastatin",      desc: "کاهش کلسترول"             },
          { name: "آملودیپین ۵mg",          href: "/products/medications/cardiac/amlodipine",        desc: "کنترل فشار خون"           },
          { name: "لوزارتان",              href: "/products/medications/cardiac/losartan",          desc: "ضد فشار خون"              },
          { name: "آسپرین ۸۰mg",           href: "/products/medications/cardiac/aspirin-80",        desc: "رقیق‌کننده خون"           },
        ],
      },
      {
        name: "آنتی‌هیستامین",
        href: "/products/medications/antihistamine",
        desc: "درمان آلرژی و حساسیت",
        items: [
          { name: "ستیریزین ۱۰mg",         href: "/products/medications/antihistamine/cetirizine",  desc: "ضد آلرژی روزانه"          },
          { name: "لوراتادین",             href: "/products/medications/antihistamine/loratadine",  desc: "بدون خواب‌آوری"           },
          { name: "فکسوفنادین",            href: "/products/medications/antihistamine/fexofenadine",desc: "آلرژی فصلی"               },
          { name: "دیفن‌هیدرامین",         href: "/products/medications/antihistamine/diphenhydramine", desc: "ضد حساسیت قوی"         },
        ],
      },
      {
        name: "داروهای تنفسی",
        href: "/products/medications/respiratory",
        desc: "آسم، سرفه و سرماخوردگی",
        items: [
          { name: "سالبوتامول اسپری",       href: "/products/medications/respiratory/salbutamol",   desc: "باز‌کننده برونش"          },
          { name: "بودزوناید اینهالر",      href: "/products/medications/respiratory/budesonide",   desc: "کورتون تنفسی"             },
          { name: "شربت اکسپکتورانت",      href: "/products/medications/respiratory/expectorant",  desc: "رقیق‌کننده ترشحات"        },
          { name: "قطره بینی زایلومتازولین",href: "/products/medications/respiratory/xylometazoline",desc: "باز‌کننده بینی"          },
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
          { name: "ویتامین D3 1000IU",      href: "/products/supplements/vitamins/d3",              desc: "تقویت استخوان"            },
          { name: "ویتامین C 1000mg",       href: "/products/supplements/vitamins/c",               desc: "تقویت ایمنی"              },
          { name: "ویتامین B12",            href: "/products/supplements/vitamins/b12",             desc: "سلامت اعصاب"              },
          { name: "مولتی ویتامین",          href: "/products/supplements/vitamins/multi",           desc: "ترکیب کامل ویتامین‌ها"    },
        ],
      },
      {
        name: "مینرال‌ها",
        href: "/products/supplements/minerals",
        desc: "آهن، کلسیم، منیزیم",
        items: [
          { name: "کلسیم + D3",             href: "/products/supplements/minerals/calcium",         desc: "سلامت استخوان"            },
          { name: "آهن ۳۰mg",              href: "/products/supplements/minerals/iron",            desc: "درمان کم‌خونی"            },
          { name: "منیزیم ۲۵۰mg",          href: "/products/supplements/minerals/magnesium",       desc: "آرامش عضلات"              },
          { name: "روی (زینک) ۱۵mg",       href: "/products/supplements/minerals/zinc",            desc: "تقویت ایمنی"              },
        ],
      },
      {
        name: "مکمل‌های ورزشی",
        href: "/products/supplements/sports",
        desc: "پروتئین، کراتین و BCAA",
        items: [
          { name: "وی پروتئین ۱kg",         href: "/products/supplements/sports/whey",              desc: "ساخت عضله"                },
          { name: "کراتین مونوهیدرات",      href: "/products/supplements/sports/creatine",          desc: "افزایش قدرت"              },
          { name: "BCAA پودر",              href: "/products/supplements/sports/bcaa",              desc: "بازسازی عضله"             },
          { name: "گلوتامین",              href: "/products/supplements/sports/glutamine",         desc: "ریکاوری سریع"             },
        ],
      },
      {
        name: "امگا و روغن ماهی",
        href: "/products/supplements/omega",
        desc: "سلامت قلب و مغز",
        items: [
          { name: "امگا ۳ ۱۰۰۰mg",          href: "/products/supplements/omega/omega3-1000",        desc: "سلامت قلب"                },
          { name: "روغن ماهی سالمون",       href: "/products/supplements/omega/salmon-oil",         desc: "امگا ۳ طبیعی"             },
          { name: "امگا ۳-۶-۹",             href: "/products/supplements/omega/omega-369",          desc: "ترکیب کامل امگا"          },
          { name: "روغن کریل",             href: "/products/supplements/omega/krill-oil",          desc: "جذب بالاتر"               },
        ],
      },
      {
        name: "پروبیوتیک",
        href: "/products/supplements/probiotics",
        desc: "تقویت سیستم گوارش",
        items: [
          { name: "لاکتوباسیلوس",           href: "/products/supplements/probiotics/lactobacillus", desc: "باکتری مفید روده"         },
          { name: "پروبیوتیک کودک",         href: "/products/supplements/probiotics/kids",          desc: "مناسب زیر ۱۲ سال"         },
          { name: "سین‌بیوتیک",            href: "/products/supplements/probiotics/synbiotic",     desc: "پری + پروبیوتیک"          },
          { name: "کپسول مخمر",            href: "/products/supplements/probiotics/yeast",         desc: "تقویت گوارش"              },
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
          { name: "کرم سریلن",              href: "/products/skincare/moisturizer/cerave",          desc: "پوست خشک و حساس"          },
          { name: "لوسیون یوریا ۱۰٪",      href: "/products/skincare/moisturizer/urea",            desc: "پوست خیلی خشک"            },
          { name: "کرم وازلین",            href: "/products/skincare/moisturizer/vaseline",        desc: "مراقبت عمیق"              },
          { name: "ژل آلوئه‌ورا",          href: "/products/skincare/moisturizer/aloe",            desc: "آبرسان طبیعی"             },
        ],
      },
      {
        name: "ضد آفتاب",
        href: "/products/skincare/sunscreen",
        desc: "SPF 30 تا SPF 100",
        items: [
          { name: "ضد آفتاب SPF50 بی‌رنگ",  href: "/products/skincare/sunscreen/spf50-clear",      desc: "روزانه بدون رنگ"          },
          { name: "ضد آفتاب رنگی SPF50",    href: "/products/skincare/sunscreen/spf50-tinted",     desc: "پوشش یکنواخت"             },
          { name: "ضد آفتاب کودک SPF100",   href: "/products/skincare/sunscreen/kids-spf100",      desc: "محافظت کامل"              },
          { name: "اسپری ضد آفتاب",        href: "/products/skincare/sunscreen/spray",            desc: "استفاده آسان"             },
        ],
      },
      {
        name: "کرم‌های ضد جوش",
        href: "/products/skincare/acne",
        desc: "درمان و پیشگیری از آکنه",
        items: [
          { name: "ژل بنزوئیل پراکساید",   href: "/products/skincare/acne/benzoyl",               desc: "ضدباکتری موضعی"           },
          { name: "کرم رتینوئید",          href: "/products/skincare/acne/retinoid",              desc: "تجدید پوست"               },
          { name: "لوسیون سالیسیلیک اسید", href: "/products/skincare/acne/salicylic",             desc: "پاک‌کننده منافذ"          },
          { name: "پچ جوش",               href: "/products/skincare/acne/patch",                 desc: "درمان سریع"               },
        ],
      },
      {
        name: "سرم و آمپول",
        href: "/products/skincare/serum",
        desc: "مراقبت تخصصی پوست",
        items: [
          { name: "سرم ویتامین C",          href: "/products/skincare/serum/vitamin-c",            desc: "روشن‌کننده پوست"          },
          { name: "سرم هیالورونیک اسید",   href: "/products/skincare/serum/hyaluronic",           desc: "آبرسان عمیق"              },
          { name: "آمپول رتینول",          href: "/products/skincare/serum/retinol",              desc: "ضد پیری"                  },
          { name: "سرم نیاسینامید",        href: "/products/skincare/serum/niacinamide",          desc: "کاهش لک و منافذ"          },
        ],
      },
      {
        name: "کرم دور چشم",
        href: "/products/skincare/eye-cream",
        desc: "کاهش خستگی و تیرگی",
        items: [
          { name: "کرم ضد تیرگی دور چشم",  href: "/products/skincare/eye-cream/dark-circle",      desc: "روشن‌کننده"               },
          { name: "ژل خنک‌کننده چشم",     href: "/products/skincare/eye-cream/cooling-gel",      desc: "رفع پف چشم"               },
          { name: "کرم ضد چروک چشم",      href: "/products/skincare/eye-cream/anti-wrinkle",     desc: "ضد پیری"                  },
          { name: "پچ دور چشم",           href: "/products/skincare/eye-cream/patch",            desc: "درمان فوری"               },
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
          { name: "شامپو ضد ریزش بایوتین",  href: "/products/haircare/shampoo/biotin",             desc: "تقویت فولیکول مو"         },
          { name: "شامپو ضد شوره زینک",    href: "/products/haircare/shampoo/zinc",               desc: "کنترل شوره سر"            },
          { name: "شامپو کراتینه",         href: "/products/haircare/shampoo/keratin",            desc: "صاف‌کننده مو"             },
          { name: "شامپو موهای رنگ‌شده",   href: "/products/haircare/shampoo/color-protect",      desc: "حفظ رنگ مو"               },
        ],
      },
      {
        name: "نرم‌کننده و ماسک",
        href: "/products/haircare/conditioner",
        desc: "تغذیه و ترمیم مو",
        items: [
          { name: "ماسک مو کراتین",        href: "/products/haircare/conditioner/keratin-mask",   desc: "ترمیم عمیق"               },
          { name: "نرم‌کننده آرگان",       href: "/products/haircare/conditioner/argan",          desc: "مو‌های خشک"               },
          { name: "ماسک پروتئین مو",       href: "/products/haircare/conditioner/protein",        desc: "بازسازی ساختار مو"        },
          { name: "کرم دور موی آبرسان",   href: "/products/haircare/conditioner/leave-in",       desc: "بدون آبکشی"               },
        ],
      },
      {
        name: "سرم مو",
        href: "/products/haircare/serum",
        desc: "تقویت و براق‌کننده مو",
        items: [
          { name: "سرم ضد ریزش مینوکسیدیل",href: "/products/haircare/serum/minoxidil",           desc: "رشد مجدد مو"              },
          { name: "سرم براق‌کننده آرگان",  href: "/products/haircare/serum/argan-shine",          desc: "جلای طبیعی"               },
          { name: "آمپول تقویتی بایوتین",  href: "/products/haircare/serum/biotin-amp",           desc: "مراقبت فشرده"             },
          { name: "سرم ترمیم انتهای مو",   href: "/products/haircare/serum/split-end",            desc: "رفع دوشاخه شدن"           },
        ],
      },
      {
        name: "رنگ مو",
        href: "/products/haircare/color",
        desc: "رنگ‌های طبیعی و دائمی",
        items: [
          { name: "رنگ موی گیاهی حنا",    href: "/products/haircare/color/henna",                desc: "طبیعی و بدون مواد شیمیایی"},
          { name: "رنگ موی دائمی لورال",  href: "/products/haircare/color/loreal-permanent",     desc: "ماندگاری بالا"            },
          { name: "شامپو رنگ‌دهنده",      href: "/products/haircare/color/color-shampoo",        desc: "رنگ‌دهی تدریجی"           },
          { name: "اکسیدان ۶٪",           href: "/products/haircare/color/oxidant",              desc: "ثابت‌کننده رنگ"           },
        ],
      },
      {
        name: "مکمل رشد مو",
        href: "/products/haircare/supplement",
        desc: "بیوتین و تقویت‌کننده",
        items: [
          { name: "بیوتین ۵۰۰۰mcg",        href: "/products/haircare/supplement/biotin-5000",     desc: "رشد مو و ناخن"            },
          { name: "کپسول مو و ناخن",       href: "/products/haircare/supplement/hair-nail",       desc: "ترکیب کامل"               },
          { name: "قرص سیلیسیم ارگانیک",  href: "/products/haircare/supplement/silicon",         desc: "استحکام مو"               },
          { name: "آهن + بیوتین",         href: "/products/haircare/supplement/iron-biotin",     desc: "ریزش ناشی از کم‌خونی"    },
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
          { name: "خمیردندان سنسوداین",    href: "/products/oral/toothpaste/sensodyne",           desc: "ضد حساسیت دندان"          },
          { name: "خمیردندان کلگیت",      href: "/products/oral/toothpaste/colgate",             desc: "سفیدکننده و ضدعفونی"      },
          { name: "خمیردندان فلوراید",    href: "/products/oral/toothpaste/fluoride",            desc: "محافظت از مینای دندان"    },
          { name: "خمیردندان کودک",       href: "/products/oral/toothpaste/kids",                desc: "بدون فلوراید زیاد"        },
        ],
      },
      {
        name: "مسواک",
        href: "/products/oral/toothbrush",
        desc: "مکانیکی و الکتریکی",
        items: [
          { name: "مسواک اورال-بی الکتریکی",href: "/products/oral/toothbrush/oral-b-electric",    desc: "پاکسازی عمیق"             },
          { name: "مسواک موی نرم",         href: "/products/oral/toothbrush/soft",                desc: "مناسب لثه حساس"           },
          { name: "مسواک بین‌دندانی",      href: "/products/oral/toothbrush/interdental",         desc: "تمیز کردن فواصل"          },
          { name: "زبان‌پاک‌کن",          href: "/products/oral/toothbrush/tongue-cleaner",      desc: "رفع بوی بد دهان"          },
        ],
      },
      {
        name: "دهانشویه",
        href: "/products/oral/mouthwash",
        desc: "ضدعفونی و خوشبوکننده",
        items: [
          { name: "دهانشویه لیسترین",     href: "/products/oral/mouthwash/listerine",            desc: "ضدعفونی قوی"              },
          { name: "دهانشویه کلرهگزیدین", href: "/products/oral/mouthwash/chlorhexidine",        desc: "درمان التهاب لثه"         },
          { name: "دهانشویه فلوراید",    href: "/products/oral/mouthwash/fluoride",             desc: "محافظت دندان"             },
          { name: "دهانشویه کودک",       href: "/products/oral/mouthwash/kids",                 desc: "بدون الکل"                },
        ],
      },
      {
        name: "نخ دندان",
        href: "/products/oral/floss",
        desc: "بهداشت بین دندانی",
        items: [
          { name: "نخ دندان موم‌دار",      href: "/products/oral/floss/waxed",                   desc: "لغزنده و مقاوم"           },
          { name: "فلاس‌پیک یکبارمصرف",   href: "/products/oral/floss/floss-pick",              desc: "استفاده آسان"             },
          { name: "واتر فلاسر",          href: "/products/oral/floss/water-flosser",           desc: "جت آب پالسی"              },
          { name: "نخ دندان سوپرفلاس",   href: "/products/oral/floss/superfloss",              desc: "مناسب ارتودنسی"           },
        ],
      },
      {
        name: "ژل درمانی لثه",
        href: "/products/oral/gum-gel",
        desc: "تسکین دردهای لثه",
        items: [
          { name: "ژل لیدوکائین لثه",     href: "/products/oral/gum-gel/lidocaine",             desc: "بی‌حس‌کننده موضعی"        },
          { name: "ژل کامیلوسان",        href: "/products/oral/gum-gel/kamilosan",             desc: "گیاهی و آرام‌بخش"         },
          { name: "پودر لثه",            href: "/products/oral/gum-gel/powder",                desc: "ضدعفونی لثه"              },
          { name: "ژل لثه دندان شیری",  href: "/products/oral/gum-gel/baby",                  desc: "مخصوص دندان‌درآوردن"      },
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
          { name: "شیر خشک نان ۱",         href: "/products/mother-baby/formula/nan-1",           desc: "۰ تا ۶ ماه"               },
          { name: "شیر خشک نان ۲",         href: "/products/mother-baby/formula/nan-2",           desc: "۶ تا ۱۲ ماه"              },
          { name: "شیر خشک هیپ ارگانیک",  href: "/products/mother-baby/formula/hipp-organic",    desc: "فرمول ارگانیک"            },
          { name: "شیر خشک بدون لاکتوز",  href: "/products/mother-baby/formula/lactose-free",    desc: "حساسیت به لاکتوز"         },
        ],
      },
      {
        name: "پوشک و بهداشت",
        href: "/products/mother-baby/diapers",
        desc: "پوشک و دستمال مرطوب",
        items: [
          { name: "پوشک پمپرز سایز ۳",    href: "/products/mother-baby/diapers/pampers-3",       desc: "۶ تا ۱۰ کیلوگرم"          },
          { name: "دستمال مرطوب وایپس",   href: "/products/mother-baby/diapers/wipes",           desc: "بدون الکل"                },
          { name: "پوشک شنا",            href: "/products/mother-baby/diapers/swim",            desc: "مخصوص استخر"              },
          { name: "پد زیرانداز یکبارمصرف",href: "/products/mother-baby/diapers/pad",             desc: "مراقبت و تعویض"           },
        ],
      },
      {
        name: "کرم پوست کودک",
        href: "/products/mother-baby/baby-cream",
        desc: "مراقبت پوست نوزاد",
        items: [
          { name: "کرم ضد سوختگی پوشک",  href: "/products/mother-baby/baby-cream/diaper-rash",  desc: "اکسید روی"                },
          { name: "لوسیون بدن نوزاد",     href: "/products/mother-baby/baby-cream/lotion",       desc: "مرطوب‌کننده ملایم"        },
          { name: "روغن بچه",            href: "/products/mother-baby/baby-cream/oil",          desc: "ماساژ نوزاد"              },
          { name: "شامپو و شاور ژل",     href: "/products/mother-baby/baby-cream/wash",         desc: "اشک‌آور نیست"             },
        ],
      },
      {
        name: "مکمل کودک",
        href: "/products/mother-baby/supplement",
        desc: "ویتامین D، قطره آهن",
        items: [
          { name: "قطره ویتامین D نوزاد", href: "/products/mother-baby/supplement/vitamin-d",   desc: "۴۰۰ IU روزانه"            },
          { name: "قطره آهن شیرخوار",    href: "/products/mother-baby/supplement/iron",         desc: "از ۴ ماهگی"               },
          { name: "مولتی ویتامین کودک",  href: "/products/mother-baby/supplement/multivitamin", desc: "جامع و کامل"              },
          { name: "قطره امگا ۳ کودک",    href: "/products/mother-baby/supplement/omega",        desc: "رشد مغز"                  },
        ],
      },
      {
        name: "محصولات بارداری",
        href: "/products/mother-baby/pregnancy",
        desc: "مراقبت دوران بارداری",
        items: [
          { name: "قرص اسید فولیک",       href: "/products/mother-baby/pregnancy/folic-acid",   desc: "پیش از بارداری"           },
          { name: "مولتی ویتامین بارداری",href: "/products/mother-baby/pregnancy/prenatal",      desc: "کامل‌ترین فرمول"          },
          { name: "کرم ضد ترک بارداری",  href: "/products/mother-baby/pregnancy/stretch-mark",  desc: "شکم و ران"                },
          { name: "تست بارداری",         href: "/products/mother-baby/pregnancy/test",          desc: "دقت ۹۹٪"                  },
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
          { name: "فشارسنج بازویی امرون",  href: "/products/medical-equipment/blood-pressure/omron", desc: "دقت پزشکی"              },
          { name: "فشارسنج مچی",          href: "/products/medical-equipment/blood-pressure/wrist",  desc: "قابل‌حمل"               },
          { name: "فشارسنج جیوه‌ای",      href: "/products/medical-equipment/blood-pressure/mercury",desc: "استفاده حرفه‌ای"        },
          { name: "گوشی پزشکی",          href: "/products/medical-equipment/blood-pressure/stethoscope",desc: "همراه فشارسنج"     },
        ],
      },
      {
        name: "گلوکومتر",
        href: "/products/medical-equipment/glucometer",
        desc: "اندازه‌گیری قند خون",
        items: [
          { name: "گلوکومتر آکو‌چک",      href: "/products/medical-equipment/glucometer/accu-chek",  desc: "برند اصلی روش"          },
          { name: "نوار تست قند خون",     href: "/products/medical-equipment/glucometer/test-strip",  desc: "مصرفی گلوکومتر"        },
          { name: "لانست و سوزن",        href: "/products/medical-equipment/glucometer/lancet",      desc: "خون‌گیری بدون درد"      },
          { name: "گلوکومتر بلوتوثی",    href: "/products/medical-equipment/glucometer/bluetooth",   desc: "اتصال به موبایل"        },
        ],
      },
      {
        name: "ترمومتر",
        href: "/products/medical-equipment/thermometer",
        desc: "تب‌سنج دیجیتال",
        items: [
          { name: "ترمومتر گوشی",         href: "/products/medical-equipment/thermometer/ear",       desc: "دقیق و سریع"            },
          { name: "ترمومتر پیشانی",       href: "/products/medical-equipment/thermometer/forehead",  desc: "بدون تماس"              },
          { name: "ترمومتر زیر بغلی",     href: "/products/medical-equipment/thermometer/armpit",    desc: "کلاسیک"                 },
          { name: "ترمومتر محیطی",        href: "/products/medical-equipment/thermometer/room",      desc: "دما و رطوبت"            },
        ],
      },
      {
        name: "پالس اکسیمتر",
        href: "/products/medical-equipment/oximeter",
        desc: "اندازه‌گیری اکسیژن خون",
        items: [
          { name: "پالس اکسیمتر انگشتی",  href: "/products/medical-equipment/oximeter/finger",      desc: "نمایش SpO2 و ضربان"     },
          { name: "پالس اکسیمتر مچی",     href: "/products/medical-equipment/oximeter/wrist",       desc: "پایش شبانه"             },
          { name: "سنسور اکسیژن کودک",   href: "/products/medical-equipment/oximeter/kids",        desc: "مخصوص نوزاد"            },
          { name: "پالس اکسیمتر ورزشی",  href: "/products/medical-equipment/oximeter/sport",       desc: "حین فعالیت"             },
        ],
      },
      {
        name: "زانوبند و گردن‌بند",
        href: "/products/medical-equipment/brace",
        desc: "ارتوپدی و حمایتی",
        items: [
          { name: "زانوبند طبی نئوپرنی",  href: "/products/medical-equipment/brace/knee-neoprene",  desc: "کشی و حمایتی"           },
          { name: "گردن‌بند طبی نرم",     href: "/products/medical-equipment/brace/neck-soft",      desc: "کشش ملایم"              },
          { name: "مچ‌بند کارپال",        href: "/products/medical-equipment/brace/carpal",         desc: "سندرم تونل کارپ"        },
          { name: "کمربند طبی",          href: "/products/medical-equipment/brace/lumbar",         desc: "حمایت کمر"              },
        ],
      },
    ],
  },
];

// ── Types ─────────────────────────────────────────────────────────────────────

interface SubItem { name: string; href: string; desc: string }
interface Subcategory { name: string; href: string; desc: string; items: SubItem[] }
interface Category { name: string; href: string; icon: string; subcategories: Subcategory[] }

// ── Component ─────────────────────────────────────────────────────────────────

function MegaMenu() {
  const [isOpen, setIsOpen]           = useState(false);
  const [activeCat, setActiveCat]     = useState(0);
  const [activeSub, setActiveSub]     = useState(0);

  const currentCat: Category         = categories[activeCat];
  const currentSub: Subcategory      = currentCat.subcategories[activeSub];

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => { setIsOpen(false); setActiveCat(0); setActiveSub(0); }}
    >
      {/* ── Trigger ── */}
      <button
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
          isOpen ? "bg-blue-300/20 text-white" : "text-white/90 hover:bg-blue-300/20 hover:text-white"
        }`}
      >
        دسته‌بندی‌ها
      </button>

      {/* Invisible hover bridge */}
      {isOpen && <div className="absolute right-0 top-full w-full h-2 bg-transparent" />}

      {/* ── Dropdown ── */}
      <div
        className={`absolute right-0 top-[calc(100%+8px)] z-50 flex flex-row bg-white rounded-2xl shadow-2xl border border-blue-100 overflow-hidden transition-all duration-200 ease-out ${
          isOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2 pointer-events-none"
        }`}
        style={{ minWidth: "860px" }}
      >

        {/* ── Column 1 — Main categories ── */}
        <div className="w-52 bg-blue-50 border-l border-blue-100 py-3 flex-shrink-0 flex flex-col">
          <p className="text-xs font-bold text-blue-300 uppercase tracking-widest px-5 pb-3 pt-1">
            دسته‌بندی‌ها
          </p>
          {categories.map((cat, i) => (
            <button
              key={cat.name}
              onMouseEnter={() => { setActiveCat(i); setActiveSub(0); }}
              className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-150 ${
                activeCat === i
                  ? "bg-blue-800 text-white"
                  : "text-gray-600 hover:bg-blue-100 hover:text-blue-800"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">{cat.icon}</span>
                <span>{cat.name}</span>
              </div>
              <ChevronLeft className={`w-3.5 h-3.5 flex-shrink-0 transition-opacity ${activeCat === i ? "opacity-100" : "opacity-0"}`} />
            </button>
          ))}
        </div>

        {/* ── Column 2 — Subcategories ── */}
        <div className="w-52 bg-white border-l border-blue-50 py-3 flex-shrink-0 flex flex-col">
          <div className="flex items-center gap-2 px-4 pb-3 pt-1 border-b border-blue-50 mb-1">
            <span className="text-base">{currentCat.icon}</span>
            <p className="text-xs font-bold text-blue-800 truncate">{currentCat.name}</p>
          </div>
          {currentCat.subcategories.map((sub, i) => (
            <button
              key={sub.name}
              onMouseEnter={() => setActiveSub(i)}
              className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 text-sm transition-all duration-150 ${
                activeSub === i
                  ? "bg-blue-50 text-blue-800 font-semibold"
                  : "text-gray-600 hover:bg-blue-50/60 hover:text-blue-800 font-medium"
              }`}
            >
              <div className="flex flex-col items-start min-w-0">
                <span className="truncate">{sub.name}</span>
                <span className="text-xs text-gray-400 font-normal truncate mt-0.5">{sub.desc}</span>
              </div>
              <ChevronLeft className={`w-3.5 h-3.5 flex-shrink-0 transition-opacity ${activeSub === i ? "opacity-100 text-blue-800" : "opacity-0"}`} />
            </button>
          ))}
        </div>

        {/* ── Column 3 — Detailed items ── */}
        <div className="flex-1 bg-white py-4 px-4 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-blue-50">
            <div className="flex flex-col">
              <h3 className="text-sm font-bold text-blue-800">{currentSub.name}</h3>
              <p className="text-xs text-gray-400 mt-0.5">{currentSub.desc}</p>
            </div>
            <Link
              to={currentSub.href}
              className="flex items-center gap-1 text-xs font-semibold text-blue-800 hover:text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors flex-shrink-0"
            >
              مشاهده همه
              <ChevronLeft className="w-3 h-3" />
            </Link>
          </div>

          {/* Items grid */}
          <div className="grid grid-cols-2 gap-1.5">
            {currentSub.items.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-blue-50 group transition-all duration-150"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-50 group-hover:bg-blue-800 flex items-center justify-center flex-shrink-0 transition-colors duration-150">
                  <ArrowLeft size={12} className="text-blue-800 group-hover:text-white transition-colors duration-150" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-700 group-hover:text-blue-800 transition-colors truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{item.desc}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Bottom — view all category */}
          <div className="mt-auto pt-4 border-t border-blue-50">
            <Link
              to={currentCat.href}
              className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors duration-150 group"
            >
              <div className="flex items-center gap-2">
                <span className="text-base">{currentCat.icon}</span>
                <span className="text-xs font-bold text-blue-800">
                  مشاهده همه {currentCat.name}
                </span>
              </div>
              <ArrowLeft size={14} className="text-blue-800" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MegaMenu;