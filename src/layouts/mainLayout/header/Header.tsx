import { useRef, useState } from "react";

// Components
import MobileBottomBar from "./_components/mobile_bottom_bar/MobileBottomBar";
import MobileCategoriesDrawer from "./_components/mobile_categories_drawer/MobileCategoriesDrawer";
import MobileSearchBar from "./_components/mobileSearchBar/MobileSearchBar";
import HeaderTopBar from "./_components/headerTopBar/HeaderTopBar";
import HeaderSecondBar from "./_components/headerSecondBar/HeaderSecondBar";

function Header() {
    const [categoriesOpen, setCategoriesOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const mobileSearchRef = useRef<HTMLInputElement>(null!);

    const handleSearchOpen = () => {
        setSearchOpen(true);
        setTimeout(() => mobileSearchRef.current?.focus(), 50);
    };

    const handleSearchClose = () => {
        setSearchOpen(false);
        if (mobileSearchRef.current) mobileSearchRef.current.value = "";
    };

    return (
        <>
            <header className="sticky top-0 z-40 w-full">
                <HeaderTopBar />

                <MobileSearchBar
                    inputRef={mobileSearchRef}
                    open={searchOpen}
                    onClose={handleSearchClose}
                />

                <HeaderSecondBar />
            </header>

            <MobileCategoriesDrawer
                open={categoriesOpen}
                onClose={() => setCategoriesOpen(false)}
            />

            <MobileBottomBar
                categoriesOpen={categoriesOpen}
                onCategoriesOpen={() => setCategoriesOpen((p) => !p)}
                searchOpen={searchOpen}
                onSearchToggle={() =>
                    searchOpen ? handleSearchClose() : handleSearchOpen()
                }
            />
        </>
    );
}

export default Header;
