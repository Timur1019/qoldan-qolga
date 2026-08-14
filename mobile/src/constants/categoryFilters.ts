import type { CategoryDto } from '@/types/api';

import {
  isClothingTree,
  isReApartments,
  isReCommercial,
  isReGarages,
  isReHouses,
  isRePlots,
  isRealEstateTree,
  isServicesTree,
  isTransportCars,
  isTransportLight,
  isTransportMoto,
  isTransportParts,
  isTransportTree,
  isTransportTrucks,
  isTransportWater,
  RE_ROOT,
  TRANSPORT_ROOT,
} from '@/constants/categoryTree';

function inTree(categoryCode: string | undefined, breadcrumb: CategoryDto[], roots: string[]) {
  if (!categoryCode) return false;
  if (roots.includes(categoryCode)) return true;
  return breadcrumb.some((c) => roots.includes(c.code));
}

/** Ровно на корне категории (не внутри подветки). */
function isExactRoot(categoryCode: string | undefined, root: string) {
  return categoryCode === root;
}

export function categoryFilterFlags(categoryCode?: string, breadcrumb: CategoryDto[] = []) {
  const services = isServicesTree(categoryCode, breadcrumb);
  const transport = isTransportTree(categoryCode, breadcrumb);
  const realEstate = isRealEstateTree(categoryCode, breadcrumb);
  const clothing = isClothingTree(categoryCode, breadcrumb);
  const electronics = inTree(categoryCode, breadcrumb, ['Elektronika']);
  const appliances = inTree(categoryCode, breadcrumb, ['Bytovaya_tekhnika']);
  const animals = inTree(categoryCode, breadcrumb, ['Zhivotnye']);
  const handmade = !services && !transport && !realEstate && !electronics && !appliances && !animals;

  return {
    services,
    clothing,
    transport,
    realEstate,
    condition: !services && !realEstate,
    handmade,
    canRent: clothing,
    license: services,
    contract: services,
    giveAway: !services && !transport && !realEstate,
    canDeliver: !services && !realEstate,
    sellerType: true,
    onlineShowing: realEstate,
    price: true,
    urgentBargain: !services,
  };
}

export function transportFieldFlags(categoryCode?: string, breadcrumb: CategoryDto[] = []) {
  const transport = isTransportTree(categoryCode, breadcrumb);
  const cars = isTransportCars(categoryCode, breadcrumb);
  const moto = isTransportMoto(categoryCode, breadcrumb);
  const trucks = isTransportTrucks(categoryCode, breadcrumb);
  const light = isTransportLight(categoryCode, breadcrumb);
  const parts = isTransportParts(categoryCode, breadcrumb);
  const water = isTransportWater(categoryCode, breadcrumb);
  const onRootOnly = isExactRoot(categoryCode, TRANSPORT_ROOT);
  /** Моторный транспорт + корень «Transport». */
  const motorOrRoot = cars || moto || trucks || onRootOnly;

  return {
    transport,
    cars,
    moto,
    trucks,
    light,
    parts,
    water,
    onRootOnly,
    motorVehicle: motorOrRoot,
    brand: motorOrRoot,
    model: cars || moto,
    year: motorOrRoot,
    mileage: motorOrRoot,
    bodyType: cars || onRootOnly,
    seats: cars || onRootOnly,
    driveType: cars || onRootOnly,
    steering: cars || onRootOnly,
    transmission: motorOrRoot,
    fuelType: motorOrRoot,
    exteriorColor: motorOrRoot,
    engineVolume: motorOrRoot,
    ownersCount: cars || moto || onRootOnly,
  };
}

export function realEstateFieldFlags(categoryCode?: string, breadcrumb: CategoryDto[] = []) {
  const realEstate = isRealEstateTree(categoryCode, breadcrumb);
  const apartments = isReApartments(categoryCode, breadcrumb);
  const houses = isReHouses(categoryCode, breadcrumb);
  const plots = isRePlots(categoryCode, breadcrumb);
  const commercial = isReCommercial(categoryCode, breadcrumb);
  const garages = isReGarages(categoryCode, breadcrumb);
  /** На корне Ko'chmas mulk — полный набор, чтобы фильтры были видны сразу. */
  const onRootOnly = isExactRoot(categoryCode, RE_ROOT);

  return {
    realEstate,
    apartments,
    houses,
    plots,
    commercial,
    garages,
    onRootOnly,
    dealType: realEstate,
    rooms: apartments || houses || onRootOnly,
    area: (realEstate && !plots) || onRootOnly,
    landArea: plots || houses || onRootOnly,
    floor: apartments || commercial || onRootOnly,
    floorsTotal: apartments || houses || commercial || onRootOnly,
    buildingType: apartments || houses || onRootOnly,
    renovation: apartments || houses || commercial || onRootOnly,
    furnished: (realEstate && !plots) || onRootOnly,
  };
}

export type TransportFieldFlags = ReturnType<typeof transportFieldFlags>;
export type RealEstateFieldFlags = ReturnType<typeof realEstateFieldFlags>;
export type CategoryFilterFlags = ReturnType<typeof categoryFilterFlags>;
