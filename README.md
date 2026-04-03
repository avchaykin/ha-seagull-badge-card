# ha-seagull-badge-card

Home Assistant custom card: `seagull-badges-card`.

## Install (manual)

1. Copy `seagull-badges-card.js` to HA config:
   - `/config/www/seagull-badges-card.js`
2. Add Lovelace resource:
   - URL: `/local/seagull-badges-card.js?v=2`
   - Type: **JavaScript Module**

## Card config

```yaml
type: custom:seagull-badges-card
gap: 10
padding: 4
badge_size: 50
padding_y: 0
badges:
  - entity: sensor.phone_battery
    icon_template: battery
    color_template: royg
    title: Phone
    subtitle: "{{ states(entity) + '%' }}"

  - entity: light.kitchen
    icon_template: light
    color_template: on_off
    title: Kitchen
```


## Built-in named templates

You can use these without defining `icon_templates` / `color_templates` manually.

### Built-in icon templates

| Template | Preview | Notes |
|---|---|---|
| `battery` | <img src="https://api.iconify.design/mdi/battery-alert-variant-outline.svg" width="20" /> <img src="https://api.iconify.design/mdi/battery-30.svg" width="20" /> <img src="https://api.iconify.design/mdi/battery-60.svg" width="20" /> <img src="https://api.iconify.design/mdi/battery-90.svg" width="20" /> <img src="https://api.iconify.design/mdi/battery.svg" width="20" /> | value 0..100 |
| `battery-charging` | <img src="https://api.iconify.design/mdi/battery-charging-20.svg" width="20" /> <img src="https://api.iconify.design/mdi/battery-charging-50.svg" width="20" /> <img src="https://api.iconify.design/mdi/battery-charging-80.svg" width="20" /> <img src="https://api.iconify.design/mdi/battery-charging-100.svg" width="20" /> <img src="https://api.iconify.design/mdi/battery-charging.svg" width="20" /> | value 0..100 |
| `light` | <img src="https://api.iconify.design/mdi/lightbulb-on.svg" width="20" /> <img src="https://api.iconify.design/mdi/lightbulb.svg" width="20" /> | on / off |
| `lock` | <img src="https://api.iconify.design/mdi/lock.svg" width="20" /> <img src="https://api.iconify.design/mdi/lock-open-variant.svg" width="20" /> | locked / unlocked |
| `door` | <img src="https://api.iconify.design/mdi/door-open.svg" width="20" /> <img src="https://api.iconify.design/mdi/door-closed.svg" width="20" /> | open / closed |
| `window` | <img src="https://api.iconify.design/mdi/window-open.svg" width="20" /> <img src="https://api.iconify.design/mdi/window-closed.svg" width="20" /> | open / closed |
| `leak` | <img src="https://api.iconify.design/mdi/water-alert.svg" width="20" /> <img src="https://api.iconify.design/mdi/water-check.svg" width="20" /> | leak / dry |
| `media` | <img src="https://api.iconify.design/mdi/play.svg" width="20" /> <img src="https://api.iconify.design/mdi/pause.svg" width="20" /> <img src="https://api.iconify.design/mdi/stop.svg" width="20" /> <img src="https://api.iconify.design/mdi/play-outline.svg" width="20" /> | playing / paused / stopped / other |
| `media-circle` | <img src="https://api.iconify.design/mdi/play-circle.svg" width="20" /> <img src="https://api.iconify.design/mdi/pause-circle.svg" width="20" /> <img src="https://api.iconify.design/mdi/stop-circle.svg" width="20" /> <img src="https://api.iconify.design/mdi/play-circle-outline.svg" width="20" /> | playing / paused / stopped / other |
| `volume` | <img src="https://api.iconify.design/mdi/volume-off.svg" width="20" /> <img src="https://api.iconify.design/mdi/volume-low.svg" width="20" /> <img src="https://api.iconify.design/mdi/volume-medium.svg" width="20" /> <img src="https://api.iconify.design/mdi/volume-high.svg" width="20" /> | 0..100 or 0..1 |

### Built-in color templates

