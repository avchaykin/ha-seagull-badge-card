class SeagullBadgesCard extends HTMLElement {
  static getStubConfig() {
    return {
      type: "custom:seagull-badges-card",
      badges: [
        {
          entity: "sun.sun",
          show: "{{ true }}",
          icon: "mdi:weather-sunny",
          color: "{{ states(entity) === 'above_horizon' ? '#f59e0b' : '#4b5563' }}",
          title: "{{ states(entity) === 'above_horizon' ? 'Day' : 'Night' }}",
          subtitle: "{{ states(entity) }}",
          badge: "mdi:check-circle",
          badge_color: "#16a34a"
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
      padding: config.padding ?? 4,
      badge_size: config.badge_size ?? 50,
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

    visible.forEach((item, index) => {
      const el = this._card.querySelector(`[data-sg-id="sg-${index}"]`);
      if (!el) return;
      const handlers = this._wireActions(item);
      el.addEventListener("pointerdown", handlers.onPointerDown);
      el.addEventListener("pointerup", handlers.onPointerUp);
      el.addEventListener("pointerleave", handlers.onPointerLeave);
      el.addEventListener("click", handlers.onClick);
      el.addEventListener("dblclick", handlers.onDblClick);
    });
  }

  _normalizeBadge(badge) {
    const stateObj = badge.entity ? this._hass?.states?.[badge.entity] : undefined;

    const icon = this._tpl(
      badge.icon,
      badge,
      stateObj?.attributes?.icon || "mdi:information-outline"
    );
    const iconColor = this._tpl(badge.color ?? badge.icon_color, badge, "#4b5563");

    const title = this._tpl(badge.title, badge, "");
    const subtitle = this._tpl(badge.subtitle, badge, "");

    const extraIcon = this._tpl(badge.badge ?? badge.extra_icon, badge, "");
    const extraIconColor = this._tpl(badge.badge_color ?? badge.extra_icon_color, badge, "#6b7280");

    return {
      entity: badge.entity || "",
      icon,
      iconColor,
      title: this._str(title),
      subtitle: this._str(subtitle),
      extraIcon,
      extraIconColor,
      tap_action: badge.tap_action ?? { action: "more-info" },
      double_tap_action: badge.double_tap_action ?? { action: "none" },
      hold_action: badge.hold_action ?? { action: "none" },
    };
  }

  _render(items) {
    if (!items.length) {
      return `<div style="padding:${this._config.padding}px;opacity:.65;">No badges to display</div>`;
    }

    const gap = Number(this._config.gap) || 10;
    const padding = Number(this._config.padding) || 10;

    const badgesHtml = items.map((item, index) => this._renderBadge(item, index)).join("");

    return `
      <style>
        .sg-wrap { --sg-size: ${Number(this._config.badge_size) || 50}px; --sg-badge-h: calc(var(--sg-size) - 16px); }
        .sg-wrap {
          display: grid;
          grid-template-columns: repeat(${items.length}, minmax(0, 1fr));
          gap: ${gap}px;
          align-items: center;
          padding: ${padding}px 8px;
        }
        .sg-item {
          min-width: 0;
          position: relative;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          overflow: visible;
          margin: 0 auto;
          cursor: pointer;
          transition: background-color .16s ease, transform .12s ease;
        }
        .sg-item:hover {
          background: var(--sg-hover-bg, transparent) !important;
        }
        .sg-circle {
          width: var(--sg-size);
          height: var(--sg-size);
          margin: 0 auto;
        }
        .sg-pill {
          min-width: var(--sg-size);
          width: max-content;
          max-width: 100%;
          height: var(--sg-badge-h);
          box-sizing: border-box;
          padding: 0 10px;
          justify-content: flex-start;
          border-radius: calc(var(--sg-badge-h) / 2);
        }
        .sg-icon-bg {
          width: var(--sg-badge-h);
          height: var(--sg-badge-h);
          border-radius: 9999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 auto;
        }
        .sg-icon {
          --mdc-icon-size: 22px;
        }
        .sg-pill > .sg-icon {
          flex: 0 0 auto;
          margin-left: 2px;
          margin-right: 2px;
        }
        .sg-text {
          min-width: 0;
          max-width: calc(100% - 22px);
          line-height: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .sg-title {
          font-weight: 700;
          font-size: 10px;
          line-height: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .sg-subtitle {
          font-size: 10px;
          line-height: 1;
          opacity: .85;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .sg-single {
          justify-content: center;
        }
        .sg-pill.sg-text-only {
          justify-content: center;
          padding: 0 10px;
        }
        .sg-extra {
          position: absolute;
          top: 2px;
          right: 2px;
          --mdc-icon-size: 11px;
          filter: drop-shadow(0 1px 1px rgba(0,0,0,.18));
        }
      </style>
      <div class="sg-wrap">${badgesHtml}</div>
    `;
  }

  _renderBadge(item, index) {
    const hasTitle = !!item.title;
    const hasSubtitle = !!item.subtitle;
    const isCircle = !!item.icon && !hasTitle && !hasSubtitle;

    const iconHtml = item.icon
      ? (isCircle
        ? `<span class="sg-icon-bg" style="background:${this._withAlpha(item.iconColor, 0.14)};">
             <ha-icon class="sg-icon" style="color:${item.iconColor}" icon="${this._esc(item.icon)}"></ha-icon>
           </span>`
        : `<ha-icon class="sg-icon" style="color:${item.iconColor}" icon="${this._esc(item.icon)}"></ha-icon>`)
      : "";

    const extraIconHtml = item.extraIcon
      ? `<ha-icon class="sg-extra" style="color:${item.extraIconColor}" icon="${this._esc(item.extraIcon)}"></ha-icon>`
      : "";

    const id = `sg-${index}`;

    if (isCircle) {
      return `
        <div class="sg-item sg-circle" data-sg-id="${id}" style="--sg-hover-bg:${this._withAlpha(item.iconColor, 0.22)};">
          ${iconHtml}
          ${extraIconHtml}
        </div>
      `;
    }

    const textHtml = hasTitle || hasSubtitle
      ? `<div class="sg-text ${hasTitle && hasSubtitle ? "" : "sg-single"}">
           ${hasTitle ? `<div class="sg-title">${this._esc(item.title)}</div>` : ""}
           ${hasSubtitle ? `<div class="sg-subtitle">${this._esc(item.subtitle)}</div>` : ""}
         </div>`
      : "";

    return `
      <div class="sg-item sg-pill ${item.icon ? "" : "sg-text-only"}" data-sg-id="${id}" style="background:${this._withAlpha(item.iconColor, 0.14)};--sg-hover-bg:${this._withAlpha(item.iconColor, 0.22)};">
        ${iconHtml}
        ${textHtml}
        ${extraIconHtml}
      </div>
    `;
  }


  _actionName(actionCfg, defaultAction) {
    if (!actionCfg) return defaultAction;
    if (typeof actionCfg === "string") return actionCfg;
    if (typeof actionCfg === "object" && actionCfg.action) return String(actionCfg.action);
    return defaultAction;
  }

  _runAction(item, actionCfg, defaultAction) {
    const action = this._actionName(actionCfg, defaultAction);
    if (action === "none" || action === "nothing") return;

    if (action === "more-info") {
      if (!item.entity) return;
      this.dispatchEvent(new CustomEvent("hass-more-info", {
        bubbles: true,
        composed: true,
        detail: { entityId: item.entity }
      }));
      return;
    }

    // unsupported custom actions for now: safely no-op
  }

  _wireActions(item) {
    const tapDelayMs = 220;
    let holdTimer = null;
    let holdFired = false;
    let tapTimer = null;

    return {
      onPointerDown: () => {
        holdFired = false;
        clearTimeout(holdTimer);
        holdTimer = setTimeout(() => {
          holdFired = true;
          this._runAction(item, item.hold_action, "none");
        }, 500);
      },
      onPointerUp: () => {
        clearTimeout(holdTimer);
      },
      onPointerLeave: () => {
        clearTimeout(holdTimer);
      },
      onClick: (ev) => {
        if (holdFired) {
          ev.preventDefault();
          return;
        }
        clearTimeout(tapTimer);
        tapTimer = setTimeout(() => {
          this._runAction(item, item.tap_action, "more-info");
        }, tapDelayMs);
      },
      onDblClick: (ev) => {
        ev.preventDefault();
        clearTimeout(tapTimer);
        this._runAction(item, item.double_tap_action, "none");
      },
    };
  }

  _tpl(value, badge, fallback = "") {
    if (value === undefined || value === null) return fallback;
    if (typeof value !== "string") return value;

    const t = value.trim();
    const hasMustache = t.includes("{{") && t.includes("}}");
    if (!hasMustache) return value;

    const hass = this._hass;
    const entity = badge?.entity;

    const states = (entityId) => {
      const id = entityId || entity;
      return id && hass?.states?.[id] ? hass.states[id].state : undefined;
    };

    const state_attr = (entityId, attr) => {
      const id = entityId || entity;
      return id && hass?.states?.[id] ? hass.states[id].attributes?.[attr] : undefined;
    };

    const is_state = (entityId, expected) => states(entityId) === expected;

    const renderExpr = (expr) => {
      const code = expr.trim();
      try {
        const fn = new Function(
          "hass",
          "entity",
          "badge",
          "config",
          "states",
          "state_attr",
          "is_state",
          `return (${code});`
        );
        const out = fn(hass, entity, badge, this._config, states, state_attr, is_state);
        return out ?? "";
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn("seagull-badges-card template error", e, code);
        return "";
      }
    };

    const onlyExpr = t.match(/^\{\{([\s\S]+)\}\}$/);
    if (onlyExpr) {
      const out = renderExpr(onlyExpr[1]);
      return out === "" ? fallback : out;
    }

    const out = value.replace(/\{\{([\s\S]*?)\}\}/g, (_m, expr) => {
      const v = renderExpr(expr);
      return v === undefined || v === null ? "" : String(v);
    });
    return out;
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
  description: "Badges card with mustache templates, visibility, colors and labels"
});
