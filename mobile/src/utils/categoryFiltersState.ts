export type SortValue = 'createdAt,desc' | 'price,asc' | 'price,desc';

export interface CategoryFiltersState {
  region: string;
  district: string;
  priceFrom: string;
  priceTo: string;
  sort: SortValue;
  sellerType: string[];
  itemCondition: string[];
  urgentBargain: boolean;
  canDeliver: boolean;
  giveAway: boolean;
  handMadeOnly: boolean;
  canRent: boolean;
  hasLicense: boolean;
  worksByContract: boolean;
  // transport
  yearFrom: string;
  yearTo: string;
  mileageFrom: string;
  mileageTo: string;
  engineVolumeFrom: string;
  engineVolumeTo: string;
  bodyType: string[];
  transmission: string[];
  fuelType: string[];
  driveType: string[];
  steering: string[];
  ownersCount: string[];
  seats: string[];
  // real estate
  dealType: string[];
  rooms: string[];
  areaFrom: string;
  areaTo: string;
  landAreaFrom: string;
  landAreaTo: string;
  floorFrom: string;
  floorTo: string;
  buildingType: string[];
  renovation: string[];
  furnished: boolean;
}

export const EMPTY_CATEGORY_FILTERS: CategoryFiltersState = {
  region: '',
  district: '',
  priceFrom: '',
  priceTo: '',
  sort: 'createdAt,desc',
  sellerType: [],
  itemCondition: [],
  urgentBargain: false,
  canDeliver: false,
  giveAway: false,
  handMadeOnly: false,
  canRent: false,
  hasLicense: false,
  worksByContract: false,
  yearFrom: '',
  yearTo: '',
  mileageFrom: '',
  mileageTo: '',
  engineVolumeFrom: '',
  engineVolumeTo: '',
  bodyType: [],
  transmission: [],
  fuelType: [],
  driveType: [],
  steering: [],
  ownersCount: [],
  seats: [],
  dealType: [],
  rooms: [],
  areaFrom: '',
  areaTo: '',
  landAreaFrom: '',
  landAreaTo: '',
  floorFrom: '',
  floorTo: '',
  buildingType: [],
  renovation: [],
  furnished: false,
};

function numOrUndef(v: string) {
  if (!v.trim()) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

export function filtersToListApiParams(
  category: string | undefined,
  filters: CategoryFiltersState
): Record<string, unknown> {
  const params: Record<string, unknown> = {
    category,
    page: 0,
    size: 20,
    sort: filters.sort,
  };
  if (filters.region) params.region = filters.region;
  if (filters.district) params.district = filters.district;
  const priceFrom = numOrUndef(filters.priceFrom);
  const priceTo = numOrUndef(filters.priceTo);
  if (priceFrom != null) params.priceFrom = priceFrom;
  if (priceTo != null) params.priceTo = priceTo;
  if (filters.sellerType.length) params.sellerType = filters.sellerType;
  if (filters.itemCondition.length) params.itemCondition = filters.itemCondition;
  if (filters.urgentBargain) params.urgentBargain = true;
  if (filters.canDeliver) params.canDeliver = true;
  if (filters.giveAway) params.giveAway = true;
  if (filters.handMadeOnly) params.handMadeOnly = true;
  if (filters.canRent) params.canRent = true;
  if (filters.hasLicense) params.hasLicense = true;
  if (filters.worksByContract) params.worksByContract = true;

  const yearFrom = numOrUndef(filters.yearFrom);
  const yearTo = numOrUndef(filters.yearTo);
  if (yearFrom != null) params.yearFrom = yearFrom;
  if (yearTo != null) params.yearTo = yearTo;
  const mileageFrom = numOrUndef(filters.mileageFrom);
  const mileageTo = numOrUndef(filters.mileageTo);
  if (mileageFrom != null) params.mileageFrom = mileageFrom;
  if (mileageTo != null) params.mileageTo = mileageTo;
  const engineVolumeFrom = numOrUndef(filters.engineVolumeFrom);
  const engineVolumeTo = numOrUndef(filters.engineVolumeTo);
  if (engineVolumeFrom != null) params.engineVolumeFrom = engineVolumeFrom;
  if (engineVolumeTo != null) params.engineVolumeTo = engineVolumeTo;
  if (filters.bodyType.length) params.bodyType = filters.bodyType;
  if (filters.transmission.length) params.transmission = filters.transmission;
  if (filters.fuelType.length) params.fuelType = filters.fuelType;
  if (filters.driveType.length) params.driveType = filters.driveType;
  if (filters.steering.length) params.steering = filters.steering;
  if (filters.ownersCount.length) params.ownersCount = filters.ownersCount;
  if (filters.seats.length) params.seats = filters.seats;

  if (filters.dealType.length) params.dealType = filters.dealType;
  if (filters.rooms.length) params.rooms = filters.rooms;
  const areaFrom = numOrUndef(filters.areaFrom);
  const areaTo = numOrUndef(filters.areaTo);
  if (areaFrom != null) params.areaFrom = areaFrom;
  if (areaTo != null) params.areaTo = areaTo;
  const landAreaFrom = numOrUndef(filters.landAreaFrom);
  const landAreaTo = numOrUndef(filters.landAreaTo);
  if (landAreaFrom != null) params.landAreaFrom = landAreaFrom;
  if (landAreaTo != null) params.landAreaTo = landAreaTo;
  const floorFrom = numOrUndef(filters.floorFrom);
  const floorTo = numOrUndef(filters.floorTo);
  if (floorFrom != null) params.floorFrom = floorFrom;
  if (floorTo != null) params.floorTo = floorTo;
  if (filters.buildingType.length) params.buildingType = filters.buildingType;
  if (filters.renovation.length) params.renovation = filters.renovation;
  if (filters.furnished) params.furnished = true;

  return params;
}

export function isFiltersActive(filters: CategoryFiltersState) {
  const e = EMPTY_CATEGORY_FILTERS;
  return (
    filters.region !== e.region ||
    filters.district !== e.district ||
    filters.priceFrom !== e.priceFrom ||
    filters.priceTo !== e.priceTo ||
    filters.sort !== e.sort ||
    filters.sellerType.length > 0 ||
    filters.itemCondition.length > 0 ||
    filters.urgentBargain ||
    filters.canDeliver ||
    filters.giveAway ||
    filters.handMadeOnly ||
    filters.canRent ||
    filters.hasLicense ||
    filters.worksByContract ||
    filters.yearFrom !== '' ||
    filters.yearTo !== '' ||
    filters.mileageFrom !== '' ||
    filters.mileageTo !== '' ||
    filters.engineVolumeFrom !== '' ||
    filters.engineVolumeTo !== '' ||
    filters.bodyType.length > 0 ||
    filters.transmission.length > 0 ||
    filters.fuelType.length > 0 ||
    filters.driveType.length > 0 ||
    filters.steering.length > 0 ||
    filters.ownersCount.length > 0 ||
    filters.seats.length > 0 ||
    filters.dealType.length > 0 ||
    filters.rooms.length > 0 ||
    filters.areaFrom !== '' ||
    filters.areaTo !== '' ||
    filters.landAreaFrom !== '' ||
    filters.landAreaTo !== '' ||
    filters.floorFrom !== '' ||
    filters.floorTo !== '' ||
    filters.buildingType.length > 0 ||
    filters.renovation.length > 0 ||
    filters.furnished
  );
}
