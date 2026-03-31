# ha-seagull-badge-card

Home Assistant custom card: `seagull-badges-card`.

## Install (manual)

1. Copy `seagull-badges-card.js` to your HA config:
   - `/config/www/seagull-badges-card.js`
2. Add Lovelace resource:
   - URL: `/local/seagull-badges-card.js?v=1`
   - Type: JavaScript Module

## Usage

```yaml
type: custom:seagull-badges-card
title: Seagull Badges
badges:
  - label: Online
    color: "#1db954"
  - label: Dev
    color: "#3b82f6"
```
