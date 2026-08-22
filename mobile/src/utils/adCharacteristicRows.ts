import {
  BODY_TYPE_OPTIONS,
  BUILDING_TYPE_OPTIONS,
  CONDITION_OPTIONS,
  DEAL_TYPE_OPTIONS,
  DRIVE_TYPE_OPTIONS,
  EXTERIOR_COLOR_OPTIONS,
  FUEL_TYPE_OPTIONS,
  OWNERS_COUNT_OPTIONS,
  RENOVATION_OPTIONS,
  ROOMS_OPTIONS,
  SEATS_OPTIONS,
  STEERING_OPTIONS,
  TRANSMISSION_OPTIONS,
  type FilterOption,
} from '@/constants/filterOptions';
import type { AdDetailDto } from '@/types/api';
import type { AppLanguage } from '@/i18n/types';

export type CharacteristicRow = { label: string; value: string };

function labelOf(options: FilterOption[], value?: string | null) {
  if (!value) return '';
  return options.find((o) => o.value === value)?.label || value;
}

function roomsValue(rooms: unknown, t: (key: string, fallback?: string) => string) {
  if (rooms == null || rooms === '') return '';
  const n = Number(rooms);
  if (Number.isNaN(n)) return String(rooms);
  if (n === 0) return t('ads.roomsStudio', 'Studiya');
  if (n >= 5) return labelOf(ROOMS_OPTIONS, '5PLUS') || '5+';
  return labelOf(ROOMS_OPTIONS, String(n)) || String(n);
}

function brandModel(ad: AdDetailDto & Record<string, unknown>, language: AppLanguage) {
  const brand = language === 'ru' ? ad.brandNameRu || ad.brandNameUz : ad.brandNameUz || ad.brandNameRu;
  const model = ad.modelCustom || (language === 'ru' ? ad.modelNameRu : ad.modelNameUz);
  return [brand, model].filter(Boolean).join(' ');
}

