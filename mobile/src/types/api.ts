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
  address?: string | null;
  landmark?: string | null;
  locationLat?: number | null;
  locationLng?: number | null;
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
  year?: number | null;
  mileage?: number | null;
  bodyType?: string | null;
  transmission?: string | null;
  fuelType?: string | null;
  driveType?: string | null;
  engineVolume?: number | null;
  exteriorColor?: string | null;
  seats?: number | null;
  steering?: string | null;
  ownersCount?: number | null;
  brandNameUz?: string | null;
  brandNameRu?: string | null;
  modelNameUz?: string | null;
  modelNameRu?: string | null;
  modelCustom?: string | null;
  dealType?: string | null;
  rooms?: number | null;
  areaM2?: number | null;
  landAreaM2?: number | null;
  floor?: number | null;
  floorsTotal?: number | null;
  buildingType?: string | null;
  renovation?: string | null;
  furnished?: boolean | null;
  canRent?: boolean | null;
  jobProfession?: string | null;
  jobIndustry?: string | null;
  jobEmployment?: string | null;
  jobSchedule?: string | null;
  jobExperience?: string | null;
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
  adImageUrl?: string | null;
  adPrice?: number | null;
  adCurrency?: string | null;
  adRegion?: string | null;
  otherPartyLastSeenAt?: string | null;
  lastMessageText?: string | null;
  lastMessageAt?: string | null;
}

export interface MessageDto {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string | null;
  senderIsStore: boolean | null;
  text: string;
  attachmentUrl?: string | null;
  messageType?: string | null;
  status?: 'SENT' | 'DELIVERED' | 'READ' | null;
  createdAt: string;
}
