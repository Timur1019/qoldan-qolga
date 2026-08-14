export interface CategoryDto {
  id: string;
  nameUz: string;
  nameRu: string;
  code: string;
  showOnHome: boolean;
  parentId: string | null;
  parentCode: string | null;
  hasChildren: boolean;
}

export interface AdListItemDto {
  id: string;
  title: string;
  price: number;
  currency: string;
  category: string;
  region: string;
  district?: string | null;
  description: string;
  status: string;
  isNegotiable: boolean;
  mainImageUrl: string | null;
  imageUrls: string[];
  createdAt: string;
  favorite: boolean;
  userId: string;
  userDisplayName: string;
  userAvatar: string | null;
  phone: string;
  averageRating: number | null;
  totalReviews: number | null;
  sellerIsStore: boolean;
  sellerType?: string | null;
  onlineShowing?: boolean | null;
}

export interface AdImageDto {
  id: string;
  url: string;
  position: number;
}

export interface AdDetailDto {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  brandId: string | null;
  itemCondition: string | null;
  phone: string;
  telegramUsername: string | null;
  email: string | null;
  region: string;
  district: string | null;
  status: string;
  isNegotiable: boolean;
  canDeliver: boolean;
  sellerType: string | null;
  onlineShowing?: boolean | null;
  userId: string;
  userDisplayName: string;
  sellerIsStore: boolean;
  views: number;
  createdAt: string;
  images: AdImageDto[];
  favorite: boolean;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  last: boolean;
}

export interface ConversationDto {
  id: string;
  adId: string;
  adTitle: string;
  otherPartyName: string;
  otherPartyId: string;
  otherPartyAvatar: string | null;
  createdAt: string;
  messageCount: number;
  incomingMessageCount: number;
  unreadCount: number;
}

export interface MessageDto {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string | null;
  senderIsStore: boolean | null;
  text: string;
  createdAt: string;
}
