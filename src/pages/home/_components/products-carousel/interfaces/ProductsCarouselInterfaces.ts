import type { Product } from "@/store/useProductsStore";

export interface CarouselArrowBtnProps {
  direction: "left" | "right";
  onClick: () => void;
  className: string;
}

export interface CountdownTimerProps {
  endTime: string | Date;
  onExpire?: () => void;
  className?: string;
}

export interface CarouselHeaderProps {
  title: string;
  icon: React.ReactNode;
  headerClass: string;
  headerBgClass: string;
  dividerClass: string;
  viewMoreClass: string;
  viewMoreLink?: string;
  showViewMore: boolean;
  dealEndTime?: string | Date;
  onDealExpire?: () => void;
}

export type CarouselVariant =
    | "latest"
    | "topRated"
    | "recommended"
    | "forYou"
    | "flashDeal"
    | "default";

export interface VariantStyle {
  wrapper: string;
  header: string;
  headerBg: string;
  divider: string;
  viewMore: string;
  arrowBtn: string;
  icon: React.ReactNode;
  emptyText: string;
}

export interface ProductsCarouselProps {
  title: string;
  products?: Product[];
  loading?: boolean;
  viewMoreLink?: string;
  variant?: CarouselVariant;
  dealEndTime?: string | Date;
}