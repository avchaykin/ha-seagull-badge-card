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
  - entity: sun.sun
    show: "{{ true }}"
    icon: mdi:weather-sunny
    color: "{{ states(entity) === 'above_horizon' ? '#f59e0b' : '#4b5563' }}"
    title: "{{ states(entity) === 'above_horizon' ? 'Day' : 'Night' }}"
    subtitle: "{{ states(entity) }}"
    badge: mdi:check-circle
    badge_color: '#16a34a'
```

## Badge fields

- `entity` — entity id used inside templates (`entity` variable)
- `show` — template/boolean; if false badge is hidden
- `icon` — left icon (mdi)
- `color` — template/string; default `#4b5563`
- `title` — template/string
- `subtitle` — template/string
- `badge` — optional small icon in top-right corner
- `badge_color` — template/string for badge icon color
- `tap_action` — click action (default: `more-info`)
- `double_tap_action` — double click action (default: `none`)
- `hold_action` — hold action (default: `none`)

### Templates

Templates use mustache expressions in `{{ ... }}` format.

Available helpers/variables inside template:

- `entity` — current badge entity_id string
- `hass`
- `badge`
- `config`
- `states(entity_id)`
- `state_attr(entity_id, attr)`
- `is_state(entity_id, value)`

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
