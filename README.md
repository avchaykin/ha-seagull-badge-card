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

- `battery` → `mdi:battery-alert-variant-outline`, `mdi:battery-10..90`, `mdi:battery` (value 0..100)
- `light` → `mdi:lightbulb-on` / `mdi:lightbulb`
- `lock` → `mdi:lock` / `mdi:lock-open-variant`
- `door` → `mdi:door-open` / `mdi:door-closed`
- `window` → `mdi:window-open` / `mdi:window-closed`
- `leak` → `mdi:water-alert` / `mdi:water-check`
- `media` → `mdi:play-circle`, `mdi:pause-circle`, `mdi:stop-circle`, `mdi:play-circle-outline`
- `volume` → `mdi:volume-off`, `mdi:volume-low`, `mdi:volume-medium`, `mdi:volume-high`

### Built-in color templates

- `roygbiv` (0..100)
  - red `#ef4444` → orange `#f97316` → yellow `#eab308` → green `#22c55e` → blue `#3b82f6` → indigo `#6366f1` → violet `#a855f7`
- `royg` (0..100)
  - red `#ef4444` → yellow `#eab308` → green `#22c55e`
- `on_off`
  - on/open/playing/locked → `var(--state-icon-active-color, #f59e0b)`
  - off/closed/etc → `var(--state-icon-color, #6b7280)`

> Note: custom templates from card config override built-ins when names are the same.

Card-level template registries:

- `icon_templates` — map of `template_name: "{{ ... }}"` for icons
- `color_templates` — map of `template_name: "{{ ... }}"` for colors
- `debug` — `true/false`; prints template resolution diagnostics to browser console and shows recent debug lines inside the card

`icon_template` / `color_template` value formats on each badge:

- string: `battery`
- object: `{ name: battery, param: "{{ states(entity) }}" }`
- array: `[battery, "{{ states(entity) }}"]`

If `param` is omitted, default value is `states(entity)`.

## Badge fields

- `entity` — entity id used inside templates (`entity` variable)
- `show` — template/boolean; if false badge is hidden
- `icon` — left icon (mdi)
- `icon_template` — named icon template reference (preferred over `icon` when set)
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