| Template | Preview |
|---|---|
| `roygbiv` | <img src="https://img.shields.io/badge/-%23ef4444-ef4444" /> <img src="https://img.shields.io/badge/-%23f97316-f97316" /> <img src="https://img.shields.io/badge/-%23eab308-eab308" /> <img src="https://img.shields.io/badge/-%2322c55e-22c55e" /> <img src="https://img.shields.io/badge/-%233b82f6-3b82f6" /> <img src="https://img.shields.io/badge/-%236366f1-6366f1" /> <img src="https://img.shields.io/badge/-%23a855f7-a855f7" /> |
| `royg` | <img src="https://img.shields.io/badge/-%23ef4444-ef4444" /> <img src="https://img.shields.io/badge/-%23eab308-eab308" /> <img src="https://img.shields.io/badge/-%2322c55e-22c55e" /> |
| `iroygbiv` | <img src="https://img.shields.io/badge/-%23a855f7-a855f7" /> <img src="https://img.shields.io/badge/-%236366f1-6366f1" /> <img src="https://img.shields.io/badge/-%233b82f6-3b82f6" /> <img src="https://img.shields.io/badge/-%2322c55e-22c55e" /> <img src="https://img.shields.io/badge/-%23eab308-eab308" /> <img src="https://img.shields.io/badge/-%23f97316-f97316" /> <img src="https://img.shields.io/badge/-%23ef4444-ef4444" /> |
| `iroyg` | <img src="https://img.shields.io/badge/-%2322c55e-22c55e" /> <img src="https://img.shields.io/badge/-%23eab308-eab308" /> <img src="https://img.shields.io/badge/-%23ef4444-ef4444" /> |
| `temperature` | <img src="https://img.shields.io/badge/≤0°C-3b82f6" /> <img src="https://img.shields.io/badge/≤10°C-06b6d4" /> <img src="https://img.shields.io/badge/≤20°C-22c55e" /> <img src="https://img.shields.io/badge/≤28°C-eab308" /> <img src="https://img.shields.io/badge/≤35°C-f97316" /> <img src="https://img.shields.io/badge/>35°C-ef4444" /> |
| `room_temperature` | <img src="https://img.shields.io/badge/<16°C-3b82f6" /> <img src="https://img.shields.io/badge/18..22°C-comfort-84cc16" /> <img src="https://img.shields.io/badge/>27°C-ef4444" /> |
| `on_off` | <img src="https://img.shields.io/badge/on-active%20HA-f59e0b" /> <img src="https://img.shields.io/badge/off-inactive%20HA-6b7280" /> |

> Note: custom templates from card config override built-ins when names are the same.

Card-level template registries:

- `icon_templates` — map of `template_name: "{{ ... }}"` for icons
- `color_templates` — map of `template_name: "{{ ... }}"` for colors
- `align` — badge row alignment: `center` (default), `left`, `right`, `justified`
  - `justified` stretches badges to fill row width (same behavior as `full_width: true`)
- `wrap` — `true/false`; when `true`, badges wrap to the next row if they overflow available width
- `full_width` — legacy compatibility flag; when `true`, behaves like `align: justified`
- `debug` — `true/false`; prints template resolution diagnostics to browser console and shows recent debug lines inside the card
- `show_all` — `true/false`; when `true`, all badges are shown in dashboard edit mode (ignores per-badge `show*` filters)
- `placeholder_text` — text shown when no badges are visible; set empty string (`""`) to render nothing
- `palette` — map of named colors. You can reuse these names in `color`, `background`, `sub_icon_color`, `sticker_color`, `sticker_icon_color`, and color templates
- `padding_y` — top/bottom inner padding of badge row (set `0` for edge-touching layout). Defaults to `padding`.
  - when `padding_y: 0`, row min-height lock is disabled to remove extra top/bottom gaps
- `expand_time` — expand/collapse animation duration in milliseconds (default `320`)

`icon_template` / `color_template` value formats on each badge:

- string: `battery`
- object: `{ name: battery, param: "{{ states(entity) }}", scale: 100, offset: 0 }`
- object (range form): `{ name: battery, param: "{{ states(entity) }}", scale: [400, 1200] }`
- array: `[battery, "{{ states(entity) }}", 100, 0]`

If `param` is omitted, default value is `states(entity)`.

Palette example:

```yaml
palette:
  accent: "#22c55e"
  warning: "#f59e0b"
  danger: "#ef4444"
  ha_primary: "primary"

badges:
  - entity: sensor.phone_battery
    color: danger
    sub_icon_color: ha_primary
```

If `scale` and/or `offset` are provided, template `value` is normalized to 0..100.

Preferred form:
- `scale: [min, max]`
- `value = ((param - min) / (max - min)) * 100`

Legacy form (still supported):
- `scale: max` + optional `offset: min`
- `value = ((param - offset) / (scale - offset)) * 100`

## Badge groups

Inside `badges`, you can define a group object with nested `badges`.

Inheritance is generic and cascading:

- any parameter defined on the **card level** is inherited by all nested groups and badges
- any parameter defined on a **group level** is inherited by nested groups and badges
- any parameter defined directly on a badge overrides inherited value
- nested groups are supported (inheritance cascades)

### `sub_icon_group`

