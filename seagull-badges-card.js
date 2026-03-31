class SeagullBadgesCard extends HTMLElement {
  static getStubConfig() {
    return {
      type: "custom:seagull-badges-card",
      badges: [
        {
          entity: "sun.sun",
          show: "[[[ return true ]]]",
          icon: "mdi:weather-sunny",
          icon_color: "[[[ return entity?.state === 'above_horizon' ? '#f59e0b' : '#4b5563' ]]]",
          title: "[[[ return entity?.state === 'above_horizon' ? 'Day' : 'Night' ]]]",
          subtitle: "[[[ return entity?.state ]]]",
          extra_icon: "mdi:check-circle",
          extra_icon_color: "#16a34a"
        }
      ]
    };
  }

  setConfig(config) {
    if (!config || !Array.isArray(config.badges)) {
      throw new Error("seagull-badges-card: badges must be an array");
    }

    this._config = {
      badges: config.badges,
      gap: config.gap ?? 10,
      padding: config.padding ?? 10,
      ...config,
    };
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._card) {
      this._card = document.createElement("ha-card");
      this._card.style.background = "transparent";
      this._card.style.boxShadow = "none";
      this._card.style.border = "none";
      this.appendChild(this._card);
    }

    const visible = (this._config.badges || [])
      .filter((badge) => this._toBool(this._tpl(badge.show, badge, true), true))
      .map((badge) => this._normalizeBadge(badge));

    this._card.innerHTML = this._render(visible);
  }

  _normalizeBadge(badge) {
    const stateObj = badge.entity ? this._hass?.states?.[badge.entity] : undefined;

    const icon = this._tpl(
      badge.icon,
      badge,
      stateObj?.attributes?.icon || "mdi:information-outline"
    );
    const iconColor = this._tpl(badge.icon_color, badge, "#4b5563");

    const title = this._tpl(badge.title, badge, "");
    const subtitle = this._tpl(badge.subtitle, badge, "");

    const extraIcon = this._tpl(badge.extra_icon, badge, "");
    const extraIconColor = this._tpl(badge.extra_icon_color, badge, "#6b7280");

    return {
      icon,
      iconColor,
      title: this._str(title),
      subtitle: this._str(subtitle),
      extraIcon,
      extraIconColor,
    };
  }

  _render(items) {
    if (!items.length) {
      return `<div style="padding:${this._config.padding}px;opacity:.65;">No badges to display</div>`;
    }

    const gap = Number(this._config.gap) || 10;
    const padding = Number(this._config.padding) || 10;

    const badgesHtml = items.map((item) => this._renderBadge(item)).join("");

    return `
      <style>
        .sg-wrap {
          display: grid;
          grid-template-columns: repeat(${items.length}, minmax(0, 1fr));
          gap: ${gap}px;
          align-items: stretch;
          padding: ${padding}px;
        }
        .sg-item {
          min-width: 0;
          position: relative;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          overflow: hidden;
        }
        .sg-circle {
          width: 52px;
          height: 52px;
          margin: 0 auto;
        }
        .sg-pill {
          min-height: 52px;
          padding: 8px 14px;
          justify-content: flex-start;
        }
        .sg-icon-bg {
          width: 38px;
          height: 38px;
          border-radius: 9999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 auto;
        }
        .sg-icon {
          --mdc-icon-size: 24px;
        }
        .sg-text-bg {
          border-radius: 9999px;
          padding: 6px 10px;
          min-width: 0;
        }
        .sg-text {
          min-width: 0;
          line-height: 1.15;
          display: flex;
          flex-direction: column;
        }
        .sg-title {
          font-weight: 700;
          font-size: 13px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .sg-subtitle {
          font-size: 12px;
          opacity: .85;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .sg-single {
          justify-content: center;
        }
        .sg-extra {
          position: absolute;
          top: 3px;
          right: 4px;
          --mdc-icon-size: 13px;
          filter: drop-shadow(0 1px 1px rgba(0,0,0,.18));
        }
      </style>
      <div class="sg-wrap">${badgesHtml}</div>
    `;
  }

  _renderBadge(item) {
    const hasTitle = !!item.title;
    const hasSubtitle = !!item.subtitle;
    const iconHtml = item.icon
      ? `<span class="sg-icon-bg" style="background:${this._withAlpha(item.iconColor, 0.14)};">
           <ha-icon class="sg-icon" style="color:${item.iconColor}" icon="${this._esc(item.icon)}"></ha-icon>
         </span>`
      : "";

    const extraIconHtml = item.extraIcon
      ? `<ha-icon class="sg-extra" style="color:${item.extraIconColor}" icon="${this._esc(item.extraIcon)}"></ha-icon>`
      : "";

    if (item.icon && !hasTitle && !hasSubtitle) {
      return `
        <div class="sg-item sg-circle">
          ${iconHtml}
          ${extraIconHtml}
        </div>
      `;
    }

    const textHtml = hasTitle || hasSubtitle
      ? `<div class="sg-text-bg" style="background:${this._withAlpha(item.iconColor, 0.14)};">
           <div class="sg-text ${hasTitle && hasSubtitle ? "" : "sg-single"}">
             ${hasTitle ? `<div class="sg-title">${this._esc(item.title)}</div>` : ""}
             ${hasSubtitle ? `<div class="sg-subtitle">${this._esc(item.subtitle)}</div>` : ""}
           </div>
         </div>`
      : "";

    return `
      <div class="sg-item sg-pill">
        ${iconHtml}
        ${textHtml}
        ${extraIconHtml}
      </div>
    `;
  }

  _tpl(value, badge, fallback = "") {
    if (value === undefined || value === null) return fallback;
    if (typeof value !== "string") return value;

    const t = value.trim();
    if (!(t.startsWith("[[[") && t.endsWith("]]]"))) {
      return value;
    }

    const code = t.slice(3, -3);
    const entity = badge.entity ? this._hass?.states?.[badge.entity] : undefined;

    try {
      const fn = new Function("hass", "entity", "badge", "config", code);
      const out = fn(this._hass, entity, badge, this._config);
      return out ?? fallback;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn("seagull-badges-card template error", e);
      return fallback;
    }
  }

  _toBool(value, fallback = true) {
    if (value === undefined || value === null) return fallback;
    if (typeof value === "boolean") return value;
    if (typeof value === "number") return value !== 0;
    if (typeof value === "string") {
      const v = value.trim().toLowerCase();
      if (["false", "0", "off", "no", "none", "null", ""].includes(v)) return false;
      if (["true", "1", "on", "yes"].includes(v)) return true;
    }
    return Boolean(value);
  }

  _str(v) {
    if (v === undefined || v === null) return "";
    return String(v);
  }

  _withAlpha(color, alpha) {
    if (!color) return `rgba(75,85,99,${alpha})`;
    if (color.startsWith("#") && (color.length === 7 || color.length === 4)) {
      const hex = color.length === 4
        ? `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`
        : color;
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    return `color-mix(in srgb, ${color} ${Math.round(alpha * 100)}%, transparent)`;
  }

  _esc(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  getCardSize() {
    return 2;
  }
}

customElements.define("seagull-badges-card", SeagullBadgesCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "seagull-badges-card",
  name: "Seagull Badges Card",
  preview: true,
  description: "Badges card with templated visibility, colors and labels"
});
