import type { CategoryDto } from '@/types/api';
import {
  categoryFilterFlags,
  realEstateFieldFlags,
  transportFieldFlags,
} from '@/constants/categoryFilters';
import { jobFieldFlags } from '@/constants/jobCategories';
import { normalizeEngineVolume } from '@/utils/engineVolume';
import { normalizeSellerType } from '@/constants/sellerTypes';
import { appendLocationToDescription } from '@/utils/descriptionLocation';

export interface CreateAdFormState {
  title: string;
  description: string;
  price: string;
  currency: 'UZS' | 'USD';
  phone: string;
  telegramUsername: string;
  category: CategoryDto | null;
  region: string;
  district: string;
  address: string;
  landmark: string;
  locationLat: string;
  locationLng: string;
  itemCondition: string;
  sellerType: string;
  isNegotiable: boolean;
  canDeliver: boolean;
  giveAway: boolean;
  onlineShowing: boolean;
  urgentBargain: boolean;
  canRent: boolean;
  hasLicense: boolean;
  worksByContract: boolean;
  // transport
  brandId: string;
  brandLabel: string;
  modelId: string;
  modelCustom: string;
  year: string;
  mileage: string;
  bodyType: string;
  transmission: string;
  fuelType: string;
  driveType: string;
  engineVolume: string;
  exteriorColor: string;
  seats: string;
  steering: string;
  ownersCount: string;
  // real estate
  dealType: '' | 'SALE' | 'RENT';
  rooms: string;
  areaM2: string;
  landAreaM2: string;
  floor: string;
  floorsTotal: string;
  buildingType: string;
  renovation: string;
  furnished: boolean;
  jobProfession: string;
  jobIndustry: string;
  jobPriority: string;
  jobEmployment: string[];
  jobSchedule: string[];
  jobWorkFormat: string;
  jobSalaryPeriod: string;
  jobPayFrequency: string[];
  jobExperience: string;
  jobCitizenship: string;
  jobAgeFrom: string;
  jobAgeTo: string;
  jobCompanyVerified: boolean;
  jobLargeCompany: boolean;
  jobBenefits: string[];
  jobForCandidates: string[];
  localImages: string[];
}

export const EMPTY_CREATE_AD: CreateAdFormState = {
  title: '',
  description: '',
  price: '',
  currency: 'UZS',
  phone: '',
  telegramUsername: '',
  category: null,
  region: '',
  district: '',
  address: '',
  landmark: '',
  locationLat: '',
  locationLng: '',
  itemCondition: 'USED',
  sellerType: 'PRIVATE',
  isNegotiable: false,
  canDeliver: false,
  giveAway: false,
  onlineShowing: false,
  urgentBargain: false,
  canRent: false,
  hasLicense: false,
  worksByContract: false,
  brandId: '',
  brandLabel: '',
  modelId: '',
  modelCustom: '',
  year: '',
  mileage: '',
  bodyType: '',
  transmission: '',
  fuelType: '',
  driveType: '',
  engineVolume: '',
  exteriorColor: '',
  seats: '',
  steering: '',
  ownersCount: '',
  dealType: '',
  rooms: '',
  areaM2: '',
  landAreaM2: '',
  floor: '',
  floorsTotal: '',
  buildingType: '',
  renovation: '',
  furnished: false,
  jobProfession: '',
  jobIndustry: '',
  jobPriority: 'ANY',
  jobEmployment: [],
  jobSchedule: [],
  jobWorkFormat: 'ANY',
  jobSalaryPeriod: 'ANY',
  jobPayFrequency: [],
  jobExperience: '',
  jobCitizenship: '',
  jobAgeFrom: '',
  jobAgeTo: '',
  jobCompanyVerified: false,
  jobLargeCompany: false,
  jobBenefits: [],
  jobForCandidates: [],
  localImages: [],
};

