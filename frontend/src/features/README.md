# Feature-based архитектура

Код разбит по фичам (доменам). Каждая фича инкапсулирует страницы, хуки и сервисы своей области.

## Текущая структура

```
src/
├── api/           # Общий API-клиент (используется фичами)
├── context/       # AuthContext, LangContext
├── constants/     # routes и др.
├── i18n/
├── utils/
├── hooks/         # Общие хуки: useAuthModal, useFavoriteClick, useStompChat
├── components/    # Layout, ProfileLayout, ProtectedRoute, AdminRoute, AdminLayout, CategoriesModal, OSMMap, ui/
├── pages/         # Home, Dashboard, EditProfile, MyAds, MyReviews, Chat, SellerProfile, AdminDashboard
└── features/
    ├── ad/        # Объявления
    │   ├── pages/     AdDetail, AdsList, CategoryView, CreateAd, Favorites
    │   ├── hooks/     useAdDetail, useAdActions (useFavoriteClick — в src/hooks, реэкспорт в index)
    │   ├── services/  adApi (реэкспорт adsApi, favoritesApi, referenceApi, …)
    │   └── index.js   Public API фичи
    └── auth/      # Авторизация
        ├── components/  AuthModal
        ├── pages/      Login, Register
        ├── services/   authApi
        └── index.js
```

## Использование в App.jsx

- Страницы объявлений и авторизации импортируются из `./features/ad` и `./features/auth`.
- Остальные страницы — из `./pages`.
- Layout импортирует `AuthModal` из `./features/auth`.

## Дальнейший рефакторинг

- **profile**: перенести Dashboard, EditProfile, MyAds, MyReviews, SellerProfile, ProfileLayout в `features/profile/`.
- **admin**: перенести AdminDashboard, AdminLayout в `features/admin/`.
- **shared**: при желании вынести Layout, общие компоненты и хуки в `shared/`.
