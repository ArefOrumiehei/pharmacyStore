// api/Account Types and Interfaces
import type { CommentStatus } from "@/pages/profile/sections/comments/_components/commentCard/_components/commentStatusBadge/CommentStatusBadge";

// User
export interface IUserProfile {
  id: string;
  fullname: string;
  username: string;
  email?: string;
  mobile?: string;
  profilePhoto?: string;
  isActive: boolean,
  hasPassword: boolean;
  isCompleted: boolean;
  creationDate: string;
  roleId: number,
  roleName: string,
}

// Favs


// Orders
export interface IOrder {
  id: number;
  userId: number;
  creationDate: string;
  lastModifiedDate: string;
  sortDate: string;
  status: number;
  statusTitle: string;
  paymentMethod: string;
  paymentMethodInt: number;
  postTrackingNumber: string;
  totalAmount: number;
  discountAmount: number;
  couponCode: string;
  appliedCouponId: number;
  orderCouponAmount: number;
  payAmount: number;
  items: IOrderItem[];
  itemsCount: number;
  receiverFullName: string;
  receiverMobile: string;
  receiverAddress: string;
  receiverZipCode: string;
}

export interface IOrderItem {
  id: number;
  productId: number;
  productName: string;
  productPicture: string;
  productFullSlug: string;
  qty: number;
  unitPrice: number;
  discountRate: number;
  totalPriceWithDiscount: number;
}

export interface ILatestOrder {
  id: number;
  userId: number;
  creationDate: string;
  creationDateDisplay: string;
  status: number;
  statusTitle: string;
  payAmount: number;
  itemsCount: number;
}

// Tickets
export interface ITicket {
  userId: number;
  id: number;
  subject: string;
  message: string;
  adminReply: string | null;
  creationDate: string;
  adminReplyDate: string | null;
  isAnswered: boolean;
  trackingCode: string;
}

// Comments
export interface IUserComments {
  id: number;
  message: string | null;
  creationDate: string;
  rate: number;
  likeCount: number;
  dislikeCount: number;
  reply: string;
  replyDate: string;
  productSlug: string;
  productName: string;
  categoryName: string;
  categoryFullSlug: string;
  status: CommentStatus;
}

// Addresses
export interface IAddress {
  id: number;
  receiverFullName: string;
  receiverMobile: string;
  receiverAddress: string;
  receiverZipCode: string;
}

// Overview
export interface IOverview {
  totalOrders: number;
  totalRefundedOrders: number;
  totalDeliveredOrders: number;
  totalFaves: number;
  totalAddresses: number;
  latestOrders: ILatestOrder[];
}