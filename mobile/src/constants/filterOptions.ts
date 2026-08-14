export type FilterOption = { value: string; label: string };

export const SELLER_TYPE_OPTIONS: FilterOption[] = [
  { value: 'PRIVATE', label: 'Shaxsiy' },
  { value: 'STORE', label: "Do'kon" },
  { value: 'COMPANY', label: 'Kompaniya' },
];

export const CONDITION_OPTIONS: FilterOption[] = [
  { value: 'NEW', label: 'Yangi' },
  { value: 'USED', label: 'Ishlatilgan' },
  { value: 'USED_LIKE_NEW', label: 'Deyarli yangi' },
  { value: 'USED_GOOD', label: 'Yaxshi' },
  { value: 'USED_FAIR', label: "O'rtacha" },
];

export const DEAL_TYPE_OPTIONS: FilterOption[] = [
  { value: 'SALE', label: 'Sotish' },
  { value: 'RENT', label: 'Ijara' },
];

export const ROOMS_OPTIONS: FilterOption[] = [
  { value: '0', label: 'Studiya' },
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5PLUS', label: '5+' },
];

export const BUILDING_TYPE_OPTIONS: FilterOption[] = [
  { value: 'PANEL', label: 'Panel' },
  { value: 'BRICK', label: 'Gʻisht' },
  { value: 'MONOLITH', label: 'Monolit' },
  { value: 'BLOCK', label: 'Blok' },
  { value: 'OTHER', label: 'Boshqa' },
];

export const RENOVATION_OPTIONS: FilterOption[] = [
  { value: 'NEEDS_REPAIR', label: 'Taʼmir talab' },
  { value: 'COSMETIC', label: 'Kosmetik' },
  { value: 'EURO', label: 'Yevro' },
  { value: 'DESIGN', label: 'Dizayn' },
  { value: 'NEW_BUILD', label: 'Yangi qurilish' },
];

export const BODY_TYPE_OPTIONS: FilterOption[] = [
  { value: 'SEDAN', label: 'Sedan' },
  { value: 'HATCHBACK', label: 'Xetchbek' },
  { value: 'UNIVERSAL', label: 'Universal' },
  { value: 'SUV', label: 'Krossover / SUV' },
  { value: 'COUPE', label: 'Kupe' },
  { value: 'MINIVAN', label: 'Miniven' },
  { value: 'PICKUP', label: 'Pikap' },
  { value: 'OTHER', label: 'Boshqa' },
];

export const TRANSMISSION_OPTIONS: FilterOption[] = [
  { value: 'MANUAL', label: 'Mexanika' },
  { value: 'AUTOMATIC', label: 'Avtomat' },
  { value: 'ROBOT', label: 'Robot' },
  { value: 'CVT', label: 'Variator' },
];

export const FUEL_TYPE_OPTIONS: FilterOption[] = [
  { value: 'PETROL', label: 'Benzin' },
  { value: 'DIESEL', label: 'Dizel' },
  { value: 'GAS', label: 'Gaz' },
  { value: 'HYBRID', label: 'Gibrid' },
  { value: 'ELECTRIC', label: 'Elektro' },
];

export const DRIVE_TYPE_OPTIONS: FilterOption[] = [
  { value: 'FWD', label: 'Old' },
  { value: 'RWD', label: 'Orqa' },
  { value: 'AWD', label: "To'liq" },
];

export const STEERING_OPTIONS: FilterOption[] = [
  { value: 'LEFT', label: 'Chap' },
  { value: 'RIGHT', label: "O'ng" },
];

export const OWNERS_COUNT_OPTIONS: FilterOption[] = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4PLUS', label: '4+' },
];

export const SEATS_OPTIONS: FilterOption[] = [
  { value: '2', label: '2' },
  { value: '4', label: '4' },
  { value: '5', label: '5' },
  { value: '7', label: '7' },
  { value: '8PLUS', label: '8+' },
];

export const EXTERIOR_COLOR_OPTIONS: FilterOption[] = [
  { value: 'WHITE', label: 'Oq' },
  { value: 'BLACK', label: 'Qora' },
  { value: 'SILVER', label: 'Kumush' },
  { value: 'GRAY', label: 'Kulrang' },
  { value: 'RED', label: 'Qizil' },
  { value: 'BLUE', label: "Ko'k" },
  { value: 'GREEN', label: 'Yashil' },
  { value: 'YELLOW', label: 'Sariq' },
  { value: 'BROWN', label: 'Jigarrang' },
  { value: 'BEIGE', label: 'Bej' },
  { value: 'ORANGE', label: 'To\'q sariq' },
  { value: 'OTHER', label: 'Boshqa' },
];

export const SORT_OPTIONS: FilterOption[] = [
  { value: 'createdAt,desc', label: 'Avval yangilari' },
  { value: 'price,asc', label: 'Arzonroq' },
  { value: 'price,desc', label: 'Qimmatroq' },
];
