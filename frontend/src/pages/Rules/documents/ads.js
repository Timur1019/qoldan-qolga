export const adsDoc = {
  slug: 'ads',
  icon: 'bi-megaphone',
  updated: '2026-08-06',
  city: { ru: 'г. Ташкент', uz: 'Toshkent shahri' },
  title: {
    ru: 'Правила публикации объявлений',
    uz: 'E\'lonlarni joylash qoidalari',
  },
  summary: {
    ru: 'Что можно публиковать на Qoldan Qolga и какие объявления будут отклонены.',
    uz: 'Qoldan Qolga da nimalarni e\'lon qilish mumkin va qaysi e\'lonlar rad etiladi.',
  },
  toc: [
    { id: 's1', ru: '1. Общие требования', uz: '1. Umumiy talablar' },
    { id: 's2', ru: '2. Содержание и оформление', uz: '2. Mazmun va rasmiylashtirish' },
    { id: 's3', ru: '3. Запрещённые предложения', uz: '3. Taqiqlangan takliflar' },
    { id: 's4', ru: '4. Отдельные категории', uz: '4. Ayrim kategoriyalar' },
    { id: 's5', ru: '5. Модерация и жалобы', uz: '5. Moderatsiya va shikoyatlar' },
  ],
  sections: [
    {
      id: 's1',
      title: { ru: '1. Общие требования', uz: '1. Umumiy talablar' },
      blocks: [
        { type: 'p', text: { ru: 'Размещая объявление, пользователь подтверждает, что ознакомился с Пользовательским соглашением и этими Правилами. Нарушение может привести к отклонению объявления, ограничению аккаунта или его блокировке без возмещения упущенной выгоды.', uz: 'E\'lon joylashtirib, foydalanuvchi Foydalanuvchi kelishuvi va ushbu Qoidalar bilan tanishganini tasdiqlaydi. Qoidabuzarlik e\'lonni rad etish, akkauntni cheklash yoki yo\'qotilgan foydani qoplamasdan bloklashga olib kelishi mumkin.' } },
        { type: 'p', text: { ru: 'Одно объявление — одно предложение. Нельзя дублировать одно и то же объявление в нескольких категориях или аккаунтах, чтобы обойти модерацию или лимиты.', uz: 'Bitta e\'lon — bitta taklif. Moderatsiya yoki limitlarni chetlab o\'tish uchun bir xil e\'lonni bir nechta kategoriya yoki akkauntda takrorlash mumkin emas.' } },
      ],
    },
    {
      id: 's2',
      title: { ru: '2. Содержание и оформление', uz: '2. Mazmun va rasmiylashtirish' },
      blocks: [
        { type: 'ul', items: [
          { ru: 'язык — узбекский или русский, без оскорблений;', uz: 'til — o\'zbek yoki rus, haqoratlarsiz;' },
          { ru: 'категория должна соответствовать товару или услуге;', uz: 'kategoriya tovar yoki xizmatga mos bo\'lishi kerak;' },
          { ru: 'цена указывается в выбранной валюте честно, без скрытых доплат в тексте, если они обязательны;', uz: 'narx tanlangan valyutada halol ko\'rsatiladi, majburiy bo\'lsa matnda yashirin to\'lovlarsiz;' },
          { ru: 'фото и описание соответствуют реальному предложению, без чужих водяных знаков и чужих объявлений;', uz: 'surat va tavsif haqiqiy taklifga mos, begona suv belgilari va boshqa e\'lonlarsiz;' },
          { ru: 'контакты указываются в предусмотренных полях, а не прячутся в картинке.', uz: 'aloqa ma\'lumotlari rasmga yashirilmasdan, belgilangan maydonlarda ko\'rsatiladi.' },
        ] },
      ],
    },
    {
      id: 's3',
      title: { ru: '3. Что запрещено публиковать', uz: '3. Nimalarni e\'lon qilish mumkin emas' },
      blocks: [
        { type: 'ul', items: [
          { ru: 'наркотики, прекурсоры, рецептурные лекарства без права оборота;', uz: 'giyohvand moddalar, prekursorlar, muomalaga huquqsiz retseptli dori vositalari;' },
          { ru: 'оружие, боеприпасы, взрывчатые вещества и запрещённую пиротехнику;', uz: 'qurol, o\'q-dori, portlovchi moddalar va taqiqlangan pirotexnika;' },
          { ru: 'контрафакт, пиратский контент, чужие аккаунты и базы персональных данных;', uz: 'kontrafakt, pirat kontent, begona akkauntlar va shaxsiy ma\'lumotlar bazalari;' },
          { ru: 'финансовые пирамиды, нелегальные ставки и схемы «быстрых денег»;', uz: 'moliyaviy piramidalar, noqonuniy tikishlar va «tez pul» sxemalari;' },
          { ru: 'интим-услуги, порнографию и любой контент с участием несовершеннолетних;', uz: 'intim xizmatlar, pornografiya va voyaga yetmaganlar ishtirokidagi har qanday kontent;' },
          { ru: 'украденное имущество и товары с незаконным оборотом;', uz: 'o\'g\'irlangan mol-mulk va noqonuniy muomaladagi tovarlar;' },
          { ru: 'объявления, вводящие в заблуждение или нарушающие права третьих лиц.', uz: 'chalg\'ituvchi yoki uchinchi shaxslar huquqini buzuvchi e\'lonlar.' },
        ] },
      ],
    },
    {
      id: 's4',
      title: { ru: '4. Отдельные категории', uz: '4. Ayrim kategoriyalar' },
      blocks: [
        { type: 'ul', items: [
          { ru: 'Транспорт — указывайте реальные характеристики; при запросе модерации пользователь предоставляет подтверждающие сведения.', uz: 'Transport — haqiqiy xususiyatlarni ko\'rsating; moderatsiya so\'rasa, foydalanuvchi tasdiqlovchi ma\'lumot beradi.' },
          { ru: 'Недвижимость — размещает лицо, имеющее право предлагать объект, либо его представитель.', uz: 'Ko\'chmas mulk — obyektni taklif qilish huquqiga ega shaxs yoki uning vakili joylashtiradi.' },
          { ru: 'Услуги — если закон требует лицензию, квалификацию или реестр, это нужно отразить в объявлении.', uz: 'Xizmatlar — qonun litsenziya, malaka yoki reestr talab qilsa, buni e\'londa aks ettirish kerak.' },
          { ru: 'Животные и продукты питания — только при соблюдении санитарных и ветеринарных требований.', uz: 'Hayvonlar va oziq-ovqat — faqat sanitariya va veterinariya talablari bajarilganda.' },
        ] },
      ],
    },
    {
      id: 's5',
      title: { ru: '5. Модерация и жалобы', uz: '5. Moderatsiya va shikoyatlar' },
      blocks: [
        { type: 'p', text: { ru: 'Платформа проверяет объявления автоматически и вручную. Критерии проверки полностью не раскрываются. При сомнениях в законности объявление может быть отклонено.', uz: 'Platforma e\'lonlarni avtomatik va qo\'lda tekshiradi. Tekshiruv mezonlari to\'liq oshkor etilmaydi. Qonuniylikka shubha bo\'lsa, e\'lon rad etilishi mumkin.' } },
        { type: 'p', text: { ru: 'Пожаловаться на объявление можно через интерфейс Платформы или по адресу support@qoldanqolga.uz, указав ссылку/ID и причину. Срок рассмотрения — до 15 дней, если не требуется дополнительная проверка.', uz: 'E\'longa Platforma interfeysi yoki support@qoldanqolga.uz orqali, havola/ID va sababni ko\'rsatib shikoyat qilish mumkin. Qo\'shimcha tekshiruv talab qilinmasa, ko\'rib chiqish muddati 15 kungacha.' } },
      ],
    },
  ],
}
