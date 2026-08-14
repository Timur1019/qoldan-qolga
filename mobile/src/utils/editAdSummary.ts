import {
  BODY_TYPE_OPTIONS,
  CONDITION_OPTIONS,
  EXTERIOR_COLOR_OPTIONS,
  FUEL_TYPE_OPTIONS,
  TRANSMISSION_OPTIONS,
  type FilterOption,
} from '@/constants/filterOptions';
import type { AppLanguage } from '@/i18n/types';
import { formatPrice } from '@/utils/formatters';
import type { CreateAdFormState } from '@/utils/createAdForm';
import { localizedName } from '@/utils/localizedName';

export type EditAdSectionKey =
  | 'category'
  | 'photos'
  | 'title'
  | 'price'
  | 'specs'
  | 'description'
  | 'location'
  | 'contact';

export type EditAdSummarySection = {
  key: EditAdSectionKey;
  title: string;
  lines: string[];
};

function labelOf(options: FilterOption[], value?: string | null) {
  if (!value) return '';
  return options.find((o) => o.value === value)?.label || value;
}

export function buildEditAdSummary(
  form: CreateAdFormState,
  opts: {
    existingImageCount: number;
    regionLabel: string;
    language: AppLanguage;
    t: (key: string, fallback?: string) => string;
  }
): EditAdSummarySection[] {
  const { t, language } = opts;
  const photoCount = opts.existingImageCount + form.localImages.length;
  const priceLine = form.giveAway
    ? t('edit.free', 'Bepul')
    : form.price
      ? `${t('edit.priceLabel', 'Narx')}: ${formatPrice(form.price, form.currency)}`
      : t('edit.priceMissing', 'Narx ko‘rsatilmagan');

  const specs: string[] = [];
  if (form.itemCondition) {
    specs.push(`${t('edit.condition', 'Holati')}: ${labelOf(CONDITION_OPTIONS, form.itemCondition)}`);
  }
  if (form.bodyType) {
    specs.push(`${t('edit.body', 'Kuzov')}: ${labelOf(BODY_TYPE_OPTIONS, form.bodyType)}`);
  }
  if (form.transmission) {
    specs.push(
      `${t('edit.transmission', 'Uzatma')}: ${labelOf(TRANSMISSION_OPTIONS, form.transmission)}`
    );
  }
  if (form.exteriorColor) {
    specs.push(
      `${t('edit.color', 'Rang')}: ${labelOf(EXTERIOR_COLOR_OPTIONS, form.exteriorColor)}`
    );
  }
  if (form.fuelType) {
    specs.push(`${t('edit.fuel', "Yoqilg'i")}: ${labelOf(FUEL_TYPE_OPTIONS, form.fuelType)}`);
  }
  if (form.brandLabel || form.brandId) {
    specs.push(`${t('edit.brand', 'Brend')}: ${form.brandLabel || form.brandId}`);
  }
  if (form.year) specs.push(`${t('edit.year', 'Yil')}: ${form.year}`);
  if (form.mileage) specs.push(`${t('edit.mileage', 'Yurgan')}: ${form.mileage} km`);

  const locationParts = [opts.regionLabel, form.district, form.address].filter(Boolean);
  const locationLines = [
    locationParts.join(', ') || t('edit.locationMissing', 'Manzil ko‘rsatilmagan'),
    `${t('edit.landmark', "Yo'nalish")}: ${form.landmark || '—'}`,
  ];

  const priceLines = [priceLine];
  if (form.isNegotiable) priceLines.push(t('edit.negotiable', 'Narx kelishiladi'));

  return [
    {
      key: 'category',
      title: t('edit.category'),
      lines: [localizedName(form.category, language, form.category?.code || '—')],
    },
    {
      key: 'photos',
      title: t('edit.photos'),
      lines: [photoCount > 0 ? `${photoCount}` : t('edit.noPhotos', 'Rasm yo‘q')],
    },
    {
      key: 'title',
      title: t('edit.adTitle'),
      lines: [form.title.trim() || '—'],
    },
    {
      key: 'price',
      title: t('edit.price'),
      lines: priceLines,
    },
    {
      key: 'specs',
      title: t('edit.specs'),
      lines: specs.length ? specs : [t('edit.noSpecs', 'Qo‘shimcha xususiyatlar yo‘q')],
    },
    {
      key: 'description',
      title: t('edit.description'),
      lines: [form.description.trim() || '—'],
    },
    {
      key: 'location',
      title: t('edit.location'),
      lines: locationLines,
    },
    {
      key: 'contact',
      title: t('edit.contact'),
      lines: [
        form.phone || t('edit.noPhone', 'Telefon yo‘q'),
        form.telegramUsername
          ? `@${form.telegramUsername.replace(/^@/, '')}`
          : t('edit.noTelegram', 'Telegram yo‘q'),
      ],
    },
  ];
}
