export const BUSINESS_TYPES = [
  { value: 'ip', label: 'IP', hint: 'Yakka tadbirkor' },
  { value: 'ooo', label: 'MCHJ', hint: "Mas'uliyati cheklangan jamiyat" },
  { value: 'self', label: "O'zini o'zi band qilgan", hint: 'Jismoniy shaxs' },
] as const;

export const BUSINESS_PRODUCT_CATEGORIES = [
  { value: 'services', label: 'Xizmatlar' },
  { value: 'realty', label: 'Ko‘chmas mulk' },
  { value: 'transport', label: 'Transport' },
  { value: 'electronics', label: 'Elektronika' },
  { value: 'appliances', label: 'Maishiy texnika' },
  { value: 'furniture', label: 'Mebel' },
  { value: 'fashion', label: 'Kiyim va poyabzal' },
  { value: 'kids', label: 'Bolalar uchun' },
  { value: 'other', label: 'Boshqa' },
] as const;

export const BUSINESS_PENDING_KEY = 'businessApplicationPending';
