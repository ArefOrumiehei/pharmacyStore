import { Separator } from "@/components/ui/separator";
import { Link } from "react-router";
import MegaMenu from "../mega_menu/MegaMenu";

const navLinks = [
  { to: "/aboutus", label: "درباره ما" },
  { to: "/contactus", label: "تماس با ما" },
];

function NavigationDesktop() {
  return (
    <nav className="sticky top-0 left-0 z-40 w-full px-12 rounded-b-lg bg-blue-800 backdrop-blur-md text-white/90 transition-transform duration-300">
      <div className="hidden md:flex items-center py-2 gap-1">

        <MegaMenu />

        <Separator orientation="vertical" className="bg-gray-500/60 h-6 mx-3" />

        <ul className="flex items-center gap-1">
          {navLinks.map(({ to, label }) => (
            <li key={to}>
              <Link
                to={to}
                className="px-4 py-2 rounded-lg text-sm font-medium hover:text-white transition-all duration-200"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

      </div>
    </nav>
  );
}

export default NavigationDesktop;
