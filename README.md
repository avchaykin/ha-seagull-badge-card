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
icon_templates:
  battery: >-
    {{
      Number(value) <= 5 ? 'mdi:battery-alert-variant-outline' :
      Number(value) <= 15 ? 'mdi:battery-10' :
      Number(value) <= 25 ? 'mdi:battery-20' :
      Number(value) <= 35 ? 'mdi:battery-30' :
      Number(value) <= 45 ? 'mdi:battery-40' :
      Number(value) <= 55 ? 'mdi:battery-50' :
      Number(value) <= 65 ? 'mdi:battery-60' :
      Number(value) <= 75 ? 'mdi:battery-70' :
      Number(value) <= 85 ? 'mdi:battery-80' :
      Number(value) <= 95 ? 'mdi:battery-90' :
      'mdi:battery'
    }}
color_templates:
  battery: >-
    {% if value <= 15 %}
      #ef4444
    {% elif value <= 35 %}
      #f59e0b
    {% else %}
      #22c55e
    {% endif %}
badges:
  - entity: sensor.phone_battery
    show: "{{ true }}"
    icon_template: battery
    color_template: battery
    title: Phone
    subtitle: "{{ states(entity) + '%' }}"
    badge: mdi:check-circle
    badge_color: '#16a34a'
```

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

## Behavior

- Visible badges are laid out in a single row with equal width columns.
- If only icon is set (no title/subtitle), badge renders as a circle.
- Otherwise badge renders as rounded pill with icon + text block.
