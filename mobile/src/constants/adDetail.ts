export const REPORT_REASONS = [
  { value: 'description_error', label: "Tavsifda xato" },
  { value: 'fraud', label: 'Firibgarlik' },
  { value: 'rules_violation', label: 'Qoidalarni buzish' },
  { value: 'sold', label: "Allaqachon sotilgan" },
  { value: 'other', label: 'Boshqa' },
] as const;

/** Toshkent markazi — xarita default (web bilan bir xil). */
export const MAP_DEFAULT = { lat: 41.2995, lng: 69.2401 };
