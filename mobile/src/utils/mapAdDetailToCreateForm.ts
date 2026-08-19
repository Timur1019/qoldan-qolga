import type { AdDetailDto, CategoryDto } from '@/types/api';
import { EMPTY_CREATE_AD, type CreateAdFormState } from '@/utils/createAdForm';
import { extractLocationFromDescription } from '@/utils/descriptionLocation';

function splitCsv(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter(Boolean).map(String);
  if (!value) return [];
  return String(value)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function str(v: unknown) {
  if (v == null || v === '') return '';
  return String(v);
}

/** Базовое заполнение формы из деталей объявления (edit). */
export function mapAdDetailToCreateForm(
  ad: AdDetailDto,
  category: CategoryDto | null
): { form: CreateAdFormState; existingImageUrls: string[] } {
  const loc = extractLocationFromDescription(ad.description);
  const existingImageUrls = (ad.images || []).map((i) => i.url).filter(Boolean);
  const detail = ad as AdDetailDto & Record<string, unknown>;
  const brandLabel =
    str(detail.brandNameUz) || str(detail.brandNameRu) || str(ad.brandId) || '';

  return {
    existingImageUrls,
    form: {
      ...EMPTY_CREATE_AD,
      title: ad.title || '',
      description: loc.description || '',
      price: ad.price != null ? String(ad.price) : '',
      currency: ad.currency === 'USD' ? 'USD' : 'UZS',
      phone: ad.phone || '',
      telegramUsername: ad.telegramUsername || '',
      category,
      region: ad.region || '',
      district: ad.district || '',
      address: loc.address || '',
      landmark: loc.landmark || '',
      locationLat: detail.locationLat != null ? String(detail.locationLat) : '',
      locationLng: detail.locationLng != null ? String(detail.locationLng) : '',
      itemCondition: ad.itemCondition || 'USED',
      sellerType: ad.sellerType || 'PRIVATE',
      isNegotiable: !!ad.isNegotiable,
      canDeliver: !!ad.canDeliver,
      giveAway: !!detail.giveAway,
      onlineShowing: !!detail.onlineShowing,
      urgentBargain: !!detail.urgentBargain,
      canRent: !!detail.canRent,
      hasLicense: !!detail.hasLicense,
      worksByContract: !!detail.worksByContract,
      brandId: ad.brandId || '',
      brandLabel,
      modelId: str(detail.modelId),
      modelCustom: str(detail.modelCustom),
      year: str(detail.year),
      mileage: str(detail.mileage),
      bodyType: str(detail.bodyType),
      transmission: str(detail.transmission),
      fuelType: str(detail.fuelType),
      driveType: str(detail.driveType),
      engineVolume: str(detail.engineVolume),
      exteriorColor: str(detail.exteriorColor),
      seats: str(detail.seats),
      steering: str(detail.steering),
      ownersCount: str(detail.ownersCount),
      dealType: (str(detail.dealType) as '' | 'SALE' | 'RENT') || '',
      rooms: str(detail.rooms),
      areaM2: str(detail.areaM2),
      landAreaM2: str(detail.landAreaM2),
      floor: str(detail.floor),
      floorsTotal: str(detail.floorsTotal),
      buildingType: str(detail.buildingType),
      renovation: str(detail.renovation),
      furnished: !!detail.furnished,
      jobProfession: str(detail.jobProfession),
      jobIndustry: str(detail.jobIndustry),
      jobPriority: str(detail.jobPriority) || 'ANY',
      jobEmployment: splitCsv(detail.jobEmployment),
      jobSchedule: splitCsv(detail.jobSchedule),
      jobWorkFormat: str(detail.jobWorkFormat) || 'ANY',
      jobSalaryPeriod: str(detail.jobSalaryPeriod) || 'ANY',
      jobPayFrequency: splitCsv(detail.jobPayFrequency),
      jobExperience: str(detail.jobExperience),
      jobCitizenship: str(detail.jobCitizenship),
      jobAgeFrom: str(detail.jobAgeFrom),
      jobAgeTo: str(detail.jobAgeTo),
      jobCompanyVerified: !!detail.jobCompanyVerified,
      jobLargeCompany: !!detail.jobLargeCompany,
      jobBenefits: splitCsv(detail.jobBenefits),
      jobForCandidates: splitCsv(detail.jobForCandidates),
      localImages: [],
    },
  };
}
