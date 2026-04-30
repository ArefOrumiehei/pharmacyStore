import { useNavigate } from "react-router";
import { IconHome, IconArrowRight, IconPill, IconSearch } from "@tabler/icons-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-white overflow-hidden relative flex" dir="rtl">

      {/* ── Left panel — decorative ── */}
      <div
        className="hidden lg:flex flex-col items-center justify-center w-[42%] relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, #1e3a8a 0%, #1d4ed8 60%, #3b82f6 100%)" }}
      >
        {/* Subtle circle rings */}
        {[280, 420, 560, 700].map((size, i) => (
          <div
            key={i}
            className="absolute rounded-full border border-white/10"
            style={{ width: size, height: size }}
          />
        ))}

        {/* Floating pills */}
        {[
          { top: "12%",  left: "18%", rotate: "25deg",  size: 52, delay: "0s"    },
          { top: "22%",  left: "62%", rotate: "-15deg", size: 36, delay: "0.4s"  },
          { top: "55%",  left: "8%",  rotate: "50deg",  size: 44, delay: "0.8s"  },
          { top: "68%",  left: "55%", rotate: "-30deg", size: 30, delay: "0.2s"  },
          { top: "80%",  left: "25%", rotate: "10deg",  size: 40, delay: "1.1s"  },
          { top: "40%",  left: "72%", rotate: "-45deg", size: 28, delay: "0.6s"  },
        ].map((p, i) => (
          <div
            key={i}
            className="absolute opacity-20 animate-bounce"
            style={{
              top: p.top, left: p.left,
              rotate: p.rotate,
              animationDelay: p.delay,
              animationDuration: "3s",
            }}
          >
            <IconPill size={p.size} color="white" />
          </div>
        ))}

        {/* Big centered number */}
        <div className="relative z-10 flex flex-col items-center gap-6">
          <span
            className="font-black leading-none tracking-tighter text-white select-none"
            style={{ fontSize: "11rem", opacity: 0.15 }}
          >
            404
          </span>
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 rounded-[2rem] flex items-center justify-center"
            style={{
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.25)",
              backdropFilter: "blur(16px)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
            }}
          >
            <IconSearch size={52} color="white" strokeWidth={1.4} />
          </div>
        </div>

        {/* Bottom label */}
        <p
          className="absolute bottom-8 text-xs tracking-[0.3em] font-mono uppercase text-white/30"
        >
          ERROR · 404
        </p>
      </div>

      {/* ── Right panel — content ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 sm:px-16 py-16 relative">

        {/* Top-right decoration */}
        <div
          className="absolute top-0 left-0 w-64 h-64 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(219,234,254,0.6) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-48 h-48 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(219,234,254,0.4) 0%, transparent 70%)",
          }}
        />

        {/* Mobile-only 404 badge */}
        <div className="lg:hidden mb-8 w-24 h-24 rounded-3xl bg-blue-800 flex items-center justify-center shadow-lg shadow-blue-200">
          <IconSearch size={40} color="white" strokeWidth={1.4} />
        </div>

        <div className="relative z-10 max-w-sm w-full">

          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-5">
            <span className="w-8 h-px bg-blue-800" />
            <span className="text-xs font-bold text-blue-800 tracking-widest uppercase">
              صفحه پیدا نشد
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight mb-4">
            اینجا
            <br />
            <span className="text-blue-800">چیزی نیست!</span>
          </h1>

          {/* Body */}
          <p className="text-gray-400 text-sm leading-7 mb-10">
            صفحه‌ای که دنبالش می‌گردید وجود ندارد،
            شاید آدرس اشتباه وارد شده یا این صفحه حذف شده است.
          </p>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate("/")}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-blue-800 hover:bg-blue-700 active:scale-95 text-white font-bold text-sm transition-all duration-150 shadow-lg shadow-blue-100"
            >
              <IconHome size={17} />
              بازگشت به صفحه اصلی
            </button>
            <button
              onClick={() => navigate(-1)}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-blue-50 hover:bg-blue-100 active:scale-95 text-blue-800 font-bold text-sm border border-blue-100 transition-all duration-150"
            >
              <IconArrowRight size={17} />
              بازگشت به صفحه قبل
            </button>
          </div>

          {/* Quick links */}
          <div className="mt-10 pt-8 border-t border-blue-50">
            <p className="text-xs font-semibold text-gray-400 mb-4">
              شاید این صفحه‌ها کمکتان کند:
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "داروخانه",    path: "/plp"       },
                { label: "سفارش‌های من", path: "/profile/orders" },
                { label: "تماس با ما",  path: "/contactus" },
                { label: "سوالات متداول", path: "/faq"     },
              ].map(({ label, path }) => (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className="text-xs font-medium px-3 py-1.5 rounded-xl bg-white border border-blue-100 text-blue-800 hover:bg-blue-50 hover:border-blue-300 transition-all duration-150"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}