Group-level flag, default `false`.

When `sub_icon_group: true`:

- group is rendered as a **single badge**
- main `icon` / `icon_template`, `title`, `subtitle` are taken from group-level config
- group badge is shown if **at least one child badge** is visible by `show*` rules
- `sub_icon` values are taken from visible child badges
- multiple visible child sub-icons are rendered in a row
- tap/double-tap/hold on a specific sub-icon triggers that child badge actions
- for entity-based actions (`more-info`, `toggle`), entity is taken from the clicked child badge

Example:

```yaml
badges:
  - color_template: room_temperature
    border: primary
    border_size: 1
    badges:
      - entity: sensor.living_temp
        icon_template: temperature
      - entity: sensor.bedroom_temp
        icon_template: temperature
        border_size: 2 # override
```

## Badge fields

### 1) Entity & visibility

Badge visibility keys:

- `entity` — entity id **or array of entity ids** used inside templates
  - note: each `badges` item can be either a badge object (`entity` + params) or a group object (`badges: [...]` + inherited params)
  - when array is used, first item becomes default `entity` (same as `e[0]`)
  - full array is available as `e` in templates (`e[0]`, `e[1]`, ...)
- `show` — template/boolean; if false badge is hidden
- `show_value` — show only if `states(entity)` equals this value
- `show_not_value` — show only if `states(entity)` is not equal to this value
- `show_in` — show only if `states(entity)` is in provided array
- `show_not_in` — show only if `states(entity)` is not in provided array
- `show_below` — show only if numeric `states(entity)` is below this number
- `show_above` — show only if numeric `states(entity)` is above this number

Sticker visibility keys (same semantics as `show*`, but applied only to sticker):
- `sticker_show`
- `sticker_show_value`
- `sticker_show_not_value`
- `sticker_show_in`
- `sticker_show_not_in`
- `sticker_show_below`
- `sticker_show_above`

- `br` — if present (any value), forces this badge to start from a new row

### 2) Icons & content

- `icon` — left icon (mdi)
- `icon_template` — named icon template reference (preferred over `icon` when set)
- `sub_icon` — optional middle icon (shown between main icon and text)
- `sub_icon_template` — named icon template reference for `sub_icon` (preferred over `sub_icon` when set)
- `title` — template/string
- `subtitle` — template/string
- `sticker` — optional sticker icon in top-right corner
- `sticker_text` — optional sticker text (sticker expands to the left, right edge stays anchored)
  - icon-only sticker is rendered as a perfect circle
  - backward compatibility: legacy `badge` / `badge_color` still work

### 3) Colors

- `color` — template/string accent color (used for icon/text defaults)
  - supports HA aliases: `primary`, `secondary`, `disabled`, `active`, `inactive`
  - for direct HA vars use CSS syntax, e.g. `var(--primary-color)`
- `color_template` — named color template reference for accent color (preferred over `color` when set)
- `background` — template/string background color (default: same as resolved `color`)
  - set `false` / `none` / `0` to make background transparent
- `background_template` — named color template reference for `background` (preferred over `background` when set)
- `icon_color` — template/string; icon/text color override (default: same as accent `color`)
- `sub_icon_color` — template/string color for `sub_icon` (default: main icon color)
- `sub_icon_color_template` — named color template reference for `sub_icon` (preferred over `sub_icon_color` when set)
- `title_color` — template/string; overrides title text color when set
- `subtitle_color` — template/string; overrides subtitle text color when set
- `sticker_color` — template/string sticker background color (default: accent `color`)
- `sticker_color_template` — named color template reference for sticker background
- `sticker_icon_color` — template/string sticker icon/text color (default: auto-contrast from `sticker_color`)
- `sticker_icon_color_template` — named color template reference for sticker icon/text color
- `border` — border color around badge (template/string, supports palette and HA color aliases). Default: same as icon color

### 4) Size & layout

- `width` — minimum badge width in relative units (`1` = round badge width, `2` = double width, etc.)
  - if content is wider, badge still expands to fit content
  - `none`/`false`/`0` disables explicit min-width
  - when set, has priority over `align: justified` (badge is not stretched to fill equally)
- `icon_size` — icon size multiplier (default `1`)
- `icon_offset` — horizontal icon offset in px (default `0`; positive moves right, negative moves left)
- `icon_gap` — gap in px between main icon slot and following content (default `2`; can be set globally on card or per-badge)
- `sub_icon_size` — size of `sub_icon` relative to main badge size (`1` = same size as main icon area; default `0.5`)
- `sub_icon_bg` — `true/false`; when `false`, `sub_icon` is shown without circular background (default `true`)
- `sticker_size` — relative sticker size multiplier (default `1`)
- `text_size` — text block size multiplier (default `1`)
- `text_offset` — horizontal text block offset in px (default `0`; positive moves right, negative moves left)
- `subtitle_size` — relative subtitle size multiplier vs title balance (default `1`):
  - `1` → title/subtitle are balanced equally
  - `<1` → subtitle gets smaller and title gets proportionally larger (total vertical balance preserved)
  - `>1` → subtitle gets larger and title gets proportionally smaller