/** Строки характеристик как на вебе (транспорт / недвижимость / работа / общее). */
export function buildAdCharacteristicRows(
  ad: AdDetailDto | null | undefined,
  opts: {
    language: AppLanguage;
    categoryLabel?: string;
    regionLabel?: string;
    t: (key: string, fallback?: string) => string;
  }
): CharacteristicRow[] {
  if (!ad) return [];
  const { language, categoryLabel, regionLabel, t } = opts;
  const detail = ad as AdDetailDto & Record<string, unknown>;
  const rows: CharacteristicRow[] = [];

  if (categoryLabel) {
    rows.push({ label: t('ads.category', 'Kategoriya'), value: categoryLabel });
  }
  if (regionLabel) {
    rows.push({ label: t('ads.region', 'Hudud'), value: regionLabel });
  }

  const brand = brandModel(detail, language);
  if (brand) rows.push({ label: t('edit.brand', 'Brend'), value: brand });
  if (detail.year != null) {
    rows.push({ label: t('edit.year', 'Yil'), value: String(detail.year) });
  }
  if (detail.mileage != null) {
    rows.push({ label: t('edit.mileage', 'Yurgani'), value: String(detail.mileage) });
  }
  if (detail.bodyType) {
    rows.push({ label: t('edit.body', 'Kuzov'), value: labelOf(BODY_TYPE_OPTIONS, String(detail.bodyType)) });
  }
  if (detail.transmission) {
    rows.push({
      label: t('edit.transmission', 'Uzatma'),
      value: labelOf(TRANSMISSION_OPTIONS, String(detail.transmission)),
    });
  }
  if (detail.fuelType) {
    rows.push({ label: t('edit.fuel', "Yoqilg'i"), value: labelOf(FUEL_TYPE_OPTIONS, String(detail.fuelType)) });
  }
  if (detail.driveType) {
    rows.push({
      label: t('ads.driveType', 'Privod'),
      value: labelOf(DRIVE_TYPE_OPTIONS, String(detail.driveType)),
    });
  }
  if (detail.engineVolume != null) {
    rows.push({ label: t('ads.engineVolumeLabel', 'Hajm, l'), value: String(detail.engineVolume) });
  }
  if (detail.exteriorColor) {
    rows.push({
      label: t('edit.color', 'Rang'),
      value: labelOf(EXTERIOR_COLOR_OPTIONS, String(detail.exteriorColor)),
    });
  }
  if (detail.seats != null) {
    rows.push({
      label: t('ads.seats', 'O‘rindiqlar'),
      value: labelOf(SEATS_OPTIONS, String(detail.seats)) || String(detail.seats),
    });
  }
  if (detail.steering) {
    rows.push({
      label: t('ads.steering', 'Rul'),
      value: labelOf(STEERING_OPTIONS, String(detail.steering)),
    });
  }
  if (detail.ownersCount != null) {
    rows.push({
      label: t('ads.owners', 'Egalar'),
      value: labelOf(OWNERS_COUNT_OPTIONS, String(detail.ownersCount)) || String(detail.ownersCount),
    });
  }

  if (detail.dealType) {
    rows.push({ label: t('ads.dealType', 'Bitim'), value: labelOf(DEAL_TYPE_OPTIONS, String(detail.dealType)) });
  }
  if (detail.rooms != null) {
    rows.push({ label: t('ads.rooms', 'Xonalar'), value: roomsValue(detail.rooms, t) });
  }
  if (detail.areaM2 != null) {
    rows.push({ label: t('ads.area', 'Maydon'), value: `${detail.areaM2} m²` });
  }
  if (detail.landAreaM2 != null) {
    rows.push({ label: t('ads.landArea', 'Yer'), value: `${detail.landAreaM2} m²` });
  }
  if (detail.floor != null || detail.floorsTotal != null) {
    const floor = detail.floor != null ? String(detail.floor) : '—';
    const total = detail.floorsTotal != null ? String(detail.floorsTotal) : '—';
    rows.push({ label: t('ads.floor', 'Qavat'), value: `${floor} / ${total}` });
  }
  if (detail.buildingType) {
    rows.push({
      label: t('ads.buildingType', 'Uy turi'),
      value: labelOf(BUILDING_TYPE_OPTIONS, String(detail.buildingType)),
    });
  }
  if (detail.renovation) {
    rows.push({
      label: t('ads.renovation', 'Taʼmir'),
      value: labelOf(RENOVATION_OPTIONS, String(detail.renovation)),
    });
  }
  if (detail.furnished) {
    rows.push({ label: t('ads.furnished', 'Mebel'), value: t('common.yes', 'Ha') });
  }

  if (detail.jobProfession) {
    rows.push({ label: t('edit.profession', 'Kasb'), value: String(detail.jobProfession) });
  }
  if (detail.jobIndustry) {
    rows.push({ label: t('ads.jobIndustry', 'Soha'), value: String(detail.jobIndustry) });
  }
  if (detail.jobEmployment) {
    rows.push({ label: t('ads.jobEmployment', 'Bandlik'), value: String(detail.jobEmployment) });
  }
  if (detail.jobSchedule) {
    rows.push({ label: t('ads.jobSchedule', 'Jadval'), value: String(detail.jobSchedule) });
  }
  if (detail.jobExperience) {
    rows.push({ label: t('ads.jobExperience', 'Tajriba'), value: String(detail.jobExperience) });
  }

  if (ad.itemCondition && detail.dealType == null && !detail.jobProfession) {
    rows.push({
      label: t('ads.condition', 'Holati'),
      value: labelOf(CONDITION_OPTIONS, ad.itemCondition) || ad.itemCondition,
    });
  }
  if (detail.canRent) {
    rows.push({ label: t('ads.canRent', 'Ijara'), value: t('common.yes', 'Ha') });
  }
  if (ad.district) {
    rows.push({ label: t('ads.district', 'Tuman'), value: ad.district });
  }
  if (ad.views != null) {
    rows.push({ label: t('ads.views', "Ko'rishlar"), value: String(ad.views) });
  }

  return rows;
}
