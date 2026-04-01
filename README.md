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
| `media` | <img src="https://api.iconify.design/mdi/play-circle.svg" width="20" /> <img src="https://api.iconify.design/mdi/pause-circle.svg" width="20" /> <img src="https://api.iconify.design/mdi/stop-circle.svg" width="20" /> <img src="https://api.iconify.design/mdi/play-circle-outline.svg" width="20" /> | playing / paused / stopped / other |
| `volume` | <img src="https://api.iconify.design/mdi/volume-off.svg" width="20" /> <img src="https://api.iconify.design/mdi/volume-low.svg" width="20" /> <img src="https://api.iconify.design/mdi/volume-medium.svg" width="20" /> <img src="https://api.iconify.design/mdi/volume-high.svg" width="20" /> | 0..100 or 0..1 |

### Built-in color templates

| Template | Preview |
|---|---|
| `roygbiv` | <img src="https://img.shields.io/badge/-%23ef4444-ef4444" /> <img src="https://img.shields.io/badge/-%23f97316-f97316" /> <img src="https://img.shields.io/badge/-%23eab308-eab308" /> <img src="https://img.shields.io/badge/-%2322c55e-22c55e" /> <img src="https://img.shields.io/badge/-%233b82f6-3b82f6" /> <img src="https://img.shields.io/badge/-%236366f1-6366f1" /> <img src="https://img.shields.io/badge/-%23a855f7-a855f7" /> |
| `royg` | <img src="https://img.shields.io/badge/-%23ef4444-ef4444" /> <img src="https://img.shields.io/badge/-%23eab308-eab308" /> <img src="https://img.shields.io/badge/-%2322c55e-22c55e" /> |
| `on_off` | <img src="https://img.shields.io/badge/on-active%20HA-f59e0b" /> <img src="https://img.shields.io/badge/off-inactive%20HA-6b7280" /> |

> Note: custom templates from card config override built-ins when names are the same.

Card-level template registries:

- `icon_templates` — map of `template_name: "{{ ... }}"` for icons
- `color_templates` — map of `template_name: "{{ ... }}"` for colors
- `debug` — `true/false`; prints template resolution diagnostics to browser console and shows recent debug lines inside the card
- `show_all` — `true/false`; when `true`, all badges are shown in dashboard edit mode (ignores per-badge `show*` filters)

`icon_template` / `color_template` value formats on each badge:

- string: `battery`
- object: `{ name: battery, param: "{{ states(entity) }}" }`
- array: `[battery, "{{ states(entity) }}"]`

If `param` is omitted, default value is `states(entity)`.

## Badge fields

- `entity` — entity id used inside templates (`entity` variable)
- `show` — template/boolean; if false badge is hidden
- `show_value` — show only if `states(entity)` equals this value
- `show_not_value` — show only if `states(entity)` is not equal to this value
- `show_in` — show only if `states(entity)` is in provided array
- `show_not_in` — show only if `states(entity)` is not in provided array
- `show_below` — show only if numeric `states(entity)` is below this number
- `show_above` — show only if numeric `states(entity)` is above this number
- `icon` — left icon (mdi)
- `icon_template` — named icon template reference (preferred over `icon` when set)
- `sub_icon` — optional middle icon (shown in a small circle between main icon and text)
- `sub_icon_color` — template/string color for `sub_icon` (default: main icon color)
- `color` — template/string; default `#4b5563`
- `color_template` — named color template reference (preferred over `color` when set)
- `title` — template/string
- `subtitle` — template/string
- `badge` — optional small icon in top-right corner
- `badge_color` — template/string for badge icon color
- `tap_action` — click action (default: `more-info`)
- `double_tap_action` — double click action (default: `none`)
- `hold_action` — hold action (default: `none`)

### Templates

Templates support expressions in `{{ ... }}` and conditional Jinja-style blocks `{% if ... %}...{% elif ... %}...{% else %}...{% endif %}`.

Available helpers/variables inside template:

- `entity` — current badge entity_id string
- `hass`
- `badge`
- `config`
- `states(entity_id)`
- `state_attr(entity_id, attr)`
- `is_state(entity_id, value)`
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
subtitle: "{{ state_attr(entity, 'friendly_name') }}"
```

## Auto-deploy after commit (SSH)

This repo can auto-deploy `seagull-badges-card.js` to Home Assistant on every commit.

Included files:

- `scripts/deploy-to-ha.sh`
- `.githooks/post-commit`

Default target values (can be overridden via env vars):

- `HA_HOST=192.168.1.184`
- `HA_USER=avc`
- `HA_KEY=~/.ssh/id_ed25519_openclaw_ha`
- `HA_TARGET_FILE=/config/www/seagull-badges-card.js`

Manual deploy:

```bash
./scripts/deploy-to-ha.sh
```

Post-commit hook is enabled via local git config:

```bash
git config core.hooksPath .githooks
```

The hook does not block commits if deploy fails (it prints a warning).

## Behavior

- Visible badges are laid out in a single row with equal width columns.
- If only icon is set (no title/subtitle), badge renders as a circle.
- Otherwise badge renders as rounded pill with icon + text block.
- Badge text color follows icon color.
