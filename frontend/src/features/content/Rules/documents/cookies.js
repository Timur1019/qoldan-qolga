export const cookiesDoc = {
  slug: 'cookies',
  icon: 'bi-sliders',
  updated: '2026-08-06',
  city: { ru: 'г. Ташкент', uz: 'Toshkent shahri' },
  title: {
    ru: 'Политика использования файлов cookie',
    uz: 'Cookie fayllardan foydalanish siyosati',
  },
  summary: {
    ru: 'Какие cookie использует Qoldan Qolga и как ими управлять.',
    uz: 'Qoldan Qolga qanday cookie ishlatadi va ularni qanday boshqarish mumkin.',
  },
  toc: [
    { id: 's1', ru: '1. Общие положения', uz: '1. Umumiy qoidalar' },
    { id: 's2', ru: '2. Цели', uz: '2. Maqsadlar' },
    { id: 's3', ru: '3. Виды cookie', uz: '3. Cookie turlari' },
    { id: 's4', ru: '4. Управление', uz: '4. Boshqarish' },
    { id: 's5', ru: '5. Обновления', uz: '5. Yangilanishlar' },
  ],
  sections: [
    {
      id: 's1',
      title: { ru: '1. Общие положения', uz: '1. Umumiy qoidalar' },
      blocks: [
        { type: 'p', text: { ru: 'Эта Политика дополняет Политику обработки персональных данных и объясняет, как сайт Qoldan Qolga использует файлы cookie и похожие технологии.', uz: 'Ushbu Siyosat shaxsiy ma\'lumotlar siyosatini to\'ldiradi va Qoldan Qolga sayti cookie hamda o\'xshash texnologiyalardan qanday foydalanishini tushuntiradi.' } },
        { type: 'p', text: { ru: 'Cookie — небольшие данные, которые браузер сохраняет на устройстве и передаёт сайту при последующих визитах. Они помогают запомнить язык, сессию входа и базовые настройки.', uz: 'Cookie — brauzer qurilmada saqlaydigan va keyingi tashriflarda saytga yuboriladigan kichik ma\'lumotlar. Ular til, kirish sessiyasi va asosiy sozlamalarni eslab qolishga yordam beradi.' } },
        { type: 'p', text: { ru: 'Продолжая пользоваться сайтом после уведомления о cookie, вы соглашаетесь на их использование в объёме, нужном для работы сервиса. Отказ от необязательных cookie возможен в настройках браузера.', uz: 'Cookie haqidagi ogohlantirishdan keyin saytdan foydalanishni davom ettirsangiz, xizmat ishlashi uchun zarur hajmda ulardan foydalanishga rozilik bildirasiz. Majburiy bo\'lmagan cookie larni brauzer sozlamalarida o\'chirishingiz mumkin.' } },
      ],
    },
    {
      id: 's2',
      title: { ru: '2. Цели использования', uz: '2. Foydalanish maqsadlari' },
      blocks: [
        { type: 'ul', items: [
          { ru: 'авторизация и безопасность сессии;', uz: 'avtorizatsiya va sessiya xavfsizligi;' },
          { ru: 'сохранение языка интерфейса и выбранного региона;', uz: 'interfeys tili va tanlangan hududni saqlash;' },
          { ru: 'корректная работа фильтров и форм;', uz: 'filtrlar va formalarning to\'g\'ri ishlashi;' },
          { ru: 'анализ посещаемости в обезличенном виде для улучшения Платформы.', uz: 'Platformani yaxshilash uchun shaxssizlashtirilgan tashrif tahlili.' },
        ] },
      ],
    },
    {
      id: 's3',
      title: { ru: '3. Какие cookie используются', uz: '3. Qanday cookie ishlatiladi' },
      blocks: [
        { type: 'ul', items: [
          { ru: 'Обязательные — вход в аккаунт, защита форм, базовые функции.', uz: 'Majburiy — akkauntga kirish, formalarni himoya qilish, asosiy funksiyalar.' },
          { ru: 'Функциональные — язык, регион и другие сохранённые предпочтения.', uz: 'Funksional — til, hudud va boshqa saqlangan sozlamalar.' },
          { ru: 'Аналитические — обобщённая статистика использования страниц.', uz: 'Tahliliy — sahifalardan foydalanishning umumiy statistikasi.' },
        ] },
        { type: 'p', text: { ru: 'Без обязательных cookie отдельные разделы, включая личный кабинет и публикацию объявлений, могут быть недоступны.', uz: 'Majburiy cookie larsiz shaxsiy kabinet va e\'lon joylash kabi bo\'limlar ishlamasligi mumkin.' } },
      ],
    },
    {
      id: 's4',
      title: { ru: '4. Настройка параметров', uz: '4. Parametrlarni sozlash' },
      blocks: [
        { type: 'p', text: { ru: 'Вы можете удалить или заблокировать cookie в настройках браузера. Инструкции обычно находятся в разделах конфиденциальности Chrome, Safari, Firefox и других браузеров.', uz: 'Cookie larni brauzer sozlamalarida o\'chirishingiz yoki bloklashingiz mumkin. Ko\'rsatmalar odatda Chrome, Safari, Firefox va boshqa brauzerlarning maxfiylik bo\'limida bo\'ladi.' } },
        { type: 'p', text: { ru: 'Отключение cookie действует только в вашем браузере и не распространяется автоматически на сторонние сайты, ссылки на которые могут встречаться на Платформе.', uz: 'Cookie ni o\'chirish faqat sizning brauzeringizga ta\'sir qiladi va Platformadagi tashqi saytlarga avtomatik tatbiq etilmaydi.' } },
      ],
    },
    {
      id: 's5',
      title: { ru: '5. Обновление Политики', uz: '5. Siyosatni yangilash' },
      blocks: [
        { type: 'p', text: { ru: 'Мы можем обновлять Политику при изменении технологий сайта. Актуальная версия всегда доступна в разделе правил Платформы.', uz: 'Sayt texnologiyasi o\'zgarsa, Siyosat yangilanishi mumkin. Amaldagi versiya doimo Platforma qoidalari bo\'limida mavjud.' } },
      ],
    },
  ],
}
