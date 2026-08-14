import type { PromoBannerItem } from '@/components/PromoBanners/PromoBanners';

export function mapPromoBanner(b: Record<string, unknown>, index = 0): PromoBannerItem {
  return {
    id: String(b.id ?? index),
    title: (b.title as string) || (b.titleRu as string) || '',
    imageUrl: (b.imageUrl as string) || (b.image as string) || null,
    linkUrl: (b.link as string) || (b.linkUrl as string) || null,
  };
}
