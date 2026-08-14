/**
 * Fallback, если API справочника недоступен.
 * Основной источник — GET /api/vehicle-spec-options (БД).
 */
export const FALLBACK_VEHICLE_SPEC_OPTIONS = {
  bodyType: [
    { value: 'SEDAN', nameUz: 'Sedan', nameRu: 'Седан' },
    { value: 'HATCHBACK', nameUz: 'Xetchbek', nameRu: 'Хэтчбек' },
    { value: 'UNIVERSAL', nameUz: 'Universal', nameRu: 'Универсал' },
    { value: 'SUV', nameUz: 'Krossover / SUV', nameRu: 'Кроссовер / внедорожник' },
    { value: 'COUPE', nameUz: 'Kupe', nameRu: 'Купе' },
    { value: 'MINIVAN', nameUz: 'Miniven', nameRu: 'Минивэн' },
    { value: 'PICKUP', nameUz: 'Pikap', nameRu: 'Пикап' },
    { value: 'CABRIOLET', nameUz: 'Kabriolet', nameRu: 'Кабриолет' },
    { value: 'OTHER', nameUz: 'Boshqa', nameRu: 'Другое' },
  ],
  transmission: [
    { value: 'MANUAL', nameUz: 'Mexanika', nameRu: 'Механика' },
    { value: 'AUTOMATIC', nameUz: 'Avtomat', nameRu: 'Автомат' },
    { value: 'ROBOT', nameUz: 'Robot', nameRu: 'Робот' },
    { value: 'CVT', nameUz: 'Variator', nameRu: 'Вариатор' },
  ],
  fuelType: [
    { value: 'PETROL', nameUz: 'Benzin', nameRu: 'Бензин' },
    { value: 'DIESEL', nameUz: 'Dizel', nameRu: 'Дизель' },
    { value: 'GAS', nameUz: 'Gaz', nameRu: 'Газ' },
    { value: 'HYBRID', nameUz: 'Gibrid', nameRu: 'Гибрид' },
    { value: 'ELECTRIC', nameUz: 'Elektro', nameRu: 'Электро' },
  ],
  driveType: [
    { value: 'FWD', nameUz: 'Old', nameRu: 'Передний' },
    { value: 'RWD', nameUz: 'Orqa', nameRu: 'Задний' },
    { value: 'AWD', nameUz: "To'liq", nameRu: 'Полный' },
  ],
  exteriorColor: [
    { value: 'WHITE', nameUz: 'Oq', nameRu: 'Белый' },
    { value: 'SILVER', nameUz: 'Kumushrang', nameRu: 'Серебристый' },
    { value: 'GRAY', nameUz: 'Kulrang', nameRu: 'Серый' },
    { value: 'BLACK', nameUz: 'Qora', nameRu: 'Чёрный' },
    { value: 'BLUE', nameUz: "Ko'k", nameRu: 'Синий' },
    { value: 'RED', nameUz: 'Qizil', nameRu: 'Красный' },
    { value: 'GREEN', nameUz: 'Yashil', nameRu: 'Зелёный' },
    { value: 'BROWN', nameUz: 'Jigarrang', nameRu: 'Коричневый' },
    { value: 'BEIGE', nameUz: 'Bej', nameRu: 'Бежевый' },
    { value: 'GOLD', nameUz: 'Oltin', nameRu: 'Золотой' },
    { value: 'ORANGE', nameUz: "To'q sariq", nameRu: 'Оранжевый' },
    { value: 'PURPLE', nameUz: 'Binafsha', nameRu: 'Фиолетовый' },
    { value: 'YELLOW', nameUz: 'Sariq', nameRu: 'Жёлтый' },
    { value: 'PINK', nameUz: 'Pushti', nameRu: 'Розовый' },
    { value: 'OTHER', nameUz: 'Boshqa', nameRu: 'Другой' },
  ],
  seats: [
    { value: '2', nameUz: '2', nameRu: '2' },
    { value: '4', nameUz: '4', nameRu: '4' },
    { value: '5', nameUz: '5', nameRu: '5' },
    { value: '7', nameUz: '7', nameRu: '7' },
    { value: '8PLUS', nameUz: '8+', nameRu: '8+' },
  ],
  steering: [
    { value: 'LEFT', nameUz: 'Chap', nameRu: 'Левый' },
    { value: 'RIGHT', nameUz: "O'ng", nameRu: 'Правый' },
  ],
  ownersCount: [
    { value: '1', nameUz: '1', nameRu: '1' },
    { value: '2', nameUz: '2', nameRu: '2' },
    { value: '3', nameUz: '3', nameRu: '3' },
    { value: '4PLUS', nameUz: '4+', nameRu: '4+' },
  ],
}

export function vehicleSpecOptionLabel(opt, lang) {
  if (!opt) return ''
  return lang === 'ru' ? (opt.nameRu || opt.nameUz || '') : (opt.nameUz || opt.nameRu || '')
}
