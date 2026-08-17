import type { ShareData } from "@/hooks/useShare";
import type { Product } from "@/store/useProductsStore";
import type { ReactNode } from "react";

export interface ProductComment {
  id: number;
  userId: number;
  username: string;
  message: string;
  rate: number;
  creationDate: string;
  likeCount: number;
  dislikeCount: number;
  likedByUserIds?: number[];
  dislikedByUserIds?: number[];
  isBuyer: boolean;
  hasEdited: boolean;
  reply: string;
  replyDate: string;
  lastModifedDate: string;
}

export interface CommentsSectionProps {
  productId: number;
  initialComments: ProductComment[];
}

export interface CommentsListProps {
  comments: ProductComment[];
  currentUserId?: string | number;
  onLike: (id: number) => void;
  onDislike: (id: number) => void;
  onEdit: (msg: string, rate: number, id: number) => void;
  onDelete: (id: number) => void;
  deletingCommentId?: number | null;
}

export interface CommentFormProps {
  message: string;
  rate: number;
  isEditing: boolean;
  onMessageChange: (v: string) => void;
  onRateChange: (v: number) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export interface CommentCardProps {
  comment: ProductComment;
  currentUserId?: string | number;
  onLike: () => void;
  onDislike: () => void;
  onEdit: () => void;
  onDelete: () => void;
  deleteLoading?: boolean;
}

export interface ProductImage {
  picture?: string;
  pictureAlt?: string;
  isRemoved?: boolean;
}

export interface ProductGalleryProps {
  isLoaded: boolean;
  product: Product | null;
  images: ProductImage[];
  activeImage: number;
  onChangeImage: (index: number) => void;
}

export interface MetaRowProps {
  label: string;
  value?: string;
  href?: string;
  icon?: ReactNode;
}

export interface IProductSpecifications {
  countryOfOrigin?: string;
  productForm?: string;
  attributes?: Record<string, string>;
}

export interface RatingStarsProps {
  rate: number;
  setRate: (value: number) => void;
}

export interface PurchasePanelProps {
  isLoaded: boolean;
  product: Product | null;
  displayPrice?: number;
}

export interface StockBadgeProps {
  isLoaded: boolean;
  product: Product | null;
  initialNotifyRequested?: boolean;
  onToggleNotifyMe?: (productId: number, nextValue: boolean) => Promise<void> | void;
}

export interface QuantityStepperProps {
  qty: number;
  max: number;
  loading?: boolean;
  onIncrement: () => void;
  onDecrement: () => void;
}

export interface PriceDisplayProps {
  isLoaded: boolean;
  product: Product | null;
  displayPrice?: number;
}

export interface AddToCartControlProps {
  product: Product;
}

export type ProductTabs = "description" | "reviews";

export interface ProductTabsProps {
  activeTab: ProductTabs;
  onTabChange: (tab: ProductTabs) => void;
  description: string;
  comments: ProductComment[];
  productId: number;
}

export interface ProductInfoProps {
  isLoaded: boolean;
  product: Product | null;
}

export interface ShareButtonProps {
  data: ShareData;
  className?: string;
  btnStyle?: "icon&text" | "icon";
}

export interface ProductMetaProps {
  isLoaded: boolean;
  product: Product | null;
}

export interface ProductInfoBadgesProps {
  isLoaded: boolean;
  product: Product | null;
}

export interface ProductHeaderProps {
  isLoaded: boolean;
  product: Product | null;
  isFavorite: boolean;
}

export interface FavoriteBtnProps {
  productId: number;
  initialIsFavorite: boolean;
}