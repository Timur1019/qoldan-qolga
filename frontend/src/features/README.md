# Карта фронтенда

Одна схема. Если сомневаешься — таблица «куда класть файл», не соседний экран.

Образец фичи: `ad/pages/CreateAd` + секции в `ad/components/CreateAd*`.

## Слои

```
src/
├── api/           HTTP. Только отсюда: @/api/ads, @/api/auth, …
├── shared/ui/     Кнопка, поле, инпут, селект, тогл, алерт — без домена
├── components/    Оболочка приложения: Layout, роут-гарды, OSMMap, глобальные модалки
├── features/      Домен: страницы, секции, хуки этой фичи
├── context/       Auth, язык, регионы, тосты
├── hooks/         Хуки, которыми пользуются 2+ фичи
├── utils/         Общие чистые функции
├── constants/     Справочники и маршруты
└── i18n/
```

`src/pages/` нет. Не создавать.

## Куда класть файл

Идти сверху вниз, остановиться на первом «да».

| Это что? | Куда | Пример |
|---|---|---|
| Кнопка, инпут, поле, алерт, селект без домена | `src/shared/ui` | `UiButton`, `UiField` |
| Шапка, футер, таббар, ProtectedRoute, карта | `src/components` | `Layout`, `OSMMap` |
| Страница или кусок одной фичи | `features/<domain>/` | `CreateAdPhotos`, `AdminUsers` |
| HTTP к бэкенду | `src/api/<domain>.js` | `ads.js`, `admin.js` |
| Хук / утилита двух и больше фич | `src/hooks`, `src/utils` | `useIsMobile` |
| Хук одной страницы | `features/<domain>/hooks` | `useCreateAdUploads` |

Не класть доменные страницы в `src/components`. Не класть сырой `<button>` формы в фичу, если это умеет `shared/ui`.

## Шаблон фичи

```
features/<name>/
├── pages/          Маршруты. Оркестрация хуков, без вёрстки секций
├── components/     Папка на компонент: Component.jsx + .module.css + index.js
├── hooks/          Данные и действия этой фичи
├── utils/          Чистые функции фичи
└── index.js        Публичный API: страницы и то, что реально нужно снаружи
```

Правила:

- Нет `services/` внутри фичи. HTTP только из `@/api/*`.
- Нет CSS страницы, который импортирует ребёнок. Стили рядом с компонентом.
- Нет пустых папок (`pages/Login`, если логина нет).
- JSX длиннее ~250 строк или CSS длиннее ~300 — резать в том же PR.
- Снаружи фичи импортировать только из `index.js`, не лезть в `utils/` соседа.

`chat`, `home` и `business` уже по этому шаблону: страница оркестрирует, секции в `components/`, данные в `hooks/`. `content` — страница = папка (`About/`, `Rules/`).

Разрезанные экраны (CSS рядом с компонентом, не в CSS страницы):

- список: `AdsListResults` + `AdsListAdRow`
- чат: `useChatPage` + `ChatThread` + `ChatMessage`
- карточка: `AdDetailTopBar`, `AdDetailMeta`, `AdGallerySellerFooter`, `AdReportModal`
- фильтры: `Filter*` внутри `AdsFiltersSidebar/`
- шапка: `DesktopHeader`, `DesktopProfileMenu`, `DesktopRegionSelect`

## Фичи

| Папка | За что |
|---|---|
| `ad` | Список, карточка, создание, избранное, фильтры |
| `auth` | Телефон / SMS (модалка, не отдельные страницы) |
| `profile` | Кабинет, мои объявления, отзывы, публичный продавец |
| `admin` | Админка |
| `home` | Главная |
| `chat` | Чаты |
| `business` | Заявка бизнеса |
| `content` | About, Regions, Rules, PromoResult, VerificationCallback |

Страницы в `App.jsx` подключаются из `./features/{ad,auth,profile,admin,home,chat,business,content}`.

## Импорты

Алиас `@/` = `src/`.

```js
import { adsApi } from '@/api/ads'
import { UiButton, UiField, UiInput } from '@/shared/ui'
import { useLang } from '@/context/LangContext'
import CreateAdPhotos from '../../components/CreateAdPhotos'
```

| Нужно | Писать | Не писать |
|---|---|---|
| HTTP | `@/api/ads` | `features/*/services` |
| UI-кит | `@/shared/ui` | сырой `btn btn-primary` в новой форме |
| Своя фича | относительный путь | — |
| Чужая фича | `@/features/ad` (index): страницы, `AdCard`, `AdCardGrid`, `filterPublicAds`, `isSystemConversation`, `takePendingChat`, `isSellerStore` | `@/features/ad/utils/pendingChat` |
| Хелперы HTTP | `@/api/client` (`imageUrl`, `apiRequest`) | доменные методы из `client.js` |
| курс валют | `@/api/currency` | — |

## UI-kit

Живой список: [`src/shared/ui`](../shared/ui/README.md).

Новый файл с формой и любой файл, который открыли по задаче, — через `UiField` / `UiInput` / `UiButton` / `UiAlert`.

`UiToggle.onChange(nextChecked)` — boolean, не DOM-событие.

## Чеклист PR

- Файл лежит в слое из таблицы, не «как в соседнем старом экране».
- Форма не добавляет сырой `<button>` / `<input>`, если это умеет kit.
- Стили в своём `*.module.css`, не в CSS родителя-страницы.
- Нет `services/` внутри фичи и нет импорта оттуда.
- Нет копипаста (`AVATAR_EMOJI` уже есть в `UserAvatar`).
- Большой файл разрезан, а не дописан ещё на 100 строк.
