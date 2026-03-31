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
padding: 10
badges:
  - entity: sun.sun
    show: "[[[ return true ]]]"
    icon: mdi:weather-sunny
    icon_color: "[[[ return entity?.state === 'above_horizon' ? '#f59e0b' : '#4b5563' ]]]"
    title: "[[[ return entity?.state === 'above_horizon' ? 'Day' : 'Night' ]]]"
    subtitle: "[[[ return entity?.state ]]]"
    extra_icon: mdi:check-circle
    extra_icon_color: '#16a34a'
```

## Badge fields

- `entity` — entity id used inside templates (`entity` variable)
- `show` — template/boolean; if false badge is hidden
- `icon` — left icon (mdi)
- `icon_color` — template/string; default `#4b5563`
- `title` — template/string
- `subtitle` — template/string
- `extra_icon` — optional small icon in top-right corner
- `extra_icon_color` — template/string for extra icon color

### Templates

Templates are JS snippets in `[[[ ... ]]]` format and receive:

- `hass`
- `entity`
- `badge`
- `config`

Example:

```yaml
show: "[[[ return entity && entity.state !== 'unavailable' ]]]"
```

## Behavior

- Visible badges are laid out in a single row with equal width columns.
- If only icon is set (no title/subtitle), badge renders as a circle.
- Otherwise badge renders as rounded pill with icon + text block.
