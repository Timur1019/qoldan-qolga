# UI-kit

Примитивы без домена. Импорт только отсюда:

```js
import {
  UiButton, UiField, UiInput, UiSelect, UiToggle, UiAlert, UiModal, UiPagination,
} from '@/shared/ui'
```

Не класть новые кнопки/инпуты в `src/components/ui`. Там оболочка и скелетоны, не форма.

## Есть

| Компонент | Зачем |
|---|---|
| `UiButton` | primary / outline / danger / ghost, размеры, loading |
| `UiInput` | input и textarea (`multiline`) |
| `UiField` | label + hint + ошибка под полем |
| `UiSelect` / `UiSelectTrigger` | нативный select и кнопка-триггер, `size="sm"` |
| `UiToggle` | `onChange(boolean)`, не event |
| `UiChoiceList` | группа вариантов (да/нет, состояние) |
| `UiAlert` | ошибка / успех |
| `UiModal` | оверлей + панель, `footer`, `wide` |
| `UiPagination` | диапазон записей, размер страницы, номера страниц |

Образец: Auth, CreateAd, админка, EditProfile, ReviewModal.

## Ещё нет — не рисовать локально, если нужно в двух местах

`UiEmptyState`, `UiConfirm`, `UiSpinner`, `UiBadge`, `UiTabs`.

Пока нет — один раз добавить сюда, не копировать разметку в фичу.
