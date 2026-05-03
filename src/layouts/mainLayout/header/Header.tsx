/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef } from "react";
import { Link } from "react-router";
import {
    IconPill,
    IconShoppingCart,
    IconUser,
    IconX,
} from "@tabler/icons-react";

import { useUserStore } from "@/store/useAccountStore";
import NavigationDesktop from "./_components/navigation/NavigationDesktop";
import SearchBox from "./_components/search_box/SearchBox";
import MobileBottomBar from "./_components/mobile_bottom_bar/MobileBottomBar";
import MobileCategoriesDrawer from "./_components/mobile_categories_drawer/MobileCategoriesDrawer";


const navLinks = [
    { to: "/blog", label: "مقالات" },
    { to: "/aboutus", label: "درباره‌ما" },
    { to: "/contactus", label: "تماس‌با‌ما" },
];


// ── Sub-components ─────────────────────────────────────────────────────────────
function UserSection() {
    const { user } = useUserStore();

    if (user?.id) {
        return (
            <Link to="/profile">
                <div className="bg-white border border-blue-200 rounded-xl p-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 cursor-pointer">
                    <IconUser size={22} color="#1e40af" />
                </div>
            </Link>
        );
    }

    return (
        <div className="flex items-center gap-2 bg-white border border-blue-200 rounded-xl px-4 py-2 select-none hover:bg-blue-50 hover:border-blue-300 transition-all duration-200">
            <Link to="/login" className="text-sm text-blue-800 hover:text-blue-600 transition-colors">
                ورود
            </Link>
            <span className="text-blue-200">|</span>
            <Link to="/signup" className="text-sm text-blue-800 hover:text-blue-600 transition-colors">
                ثبت‌نام
            </Link>
        </div>
    );
}

function CartButton() {
    return (
        <Link to="/checkout/cart">
            <div className="bg-white border border-blue-200 rounded-xl p-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 cursor-pointer">
                <IconShoppingCart size={22} color="#1e40af" />
            </div>
        </Link>
    );
}

// ── Mobile Search Bar — hidden by default, slides down when open ───────────────
function MobileSearchBar({
    inputRef,
    open,
    onClose,
}: {
    inputRef: React.RefObject<HTMLInputElement>;
    open: boolean;
    onClose: () => void;
}) {
    return (
        <div
            className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white ${
                open ? "max-h-20 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
            }`}
        >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-blue-100">
                {/* Search icon */}
                <svg
                    width="15" height="15" viewBox="0 0 24 24"
                    fill="none" stroke="#93c5fd" strokeWidth="2.2"
                    className="flex-shrink-0"
                >
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.35-4.35"/>
                </svg>

                {/* Input */}
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="جستجوی محصول..."
                    className="flex-1 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2 text-sm text-gray-700 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all duration-200"
                />

                {/* Close / clear button */}
                <button
                    onClick={onClose}
                    className="flex-shrink-0 p-1.5 rounded-xl text-gray-400 hover:text-blue-800 hover:bg-blue-50 transition-all duration-200"
                    aria-label="بستن جستجو"
                >
                    <IconX size={18} />
                </button>
            </div>
        </div>
    );
}

// ── Main Header ────────────────────────────────────────────────────────────────
function Header() {
    const [categoriesOpen, setCategoriesOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const mobileSearchRef = useRef<HTMLInputElement | any>(null);

    const handleSearchOpen = () => {
        setSearchOpen(true);
        // Focus input after the slide-down animation starts
        setTimeout(() => mobileSearchRef.current?.focus(), 50);
    };

    const handleSearchClose = () => {
        setSearchOpen(false);
        if (mobileSearchRef.current) mobileSearchRef.current.value = "";
    };

    return (
        <>
            <header className="sticky top-0 z-40 w-full">
                {/* ── Top Bar ── */}
                <div className="bg-white border-b border-blue-100">
                    <div className="w-full mx-auto flex items-center justify-between h-20 px-4 md:px-12 gap-4">

                        {/* Logo + Desktop Search */}
                        <div className="flex items-center gap-6 flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1 flex-1 md:flex-none min-w-0 flex-col md:flex-row">
                                <Link to="/" className="flex items-center gap-2 flex-shrink-0">
                                    <div className="w-8 h-8 rounded-xl bg-blue-800 flex items-center justify-center">
                                        <IconPill size={16} className="text-white" />
                                    </div>
                                    <h1 className="text-xl md:text-2xl font-bold tracking-tight text-blue-800">
                                        فارماپلاس
                                    </h1>
                                </Link>
                                <nav className="md:hidden flex items-center gap-1">
                                    {navLinks.map(({ to, label }) => (
                                        <Link
                                            key={label}
                                            to={to}
                                            className="p-2 rounded-lg text-sm font-medium text-gray-700 hover:text-blue-800 hover:bg-blue-50 transition-all duration-200"
                                        >
                                            {label}
                                        </Link>
                                    ))}
                                </nav>
                            </div>
                            <div className="hidden md:flex flex-1 min-w-0">
                                <SearchBox />
                            </div>
                        </div>

                        {/* Desktop actions */}
                        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
                            <UserSection />
                            <CartButton />
                        </div>
                    </div>
                </div>

                {/* Mobile search bar — slides down when searchOpen */}
                <MobileSearchBar
                    inputRef={mobileSearchRef}
                    open={searchOpen}
                    onClose={handleSearchClose}
                />

                {/* Desktop nav bar */}
                <NavigationDesktop />
            </header>

            {/* Mobile Categories Drawer */}
            <MobileCategoriesDrawer
                open={categoriesOpen}
                onClose={() => setCategoriesOpen(false)}
            />

            {/* Mobile Bottom Navigation Bar */}
            <MobileBottomBar
                categoriesOpen={categoriesOpen}
                onCategoriesOpen={() => setCategoriesOpen((p) => !p)}
                searchOpen={searchOpen}
                onSearchToggle={() => (searchOpen ? handleSearchClose() : handleSearchOpen())}
            />
        </>
    );
}

export default Header;