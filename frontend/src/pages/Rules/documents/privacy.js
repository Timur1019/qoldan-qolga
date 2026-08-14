export const privacyDoc = {
  slug: 'privacy',
  icon: 'bi-shield-check',
  updated: '2026-08-06',
  city: { ru: 'г. Ташкент', uz: 'Toshkent shahri' },
  title: {
    ru: 'Политика обработки персональных данных',
    uz: 'Shaxsiy ma\'lumotlarni qayta ishlash siyosati',
  },
  summary: {
    ru: 'Как Qoldan Qolga собирает, хранит и защищает данные пользователей платформы.',
    uz: 'Qoldan Qolga foydalanuvchi ma\'lumotlarini qanday yig\'adi, saqlaydi va himoya qiladi.',
  },
  toc: [
    { id: 's1', ru: '1. Назначение', uz: '1. Maqsad' },
    { id: 's2', ru: '2. Термины', uz: '2. Atamalar' },
    { id: 's3', ru: '3. Правовые основания', uz: '3. Huquqiy asoslar' },
    { id: 's4', ru: '4. Принципы и цели', uz: '4. Tamoyillar va maqsadlar' },
    { id: 's5', ru: '5. Категории данных', uz: '5. Ma\'lumot turlari' },
    { id: 's6', ru: '6. Порядок обработки', uz: '6. Qayta ishlash tartibi' },
    { id: 's7', ru: '7. Обращения субъектов', uz: '7. Subyekt murojaatlari' },
    { id: 's8', ru: '8. Запросы госорганов', uz: '8. Davlat organlari so\'rovlari' },
    { id: 's9', ru: '9. Заключительные положения', uz: '9. Yakuniy qoidalar' },
  ],
  sections: [
    {
      id: 's1',
      title: { ru: '1. Назначение и область применения', uz: '1. Maqsad va qo\'llanish sohasi' },
      blocks: [
        { type: 'p', text: { ru: 'Настоящая Политика определяет, как оператор платформы объявлений Qoldan Qolga (далее — «Платформа», «мы») обрабатывает персональные данные посетителей и зарегистрированных пользователей сайта и связанных сервисов.', uz: 'Ushbu Siyosat Qoldan Qolga e\'lonlar platformasi operatori (keyingi o\'rinlarda — «Platforma», «biz») sayt va bog\'liq xizmatlar tashrifchilari hamda ro\'yxatdan o\'tgan foydalanuvchilarning shaxsiy ma\'lumotlarini qanday qayta ishlashini belgilaydi.' } },
        { type: 'p', text: { ru: 'Цель Политики — защитить права субъектов персональных данных и объяснить, какие сведения мы используем для работы сервиса: регистрация, объявления, чат, избранное, отзывы, статус «Магазин» и проверка профиля.', uz: 'Siyosat maqsadi — subyekt huquqlarini himoya qilish va qaysi ma\'lumotlar xizmat ishlashi uchun ishlatilishini tushuntirish: ro\'yxatdan o\'tish, e\'lonlar, chat, sevimlilar, sharhlar, «Do\'kon» holati va profil tekshiruvi.' } },
        { type: 'p', text: { ru: 'Политика применяется к данным, полученным как до, так и после её публикации, если иное прямо не указано в тексте.', uz: 'Agar matnda boshqacha deyilmagan bo\'lsa, Siyosat nashrdan oldin va keyin olingan ma\'lumotlarga tatbiq etiladi.' } },
      ],
    },
    {
      id: 's2',
      title: { ru: '2. Термины и определения', uz: '2. Atamalar va ta\'riflar' },
      blocks: [
        { type: 'ul', items: [
          { ru: 'Персональные данные — сведения, относящиеся к физическому лицу или позволяющие его идентифицировать.', uz: 'Shaxsiy ma\'lumotlar — jismoniy shaxsga tegishli yoki uni aniqlash imkonini beruvchi ma\'lumotlar.' },
          { ru: 'Субъект — физическое лицо, чьи данные обрабатываются.', uz: 'Subyekt — ma\'lumotlari qayta ishlanayotgan jismoniy shaxs.' },
          { ru: 'Оператор — лицо, организующее и/или осуществляющее обработку персональных данных на Платформе.', uz: 'Operator — Platformada shaxsiy ma\'lumotlarni tashkil etuvchi va/yoki qayta ishlovchi shaxs.' },
          { ru: 'Обработка — сбор, хранение, уточнение, использование, передача, блокирование, обезличивание и уничтожение данных.', uz: 'Qayta ishlash — yig\'ish, saqlash, aniqlashtirish, foydalanish, uzatish, bloklash, shaxssizlantirish va yo\'q qilish.' },
        ] },
      ],
    },
    {
      id: 's3',
      title: { ru: '3. Правовые основания', uz: '3. Huquqiy asoslar' },
      blocks: [
        { type: 'p', text: { ru: 'Политика разработана с учётом законодательства Республики Узбекистан, в том числе Конституции, Гражданского кодекса, Закона от 21.06.2019 № ЗРУ-547 «О персональных данных», Закона «Об информатизации» и связанных актов Кабинета Министров.', uz: 'Siyosat O\'zbekiston Respublikasi qonunchiligiga, jumladan Konstitutsiya, Fuqarolik kodeksi, 21.06.2019-yildagi O\'RQ-547-son «Shaxsiy ma\'lumotlar to\'g\'risida»gi Qonun, «Axborotlashtirish to\'g\'risida»gi Qonun va Vazirlar Mahkamasining tegishli hujjatlariga asoslanadi.' } },
        { type: 'p', text: { ru: 'Обработка ведётся на законной основе: согласие субъекта, исполнение договора/оферты с пользователем, исполнение обязанностей, предусмотренных законом, защита прав Платформы или третьих лиц без нарушения прав субъекта.', uz: 'Qayta ishlash qonuniy asosda olib boriladi: subyekt roziligi, foydalanuvchi bilan shartnoma/oferta bajarilishi, qonunda nazarda tutilgan majburiyatlar, subyekt huquqlari buzilmagan holda Platforma yoki uchinchi shaxslar huquqlarini himoya qilish.' } },
      ],
    },
    {
      id: 's4',
      title: { ru: '4. Принципы, условия и цели', uz: '4. Tamoyillar, shartlar va maqsadlar' },
      blocks: [
        { type: 'p', text: { ru: 'Мы обрабатываем данные по принципам законности, минимизации, точности, конфиденциальности и ограничения срока хранения целями обработки.', uz: 'Biz ma\'lumotlarni qonuniylik, minimallashtirish, aniqlik, maxfiylik va saqlash muddatini maqsadlar bilan cheklash tamoyillari asosida qayta ishlaymiz.' } },
        { type: 'p', text: { ru: 'Основные цели: создание и обслуживание аккаунта; публикация и показ объявлений; чат между пользователями; избранное и отзывы; рассмотрение заявок на статус «Магазин»; проверка профиля; модерация; безопасность; ответы на обращения; улучшение сервиса в обезличенном виде.', uz: 'Asosiy maqsadlar: akkaunt yaratish va xizmat ko\'rsatish; e\'lonlarni joylash va ko\'rsatish; foydalanuvchilar o\'rtasidagi chat; sevimlilar va sharhlar; «Do\'kon» holati arizalarini ko\'rib chiqish; profil tekshiruvi; moderatsiya; xavfsizlik; murojaatlarga javob; shaxssizlashtirilgan holda xizmatni yaxshilash.' } },
      ],
    },
    {
      id: 's5',
      title: { ru: '5. Объём и категории данных', uz: '5. Hajm va ma\'lumot toifalari' },
      blocks: [
        { type: 'p', text: { ru: 'Состав данных соответствует целям обработки. Мы можем обрабатывать:', uz: 'Ma\'lumot tarkibi qayta ishlash maqsadlariga mos keladi. Biz qayta ishlashimiz mumkin:' } },
        { type: 'ul', items: [
          { ru: 'регистрационные сведения: имя/отображаемое имя, адрес электронной почты, пароль в защищённом виде;', uz: 'ro\'yxatdan o\'tish ma\'lumotlari: ism/ko\'rsatiladigan nom, elektron pochta, himoyalangan parol;' },
          { ru: 'контактные данные из объявления: телефон, Telegram, e-mail, регион и район;', uz: 'e\'londagi aloqa ma\'lumotlari: telefon, Telegram, e-mail, viloyat va tuman;' },
          { ru: 'содержание объявлений, фотографии, сообщения чата, отзывы;', uz: 'e\'lon matni, suratlar, chat xabarlari, sharhlar;' },
          { ru: 'технические данные: IP, тип устройства, логи, файлы cookie;', uz: 'texnik ma\'lumotlar: IP, qurilma turi, loglar, cookie fayllar;' },
          { ru: 'данные заявок на бизнес-статус и документы, которые пользователь сам загружает для проверки.', uz: 'biznes holati arizalari va foydalanuvchi tekshiruv uchun o\'zi yuklagan hujjatlar.' },
        ] },
        { type: 'p', text: { ru: 'Категории субъектов: посетители, зарегистрированные пользователи, продавцы и покупатели, заявители на статус «Магазин», представители юридических лиц, а также лица, чьи данные пользователь указывает в объявлении по своей инициативе.', uz: 'Subyekt toifalari: tashrifchilar, ro\'yxatdan o\'tgan foydalanuvchilar, sotuvchi va xaridorlar, «Do\'kon» holati arizachilari, yuridik shaxs vakillari, shuningdek foydalanuvchi e\'londa o\'z tashabbusi bilan ko\'rsatgan shaxslar.' } },
      ],
    },
    {
      id: 's6',
      title: { ru: '6. Порядок и условия обработки', uz: '6. Qayta ishlash tartibi va shartlari' },
      blocks: [
        { type: 'p', text: { ru: 'Данные получаются от субъекта либо являются общедоступными, если пользователь сам опубликовал их в объявлении или профиле. Регистрация и использование сервиса означают согласие на обработку данных в объёме, необходимом для работы Платформы.', uz: 'Ma\'lumotlar subyektdan olinadi yoki foydalanuvchi e\'lon yoki profilida o\'zi e\'lon qilgan bo\'lsa, ommaviy hisoblanadi. Ro\'yxatdan o\'tish va xizmatdan foydalanish Platforma ishlashi uchun zarur hajmda ma\'lumotlarni qayta ishlashga rozilik bildiradi.' } },
        { type: 'p', text: { ru: 'Субъект вправе отозвать согласие, написав на support@qoldanqolga.uz. После отзыва аккаунт и связанные данные удаляются или обезличиваются в разумный срок, кроме сведений, которые закон требует хранить дольше.', uz: 'Subyekt support@qoldanqolga.uz orqali rozilikni qaytarib olishi mumkin. Shundan so\'ng akkaunt va bog\'liq ma\'lumotlar oqilona muddatda o\'chiriladi yoki shaxssizlantiriladi, qonun uzoqroq saqlashni talab qiladigan holatlar bundan mustasno.' } },
        { type: 'p', text: { ru: 'Трансграничная передача возможна только при наличии правовых оснований и при условии защиты прав субъекта. Мы принимаем организационные и технические меры защиты: разграничение доступа, защищённое хранение паролей, контроль загрузок.', uz: 'Chegaradan tashqariga uzatish faqat huquqiy asoslar mavjud bo\'lganda va subyekt huquqlari himoyalanganda amalga oshiriladi. Biz tashkiliy va texnik himoya choralari qo\'llaymiz: kirishni cheklash, parollarni xavfsiz saqlash, yuklamalarni nazorat qilish.' } },
      ],
    },
    {
      id: 's7',
      title: { ru: '7. Обращения субъектов', uz: '7. Subyekt murojaatlari' },
      blocks: [
        { type: 'p', text: { ru: 'Чтобы узнать, какие данные мы храним, исправить неточности или потребовать удаление, направьте запрос на support@qoldanqolga.uz с адреса, указанного в аккаунте, либо опишите ситуацию так, чтобы мы могли подтвердить личность.', uz: 'Qaysi ma\'lumotlar saqlanishini bilish, xatolarni tuzatish yoki o\'chirishni so\'rash uchun akkauntdagi pochta orqali support@qoldanqolga.uz ga yozing yoki shaxsni tasdiqlash imkonini beradigan ma\'lumot qoldiring.' } },
        { type: 'p', text: { ru: 'Ответ направляется в срок, предусмотренный Законом «О персональных данных», как правило не позднее 15 рабочих дней, если для идентификации не нужны дополнительные сведения.', uz: 'Javob «Shaxsiy ma\'lumotlar to\'g\'risida»gi Qonunda belgilangan muddatda, odatda qo\'shimcha identifikatsiya talab qilinmasa 15 ish kunidan kechiktirmay yuboriladi.' } },
      ],
    },
    {
      id: 's8',
      title: { ru: '8. Запросы надзорных органов', uz: '8. Nazorat organlari so\'rovlari' },
      blocks: [
        { type: 'p', text: { ru: 'При законном запросе уполномоченного органа мы предоставляем сведения в объёме и сроки, установленные законодательством Республики Узбекистан, и фиксируем такие обращения.', uz: 'Vakolatli organning qonuniy so\'rovida biz O\'zbekiston Respublikasi qonunchiligida belgilangan hajm va muddatda ma\'lumot beramiz va bunday murojaatlarni qayd etamiz.' } },
      ],
    },
    {
      id: 's9',
      title: { ru: '9. Заключительные положения', uz: '9. Yakuniy qoidalar' },
      blocks: [
        { type: 'p', text: { ru: 'Актуальная редакция Политики публикуется на Платформе в разделе правил. Мы можем обновить документ при изменении закона, состава сервисов или процессов обработки. Продолжение использования Платформы после публикации новой редакции означает принятие изменений, если закон не требует отдельного согласия.', uz: 'Siyosatning amaldagi tahriri Platformaning qoidalar bo\'limida e\'lon qilinadi. Qonun, xizmatlar yoki qayta ishlash jarayonlari o\'zgarsa, hujjat yangilanishi mumkin. Yangi tahrir e\'lon qilingandan keyin Platformadan foydalanishni davom ettirish, qonun alohida rozilik talab qilmasa, o\'zgarishlarni qabul qilish hisoblanadi.' } },
        { type: 'p', text: { ru: 'По вопросам Политики пишите на support@qoldanqolga.uz. При расхождении русской и узбекской версий приоритет имеет русская редакция, если иное не будет установлено законом.', uz: 'Siyosat bo\'yicha savollar: support@qoldanqolga.uz. Rus va o\'zbek matnlari farq qilsa, qonunda boshqacha belgilamasa, rus tahriri ustunlik qiladi.' } },
      ],
    },
  ],
}