- `border_size` — border width in px (default `0`, no border)

### 5) Actions

- `tap_action` — click action (default: `more-info`)
- `double_tap_action` — double click action (default: `none`)
  - when `entity` is an array and second entity exists, default becomes `more-info` for `e[1]`
  - exception: if `tap_action: expand`, then default `double_tap_action` becomes `more-info` for the primary entity (unless explicitly overridden)
- `hold_action` — hold action (default: `none`)
- supported actions include `more-info`, `toggle`, `navigate`, `perform-action`, `none`, and `expand`
  - `navigate` supports standard HA params: `navigation_path` (also accepts `url_path`)
  - `perform-action` supports standard HA params: `perform_action` (or `service`) + `data`/`service_data` + `target`
  - for `lock.*` entities, `toggle` is mapped automatically to `lock.lock` / `lock.unlock` based on current state
  - if `expand` is configured on any click type (`tap_action`, `double_tap_action`, or `hold_action`), the badge starts minimized (icon-only)
  - triggering the configured `expand` action toggles minimized/expanded view (shows/hides text and extra/sub icons)

### Templates

Templates support expressions in `{{ ... }}` and Jinja-style blocks:
- conditionals: `{% if ... %}...{% elif ... %}...{% else %}...{% endif %}`
- local variables: `{% set x = ... %}` (usable in following template expressions/blocks)

Available helpers/variables inside template:

- `entity` — current default entity_id string (`e[0]`)
- `e` — entity_id array when `entity` is configured as list
- `s` — preset state array for multi-entity badges (`s[0] = states(e[0])`, `s[1] = states(e[1])`, ...)
- `entity_states` — alias of `s`
- `a` — preset attributes array for multi-entity badges (`a[0]['attr'] = state_attr(e[0], 'attr')`, ...)
- `entity_attr` — alias of `a`
- `hass`
- `badge`
- `config`
- `states(entity_id)`
- `state_attr(entity_id, attr)`
- `is_state(entity_id, value)`
- `round(value, digits)` — numeric rounding helper for title/subtitle/templates
  - Jinja-style filter syntax is supported: `|round`, `|round(n)`, `|upper`, `|lower`, `|trim`, `|capitalize`, `|title`
  - examples: `{{ states(e[1])|round }}`, `{{ states(e[1])|round(1) }}`, `{{ states(entity)|upper }}`, `{{ s[0]|capitalize }}`
- `value` — input param for named templates (`icon_template` / `color_template`)
- `template_name` — current named template id
- `icon_templates` — alias for `config.icon_templates`
- `color_templates` — alias for `config.color_templates`

Examples:

```yaml
show: "{{ states(entity) !== 'unavailable' }}"
show_value: on
show_not_value: unavailable
show_in: ["on", "playing", "home"]
show_not_in: ["unknown", "unavailable"]
show_below: 30
show_above: 10

title: "{{ states(entity) === 'on' ? 'Active' : 'Idle' }}"
subtitle: "{{ round(Number(states(entity)), 1) + '°C' }}"

# set + reuse example
# sub_icon: |
#   {% set st = states(entity)|upper %}
#   {% if st == 'WASHING' %}mdi:roman-numeral-1{% else %}mdi:stop{% endif %}

# multi-entity example
# entity: [sensor.temp_living, sensor.humidity_living]
# title: "{{ states(e[0]) + '°' }}"
# subtitle: "{{ states(e[1]) + '%' }}"
# same using preset states array:
# title: "{{ s[0] + '°' }}"
# subtitle: "{{ s[1] + '%' }}"
# alias works too:
# title: "{{ entity_states[0] + '°' }}"
# attributes shortcuts:
# subtitle: "{{ a[0]['unit_of_measurement'] }}"
# subtitle: "{{ entity_attr[0]['unit_of_measurement'] }}"
```

## Behavior

- Visible badges are laid out in a single row; with `align: justified` badges stretch to equal widths.
- Badges with explicit `width` keep their own minimum width and are not force-stretched by `align: justified`.
- If only icon is set (no title/subtitle), badge renders as a circle.
- Otherwise badge renders as rounded pill with icon + text block.
- Badge text color follows icon color.
