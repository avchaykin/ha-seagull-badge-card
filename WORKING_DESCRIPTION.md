# ha-seagull-badge-card — рабочее описание проекта

## 1) Суть проекта

`ha-seagull-badge-card` — кастомная Lovelace-карточка Home Assistant (`custom:seagull-badges-card`) для компактного отображения набора сущностей в виде «бейджей».

Карточка оптимизирована под:
- плотный информативный UI (иконка + текст + подиконки + стикер),
- гибкую шаблонизацию,
- условную видимость,
- удобные действия по клику/даблклику/удержанию,
- наследование параметров в группах.

---

## 2) Перечень функций (документация уровня реализации)

## 2.1 Установка и подключение
- Файл ресурса: `seagull-badges-card.js`.
- Размещение в HA: `/config/www/seagull-badges-card.js`.
- Lovelace Resource: `/local/seagull-badges-card.js?v=2` как JavaScript Module.

## 2.2 Конфигурация карточки (верхний уровень)
- `badges` — массив элементов/групп.
- `align`: `left|center|right|justified`.
- `wrap`: перенос на следующую строку.
- `gap`, `padding`, `padding_y`, `badge_size`.
- `full_width` (legacy-поведение как `align: justified`).
- `debug`, `show_all`, `placeholder_text`, `expand_time`.
- `palette` — словарь цветовых алиасов.
- `icon_templates`, `color_templates` — реестры именованных шаблонов.

## 2.3 Шаблоны
Поддерживается смешанный шаблонный слой:
- `{{ ... }}` выражения,
- `{% if/elif/else/endif %}`,
- `{% set var = ... %}` локальные переменные,
- фильтры: `round`, `upper`, `lower`, `trim`, `capitalize`, `title`.

Доступные переменные/хелперы в шаблонах:
- `entity`, `e`, `hass`, `badge`, `config`,
- `states(entity_id)`, `state_attr(entity_id, attr)`, `is_state(entity_id, value)`, `round(...)`,
- `s` и `entity_states` (алиас): `s[i] = states(e[i])`,
- `a` и `entity_attr` (алиас): `a[i]['attr'] = state_attr(e[i], 'attr')`.

## 2.4 Группы и наследование
- Поддержаны вложенные группы (`badges` внутри `badges`).
- Каскадное наследование параметров: card → group → badge.
- `sub_icon_group`: группа рендерится как один badge с набором подиконок детей.

## 2.5 Badge: контент/внешний вид
- Основные поля: `icon`, `title`, `subtitle`, `sub_icon`, и т.д.
- Цветовая модель:
  - `color` / `color_template` — accent-цвет,
  - `background` / `background_template` — фон badge,
  - при `background=false|none|0` фон становится прозрачным.
- Геометрия:
  - `width` в условных единицах (1 = «круглая» базовая ширина),
  - контент может расширять badge,
  - `width` имеет приоритет над растяжением в `align: justified`.

## 2.6 Sticker (бывший badge-marker)
Поддержана отдельная подсистема «стикера» справа-сверху:
- `sticker` — иконка,
- `sticker_text` — текст,
- `sticker_color` / `sticker_color_template` — фон,
- `sticker_icon_color` / `sticker_icon_color_template` — цвет иконки/текста,
- `sticker_size` — масштаб.

Поведение:
- если только иконка — стикер строго круглый,
- при наличии текста стикер вытягивается влево,
- правый край зафиксирован,
- позиция привязана к средней точке дуги скругления правого верхнего угла,
- фон стикера непрозрачный.

## 2.7 Условная видимость
Для badge:
- `show`, `show_value`, `show_not_value`, `show_in`, `show_not_in`, `show_below`, `show_above`.

Для sticker (аналогично):
- `sticker_show`, `sticker_show_value`, `sticker_show_not_value`, `sticker_show_in`, `sticker_show_not_in`, `sticker_show_below`, `sticker_show_above`.

## 2.8 Действия
Поддерживаются для `tap_action`, `double_tap_action`, `hold_action`:
- `more-info`,
- `toggle` (с отдельной обработкой `lock.*` через `lock.lock/unlock`),
- `navigate` (`navigation_path`, `url_path`),
- `perform-action` (и алиасы `perform_action`, `call-service`, `call_service`) с `perform_action/service + data/service_data + target`,
- `expand`, `none`.

---

## 3) Список выполненных доработок (по переписке, сгруппировано)

## 3.1 Шаблонизация и переменные
1. Добавлены предустановленные массивы состояний/атрибутов:
   - `s` + алиас `entity_states`,
   - `a` + алиас `entity_attr`.
2. Реализована поддержка `{% set %}` в Jinja-блоках с локальными переменными.
3. Расширены строковые фильтры (`upper/lower/trim/capitalize/title`) и сохранён `round`.

## 3.2 Действия
1. Исправлен `toggle` для `lock.*` (перевод в `lock`/`unlock`).
2. Добавлена поддержка `navigate`.
3. Добавлена поддержка `perform-action` и совместимых форматов.

## 3.3 Layout и ширина
1. Введён параметр `width` (минимальная ширина в относительных единицах).
2. Добавлен приоритет `width` над растяжением `align: justified`.

## 3.4 Цветовая модель
1. Добавлены `background` / `background_template`.
2. Разделены понятия accent-цвета (`color`) и фона (`background`).
3. Поддержан прозрачный фон при `background=false/none/0`.

## 3.5 Sticker-система
1. Переименование marker-терминологии: `badge` → `sticker` (с backward compatibility).
2. Добавлены текст/цвет/размер и отдельный цвет иконки.
3. Исправлена геометрия позиционирования стикера (якорение в правом верхнем скруглении).
4. Добавлено правило «иконка без текста = круглый стикер».
5. Добавлена отдельная группа условий видимости `sticker_show*`.

## 3.6 Документация
1. README реструктурирован: поля сгруппированы по смысловым блокам.
2. Обновлены примеры и описания параметров под новые возможности.

---

## 4) Текущее состояние
Проект в рабочем состоянии с расширенной функциональностью по шаблонам, действиям, layout и sticker.
Основная документация в `README.md` актуализирована; этот файл (`WORKING_DESCRIPTION.md`) служит кратким «рабочим паспортом» проекта и журналом ключевых доработок.
