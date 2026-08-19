import type { CategoryDto } from '@/types/api';

export const TRANSPORT_ROOT = 'Transport';
export const RE_ROOT = 'Nedvizhimost';
export const CLOTHING_ROOT = 'Odezhda_obuv';
export const SERVICES_ROOT = 'Xizmatlar';

export const RE_APARTMENTS = 'Kvartiry';
export const RE_HOUSES = 'Doma_dachi';
export const RE_PLOTS = 'Uchastki';
export const RE_COMMERCIAL = 'Kommercheskaya';
export const RE_GARAGES = 'Garazhi_parkovki';

export const TRANSPORT_CARS = 'Avtomobili';
export const TRANSPORT_MOTO = 'Motocikly_i_mototehnika';
export const TRANSPORT_TRUCKS = 'Gruzoviki_i_spectehnika';
export const TRANSPORT_SCOOTERS = 'Elektrosamokaty';
export const TRANSPORT_BIKES = 'Transport_velosipedy';
export const TRANSPORT_PARTS = 'Zapchasti_i_aksessuary_transport';
export const TRANSPORT_WATER = 'Vodnyy_transport';

function hasCode(categoryCode: string | undefined, breadcrumb: CategoryDto[], codes: string[]) {
  if (!categoryCode) return false;
  if (codes.includes(categoryCode)) return true;
  return breadcrumb.some(
    (c) => codes.includes(c.code) || (c.parentCode != null && codes.includes(c.parentCode))
  );
}

export function isTransportTree(categoryCode?: string, breadcrumb: CategoryDto[] = []) {
  return hasCode(categoryCode, breadcrumb, [TRANSPORT_ROOT]);
}

export function isRealEstateTree(categoryCode?: string, breadcrumb: CategoryDto[] = []) {
  return hasCode(categoryCode, breadcrumb, [RE_ROOT]);
}

export function isClothingTree(categoryCode?: string, breadcrumb: CategoryDto[] = []) {
  return hasCode(categoryCode, breadcrumb, [CLOTHING_ROOT]);
}

export function isServicesTree(categoryCode?: string, breadcrumb: CategoryDto[] = []) {
  return hasCode(categoryCode, breadcrumb, [SERVICES_ROOT]);
}

export function isTransportCars(categoryCode?: string, breadcrumb: CategoryDto[] = []) {
  return hasCode(categoryCode, breadcrumb, [TRANSPORT_CARS]);
}

export function isTransportMoto(categoryCode?: string, breadcrumb: CategoryDto[] = []) {
  return hasCode(categoryCode, breadcrumb, [TRANSPORT_MOTO]);
}

export function isTransportTrucks(categoryCode?: string, breadcrumb: CategoryDto[] = []) {
  return hasCode(categoryCode, breadcrumb, [TRANSPORT_TRUCKS]);
}

export function isTransportLight(categoryCode?: string, breadcrumb: CategoryDto[] = []) {
  return hasCode(categoryCode, breadcrumb, [TRANSPORT_SCOOTERS, TRANSPORT_BIKES]);
}

export function isTransportParts(categoryCode?: string, breadcrumb: CategoryDto[] = []) {
  return hasCode(categoryCode, breadcrumb, [TRANSPORT_PARTS]);
}

export function isTransportWater(categoryCode?: string, breadcrumb: CategoryDto[] = []) {
  return hasCode(categoryCode, breadcrumb, [TRANSPORT_WATER]);
}

/** Легковые / грузовые / мото (+ корень Transport). Без великов, самокатов, запчастей, водного. */
export function isTransportMotorVehicle(categoryCode?: string, breadcrumb: CategoryDto[] = []) {
  if (!isTransportTree(categoryCode, breadcrumb)) return false;
  if (isTransportLight(categoryCode, breadcrumb)) return false;
  if (isTransportParts(categoryCode, breadcrumb)) return false;
  if (isTransportWater(categoryCode, breadcrumb)) return false;
  return true;
}

export function isReApartments(categoryCode?: string, breadcrumb: CategoryDto[] = []) {
  return hasCode(categoryCode, breadcrumb, [RE_APARTMENTS]);
}

export function isReHouses(categoryCode?: string, breadcrumb: CategoryDto[] = []) {
  return hasCode(categoryCode, breadcrumb, [RE_HOUSES]);
}

export function isRePlots(categoryCode?: string, breadcrumb: CategoryDto[] = []) {
  return hasCode(categoryCode, breadcrumb, [RE_PLOTS]);
}

export function isReCommercial(categoryCode?: string, breadcrumb: CategoryDto[] = []) {
  return hasCode(categoryCode, breadcrumb, [RE_COMMERCIAL]);
}

export function isReGarages(categoryCode?: string, breadcrumb: CategoryDto[] = []) {
  return hasCode(categoryCode, breadcrumb, [RE_GARAGES]);
}
