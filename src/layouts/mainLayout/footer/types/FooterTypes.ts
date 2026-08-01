export interface FooterLink {
  to: string;
  label: string;
}

export interface FooterLinkColumnProps {
  title: string;
  links: FooterLink[];
}