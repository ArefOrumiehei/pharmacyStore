import { useState } from "react";
import { Link } from "react-router";
import {
    IconLogin,
    IconMenu2,
    IconShoppingCart,
    IconUser,
    IconX,
} from "@tabler/icons-react";

import { useUserStore } from "@/store/useAccountStore";
import NavigationDesktop from "./_components/navigation/NavigationDesktop";
import SearchBox from "./_components/search_box/SearchBox";

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

function UserSection() {
    const { user } = useUserStore();

    if (user?.id) {
        return (
            <Link to="/profile">
                <div className="bg-white border rounded-xl p-2 hover:bg-white/70 transition-all duration-200 cursor-pointer">
                    <IconUser size={22} color="#000" />
                </div>
            </Link>
        );
    }

    return (
        <div className="flex items-center gap-2 bg-white border rounded-xl px-4 py-2 cursor-pointer select-none hover:bg-white/70 transition-all duration-200">
            <Link
                to="/login"
                className="text-sm text-neutral-700 hover:text-indigo-600 transition-colors"
            >
                ورود
            </Link>
            <span className="text-neutral-300">|</span>
            <Link
                to="/signup"
                className="text-sm text-neutral-700 hover:text-indigo-600 transition-colors"
            >
                ثبت‌نام
            </Link>
            <IconLogin size={20} className="text-neutral-600" />
        </div>
    );
}

function CartButton() {
    return (
        <Link to="/cart">
            <div className="bg-white border rounded-xl p-2 hover:bg-white/70 transition-all duration-200 cursor-pointer">
                <IconShoppingCart size={22} color="#000" />
            </div>
        </Link>
    );
}

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────

function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full backdrop-blur-3xl rounded-b-xl">
            {/* ── Top Bar ── */}
            <div className="bg-sky-400/70 rounded-t-xl">
                <div className="w-full mx-auto flex items-center justify-between h-20 px-6 md:px-12 gap-4">
                    {/* Logo + Search */}
                    <div className="flex items-center gap-6 flex-1 min-w-0">
                        <Link to="/" className="flex-shrink-0">
                            <h1 className="text-2xl font-bold tracking-tight text-black">
                                فارماپلاس
                            </h1>
                        </Link>
                        <div className="flex-1 min-w-0">
                            <SearchBox />
                        </div>
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-2 flex-shrink-0">
                        <UserSection />
                        <CartButton />
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        className="md:hidden flex items-center justify-center p-2 rounded-xl hover:bg-white/30 transition-all duration-200"
                        onClick={() => setMobileMenuOpen((prev) => !prev)}
                        aria-label={
                            mobileMenuOpen ? "بستن منو" : "باز کردن منو"
                        }
                    >
                        {mobileMenuOpen ? (
                            <IconX size={24} />
                        ) : (
                            <IconMenu2 size={24} />
                        )}
                    </button>
                </div>
            </div>

            {/* ── Desktop Navigation ── */}
            <NavigationDesktop />

            {/* ── Mobile Menu ── */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-sky-400/90 backdrop-blur-md px-6 py-4 flex flex-col gap-4 border-t border-white/20">
                    <div className="flex items-center gap-3">
                        <UserSection />
                        <CartButton />
                    </div>
                    <nav className="flex flex-col gap-2">
                        <Link
                            to="/aboutus"
                            onClick={() => setMobileMenuOpen(false)}
                            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-800 hover:bg-white/40 transition-all duration-200"
                        >
                            درباره ما
                        </Link>
                        <Link
                            to="/contactus"
                            onClick={() => setMobileMenuOpen(false)}
                            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-800 hover:bg-white/40 transition-all duration-200"
                        >
                            تماس با ما
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
}

export default Header;