function numOrUndef(v: string) {
  if (!v.trim()) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

function intOrUndef(v: string) {
  if (!v.trim()) return undefined;
  if (v === '8PLUS') return 8;
  if (v === '4PLUS') return 4;
  if (v === '5PLUS') return 5;
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : undefined;
}

export function validateCreateAd(form: CreateAdFormState, breadcrumb: CategoryDto[] = []): string | null {
  if (!form.title.trim()) return 'Sarlavha majburiy';
  if (!form.description.trim()) return 'Tavsif majburiy';
  if (!form.category) return 'Kategoriya tanlang';
  if (!form.phone.trim()) return 'Telefon majburiy';
  const price = Number(form.price);
  if (!form.giveAway && (!Number.isFinite(price) || price < 0)) return "Narx noto'g'ri";

  const code = form.category.code;
  const transport = transportFieldFlags(code, breadcrumb);
  const realEstate = realEstateFieldFlags(code, breadcrumb);
  const jobs = jobFieldFlags(code, breadcrumb);
  if (jobs.jobs && !form.jobProfession.trim()) return 'Kasbni tanlang';

  if (realEstate.dealType && !form.dealType) return 'Bitim turini tanlang';
  if (realEstate.rooms && form.rooms === '') return 'Xonalar sonini tanlang';
  if (realEstate.area && !form.areaM2.trim()) return 'Maydon majburiy';
  if (realEstate.landArea && !form.landAreaM2.trim()) return 'Yer maydoni majburiy';
  if (realEstate.floor && !form.floor.trim()) return 'Qavat majburiy';

  if (transport.cars) {
    if (!form.brandId) return 'Brend tanlang';
    if (!form.modelId && !form.modelCustom.trim()) return 'Model tanlang yoki kiriting';
    if (!form.year.trim()) return 'Yil majburiy';
    if (!form.mileage.trim()) return 'Yurgani majburiy';
  } else if (transport.motorVehicle) {
    if (transport.year && !form.year.trim()) return 'Yil majburiy';
  }

  return null;
}

export function buildCreateAdPayload(
  form: CreateAdFormState,
  imageUrls: string[],
  breadcrumb: CategoryDto[] = []
) {
  const expires = new Date();
  expires.setDate(expires.getDate() + 30);
  const code = form.category!.code;
  const transport = transportFieldFlags(code, breadcrumb);
  const realEstate = realEstateFieldFlags(code, breadcrumb);
  const flags = categoryFilterFlags(code, breadcrumb);

  const description = appendLocationToDescription(form.description.trim(), {
    address: form.address,
    landmark: form.landmark,
  });

  const body: Record<string, unknown> = {
    title: form.title.trim(),
    description,
    price: form.giveAway ? 0 : Number(form.price),
    currency: form.currency,
    category: code,
    phone: form.phone.trim(),
    expiresAt: expires.toISOString(),
    imageUrls,
    itemCondition: flags.condition ? form.itemCondition || 'USED' : 'USED',
    sellerType: normalizeSellerType(form.sellerType) || form.sellerType || undefined,
    isNegotiable: form.isNegotiable,
    canDeliver: flags.canDeliver ? form.canDeliver : false,
    giveAway: flags.giveAway ? form.giveAway : false,
    onlineShowing: flags.onlineShowing ? form.onlineShowing : false,
    urgentBargain: flags.urgentBargain ? form.urgentBargain : false,
    canRent: flags.canRent ? form.canRent : false,
    hasLicense: flags.license ? form.hasLicense : false,
    worksByContract: flags.contract ? form.worksByContract : false,
  };

  if (form.region) body.region = form.region;
  if (form.district) body.district = form.district;
  if (form.telegramUsername.trim()) {
    body.telegramUsername = form.telegramUsername.trim().replace(/^@/, '');
  }
  const lat = numOrUndef(form.locationLat);
  const lng = numOrUndef(form.locationLng);
  if (lat != null) body.locationLat = lat;
  if (lng != null) body.locationLng = lng;

  if (transport.motorVehicle) {
    if (form.brandId) body.brandId = form.brandId;
    if (form.modelId) body.modelId = form.modelId;
    if (form.modelCustom.trim()) body.modelCustom = form.modelCustom.trim();
    const year = intOrUndef(form.year);
    const mileage = intOrUndef(form.mileage);
    if (year != null) body.year = year;
    if (mileage != null) body.mileage = mileage;
    if (form.bodyType) body.bodyType = form.bodyType;
    if (form.transmission) body.transmission = form.transmission;
    if (form.fuelType) body.fuelType = form.fuelType;
    if (form.driveType) body.driveType = form.driveType;
    const engineVolume = normalizeEngineVolume(numOrUndef(form.engineVolume));
    if (engineVolume != null) body.engineVolume = engineVolume;
    if (form.exteriorColor) body.exteriorColor = form.exteriorColor;
    const seats = intOrUndef(form.seats);
    if (seats != null) body.seats = seats;
    if (form.steering) body.steering = form.steering;
    const owners = intOrUndef(form.ownersCount);
    if (owners != null) body.ownersCount = owners;
  }

  if (realEstate.realEstate) {
    if (form.dealType) body.dealType = form.dealType;
    const rooms = intOrUndef(form.rooms);
    if (rooms != null) body.rooms = rooms;
    const areaM2 = numOrUndef(form.areaM2);
    if (areaM2 != null) body.areaM2 = areaM2;
    const landAreaM2 = numOrUndef(form.landAreaM2);
    if (landAreaM2 != null) body.landAreaM2 = landAreaM2;
    const floor = intOrUndef(form.floor);
    if (floor != null) body.floor = floor;
    const floorsTotal = intOrUndef(form.floorsTotal);
    if (floorsTotal != null) body.floorsTotal = floorsTotal;
    if (form.buildingType) body.buildingType = form.buildingType;
    if (form.renovation) body.renovation = form.renovation;
    if (realEstate.furnished) body.furnished = form.furnished;
  }

  if (jobFieldFlags(code, breadcrumb).jobs) {
    if (form.jobProfession) body.jobProfession = form.jobProfession;
    if (form.jobIndustry) body.jobIndustry = form.jobIndustry;
    if (form.jobPriority && form.jobPriority !== 'ANY') body.jobPriority = form.jobPriority;
    if (form.jobEmployment.length) body.jobEmployment = form.jobEmployment;
    if (form.jobSchedule.length) body.jobSchedule = form.jobSchedule;
    if (form.jobWorkFormat && form.jobWorkFormat !== 'ANY') body.jobWorkFormat = form.jobWorkFormat;
    if (form.jobSalaryPeriod && form.jobSalaryPeriod !== 'ANY') body.jobSalaryPeriod = form.jobSalaryPeriod;
    if (form.jobPayFrequency.length) body.jobPayFrequency = form.jobPayFrequency;
    if (form.jobExperience) body.jobExperience = form.jobExperience;
    if (form.jobCitizenship) body.jobCitizenship = form.jobCitizenship;
    const jobAgeFrom = intOrUndef(form.jobAgeFrom);
    const jobAgeTo = intOrUndef(form.jobAgeTo);
    if (jobAgeFrom != null) body.jobAgeFrom = jobAgeFrom;
    if (jobAgeTo != null) body.jobAgeTo = jobAgeTo;
    body.jobCompanyVerified = form.jobCompanyVerified;
    body.jobLargeCompany = form.jobLargeCompany;
    if (form.jobBenefits.length) body.jobBenefits = form.jobBenefits;
    if (form.jobForCandidates.length) body.jobForCandidates = form.jobForCandidates;
  }

  return body;
}

/** Сброс категорийных полей при смене категории */
export function resetCategoryFields(partial: Partial<CreateAdFormState> = {}): Partial<CreateAdFormState> {
  return {
    brandId: '',
    brandLabel: '',
    modelId: '',
    modelCustom: '',
    year: '',
    mileage: '',
    bodyType: '',
    transmission: '',
    fuelType: '',
    driveType: '',
    engineVolume: '',
    exteriorColor: '',
    seats: '',
    steering: '',
    ownersCount: '',
    dealType: '',
    rooms: '',
    areaM2: '',
    landAreaM2: '',
    floor: '',
    floorsTotal: '',
    buildingType: '',
    renovation: '',
    furnished: false,
    onlineShowing: false,
    jobProfession: '',
    jobIndustry: '',
    jobPriority: 'ANY',
    jobEmployment: [],
    jobSchedule: [],
    jobWorkFormat: 'ANY',
    jobSalaryPeriod: 'ANY',
    jobPayFrequency: [],
    jobExperience: '',
    jobCitizenship: '',
    jobAgeFrom: '',
    jobAgeTo: '',
    jobCompanyVerified: false,
    jobLargeCompany: false,
    jobBenefits: [],
    jobForCandidates: [],
    ...partial,
  };
}
