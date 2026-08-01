import { Link } from "react-router";

interface FooterLink {
  to: string;
  label: string;
}

interface FooterLinkColumnProps {
  title: string;
  links: FooterLink[];
}

export default function FooterLinkColumn({ title, links }: FooterLinkColumnProps) {
  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      <h3 className="text-sm sm:text-base font-semibold text-blue-800">{title}</h3>
      <ul className="space-y-2 sm:space-y-3">
        {links.map(({ to, label }) => (
          <li key={to}>
            <Link
              to={to}
              className="text-xs sm:text-sm text-gray-500 hover:text-blue-800 transition-colors duration-150"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}