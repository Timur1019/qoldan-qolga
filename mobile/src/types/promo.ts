export type PromoProvider = 'PAYME' | 'CLICK';

export type PromoServiceDto = {
  code: string;
  nameRu: string;
  nameUz: string;
  price: number;
  durationDays?: number | null;
  priority?: number | null;
  featuresRu?: string[];
  featuresUz?: string[];
};

export type PromoOrderDto = {
  orderId: string;
  paymentUrl?: string | null;
  amount?: number | null;
  currency?: string | null;
  status?: string | null;
  provider?: string | null;
  serviceCode?: string | null;
};
