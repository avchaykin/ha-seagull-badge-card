class SeagullBadgesCard extends HTMLElement {
  static getStubConfig() {
    return {
      type: "custom:seagull-badges-card",
      badges: [
        {
          entity: "sensor.phone_battery",
          show: "{{ true }}",
          icon_template: "battery",
          color_template: "royg",
          title: "Phone",
          subtitle: "{{ states(entity) + '%' }}",
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
      padding_y: config.padding_y ?? config.padding ?? 4,
      badge_size: config.badge_size ?? 50,
      debug: config.debug ?? false,
      show_all: config.show_all ?? false,
      placeholder_text: config.placeholder_text ?? "No badges to display",
      palette: config.palette ?? {},
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
      .filter((badge) => this._isBadgeVisible(badge))
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

  _isEditMode() {
    try {
      if (this._hass?.editMode === true) return true;
      const url = new URL(window.location.href);
      if (url.searchParams.get("edit") === "1") return true;
      if (url.pathname.includes("/config/dashboard")) return true;
      return document?.body?.classList?.contains("edit-mode") || false;
    } catch (_e) {
      return false;
    }
  }

  _isBadgeVisible(badge) {
    if (this._config?.show_all && this._isEditMode()) return true;

    const showOk = this._toBool(this._tpl(badge.show, badge, true), true);
    if (!showOk) return false;

    const state = this._hass?.states?.[badge.entity]?.state;

    const has = (k) => badge[k] !== undefined && badge[k] !== null;
    const eq = (a, b) => String(a) === String(b);
    const toArr = (v) => {
      if (Array.isArray(v)) return v;
      if (typeof v === "string") {
        const t = v.trim();
        if (t.startsWith("[") && t.endsWith("]")) {
          try {
            const parsed = JSON.parse(t);
            if (Array.isArray(parsed)) return parsed;
          } catch (_e) {
            // ignore
          }
        }
        return [v];
      }
      return [v];
    };

    if (has("show_value")) {
      const showValue = this._tpl(badge.show_value, badge, undefined);
      if (!eq(state, showValue)) return false;
    }

    if (has("show_not_value")) {
      const showNotValue = this._tpl(badge.show_not_value, badge, undefined);
      if (eq(state, showNotValue)) return false;
    }

    if (has("show_in")) {
      const showIn = this._tpl(badge.show_in, badge, undefined);
      const arr = toArr(showIn).map((v) => String(v));
      if (!arr.includes(String(state))) return false;
    }

    if (has("show_not_in")) {
      const showNotIn = this._tpl(badge.show_not_in, badge, undefined);
      const arr = toArr(showNotIn).map((v) => String(v));
      if (arr.includes(String(state))) return false;
    }

    if (has("show_below")) {
      const showBelow = this._tpl(badge.show_below, badge, undefined);
      const nState = Number(state);
      const nBelow = Number(showBelow);
      if (Number.isNaN(nState) || Number.isNaN(nBelow) || !(nState < nBelow)) return false;
    }

    if (has("show_above")) {
      const showAbove = this._tpl(badge.show_above, badge, undefined);
      const nState = Number(state);
      const nAbove = Number(showAbove);
      if (Number.isNaN(nState) || Number.isNaN(nAbove) || !(nState > nAbove)) return false;
    }

    return true;
  }

  _normalizeBadge(badge) {
    const stateObj = badge.entity ? this._hass?.states?.[badge.entity] : undefined;

    const iconFallback = stateObj?.attributes?.icon || "mdi:information-outline";
    const icon = this._resolveNamedTemplate(
      "icon",
      badge.icon_template,
      badge,
      this._tpl(badge.icon, badge, iconFallback)
    );
    const iconColor = this._normalizeColor(this._resolveNamedTemplate(
      "color",
      badge.color_template,
      badge,
      this._tpl(badge.color ?? badge.icon_color, badge, "#4b5563")
    ), badge);

    const title = this._tpl(badge.title, badge, "");
    const subtitle = this._tpl(badge.subtitle, badge, "");

    const subIcon = this._resolveNamedTemplate(
      "icon",
      badge.sub_icon_template,
      badge,
      this._tpl(badge.sub_icon, badge, "")
    );
    const subIconColor = this._normalizeColor(this._resolveNamedTemplate(
      "color",
      badge.sub_icon_color_template,
      badge,
      this._tpl(badge.sub_icon_color, badge, iconColor || "#6b7280")
    ), badge);
    const subIconSize = Number(this._tpl(badge.sub_icon_size, badge, 0.5));
    const subIconBg = this._toBool(this._tpl(badge.sub_icon_bg, badge, true), true);

    const extraIcon = this._tpl(badge.badge ?? badge.extra_icon, badge, "");
    const extraIconColor = this._normalizeColor(this._tpl(badge.badge_color ?? badge.extra_icon_color, badge, "#6b7280"), badge);

    this._debug("badge:normalize", {
      entity: badge.entity,
      icon,
      iconColor,
      iconTemplate: badge.icon_template,
      colorTemplate: badge.color_template,
    });

    return {
      entity: badge.entity || "",
      icon,
      iconColor,
      title: this._str(title),
      subtitle: this._str(subtitle),
      subIcon,
      subIconColor,
      subIconSize,
      subIconBg,
      extraIcon,
      extraIconColor,
      tap_action: badge.tap_action ?? { action: "more-info" },
      double_tap_action: badge.double_tap_action ?? { action: "none" },
      hold_action: badge.hold_action ?? { action: "none" },
    };
  }

  _render(items) {
    if (!items.length) {
      const placeholder = this._str(this._config.placeholder_text ?? "");
      if (!placeholder) return "";
      return `<div style="padding:${this._config.padding}px;opacity:.65;">${this._esc(placeholder)}</div>`;
    }

    const gap = Number(this._config.gap) || 10;
    const padding = Number(this._config.padding) || 10;
    const paddingY = Number(this._config.padding_y);
    const effectivePaddingY = Number.isFinite(paddingY) ? paddingY : padding;

    const badgesHtml = items.map((item, index) => this._renderBadge(item, index)).join("");
    const debugHtml = this._config.debug
      ? `<pre class="sg-debug">${this._esc((this._debugLines || []).join("\n"))}</pre>`
      : "";

    return `
      <style>
        .sg-wrap { --sg-size: ${Number(this._config.badge_size) || 50}px; --sg-badge-h: calc(var(--sg-size) - 16px); }
        .sg-wrap {
          display: grid;
          grid-template-columns: repeat(${items.length}, minmax(0, 1fr));
          gap: ${gap}px;
          align-items: center;
          min-height: var(--sg-size);
          padding: ${effectivePaddingY}px 8px;
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
          padding: 0 14px 0 8px;
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
          margin-left: 0;
          margin-right: 6px;
        }
        .sg-sub-icon-bg {
          width: calc(var(--sg-size) * var(--sg-sub-icon-size, 0.5));
          height: calc(var(--sg-size) * var(--sg-sub-icon-size, 0.5));
          border-radius: 9999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 auto;
          margin-right: 3px;
        }
        .sg-sub-icon {
          --mdc-icon-size: calc(var(--sg-size) * var(--sg-sub-icon-size, 0.5) * 0.7);
        }
        .sg-sub-icon-no-bg {
          margin-right: 3px;
        }
        .sg-text {
          min-width: 0;
          max-width: calc(100% - 18px);
          padding-right: 2px;
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
        .sg-single-line .sg-title,
        .sg-single-line .sg-subtitle {
          font-size: 12px;
          line-height: 1;
          opacity: 1;
          font-weight: 700;
        }
        .sg-single {
          justify-content: center;
        }
        .sg-pill.sg-text-only {
          justify-content: center;
          padding: 0 14px;
        }
        .sg-pill.sg-no-text-icons {
          padding-right: 8px;
        }
        .sg-extra {
          position: absolute;
          top: 2px;
          right: 2px;
          --mdc-icon-size: 11px;
          filter: drop-shadow(0 1px 1px rgba(0,0,0,.18));
        }
        .sg-debug {
          margin: 8px;
          padding: 8px;
          border-radius: 8px;
          background: rgba(15, 23, 42, 0.08);
          font-size: 10px;
          line-height: 1.3;
          white-space: pre-wrap;
          word-break: break-word;
          max-height: 180px;
          overflow: auto;
        }
      </style>
      <div class="sg-wrap">${badgesHtml}</div>
      ${debugHtml}
    `;
  }

  _renderBadge(item, index) {
    const hasTitle = !!item.title;
    const hasSubtitle = !!item.subtitle;
    const hasSubIcon = !!item.subIcon;
    const isCircle = !!item.icon && !hasTitle && !hasSubtitle && !hasSubIcon;

    const iconHtml = item.icon
      ? (isCircle
        ? `<span class="sg-icon-bg" style="background:${this._withAlpha(item.iconColor, 0.14)};">
             <ha-icon class="sg-icon" style="color:${item.iconColor}" icon="${this._esc(item.icon)}"></ha-icon>
           </span>`
        : `<ha-icon class="sg-icon" style="color:${item.iconColor}" icon="${this._esc(item.icon)}"></ha-icon>`)
      : "";

    const subIconHtml = item.subIcon
      ? (item.subIconBg
        ? `<span class="sg-sub-icon-bg" style="background:${this._withAlpha(item.subIconColor, 0.14)}; --sg-sub-icon-size:${item.subIconSize};">
             <ha-icon class="sg-sub-icon" style="color:${item.subIconColor}" icon="${this._esc(item.subIcon)}"></ha-icon>
           </span>`
        : `<ha-icon class="sg-sub-icon sg-sub-icon-no-bg" style="color:${item.subIconColor}; --sg-sub-icon-size:${item.subIconSize};" icon="${this._esc(item.subIcon)}"></ha-icon>`)
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

    const singleLine = (hasTitle && !hasSubtitle) || (!hasTitle && hasSubtitle);

    const hasText = hasTitle || hasSubtitle;

    const textHtml = hasText
      ? `<div class="sg-text ${hasTitle && hasSubtitle ? "" : "sg-single"} ${singleLine ? "sg-single-line" : ""}" style="color:${item.iconColor};">
           ${hasTitle ? `<div class="sg-title">${this._esc(item.title)}</div>` : ""}
           ${hasSubtitle ? `<div class="sg-subtitle">${this._esc(item.subtitle)}</div>` : ""}
         </div>`
      : "";

    const pillClasses = ["sg-item", "sg-pill", item.icon ? "" : "sg-text-only", (!hasText && item.icon && item.subIcon) ? "sg-no-text-icons" : ""]
      .filter(Boolean)
      .join(" ");

    return `
      <div class="${pillClasses}" data-sg-id="${id}" style="background:${this._withAlpha(item.iconColor, 0.14)};--sg-hover-bg:${this._withAlpha(item.iconColor, 0.22)};">
        ${iconHtml}
        ${subIconHtml}
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

  _parseNamedTemplateSpec(spec) {
    if (!spec) return null;
    if (typeof spec === "string") return { name: spec.trim(), param: undefined, scale: undefined, offset: undefined };
    if (Array.isArray(spec)) {
      return {
        name: String(spec[0] ?? "").trim(),
        param: spec[1],
        scale: spec[2],
        offset: spec[3],
      };
    }
    if (typeof spec === "object") {
      return {
        name: String(spec.name ?? spec.template ?? "").trim(),
        param: spec.param ?? spec.value,
        scale: spec.scale,
        offset: spec.offset,
      };
    }
    return null;
  }

  _builtinTemplates(kind) {
    if (kind === "icon") {
      return {
        battery: "{{ Number(value) <= 5 ? 'mdi:battery-alert-variant-outline' : Number(value) <= 15 ? 'mdi:battery-10' : Number(value) <= 25 ? 'mdi:battery-20' : Number(value) <= 35 ? 'mdi:battery-30' : Number(value) <= 45 ? 'mdi:battery-40' : Number(value) <= 55 ? 'mdi:battery-50' : Number(value) <= 65 ? 'mdi:battery-60' : Number(value) <= 75 ? 'mdi:battery-70' : Number(value) <= 85 ? 'mdi:battery-80' : Number(value) <= 95 ? 'mdi:battery-90' : 'mdi:battery' }}",
        'battery-charging': "{{ Number(value) <= 10 ? 'mdi:battery-charging-10' : Number(value) <= 20 ? 'mdi:battery-charging-20' : Number(value) <= 30 ? 'mdi:battery-charging-30' : Number(value) <= 40 ? 'mdi:battery-charging-40' : Number(value) <= 50 ? 'mdi:battery-charging-50' : Number(value) <= 60 ? 'mdi:battery-charging-60' : Number(value) <= 70 ? 'mdi:battery-charging-70' : Number(value) <= 80 ? 'mdi:battery-charging-80' : Number(value) <= 90 ? 'mdi:battery-charging-90' : Number(value) <= 95 ? 'mdi:battery-charging-100' : 'mdi:battery-charging' }}",
        light: "{{ ['on','playing','home','open'].includes(String(value).toLowerCase()) ? 'mdi:lightbulb-on' : 'mdi:lightbulb' }}",
        lock: "{{ ['locked','lock','on'].includes(String(value).toLowerCase()) ? 'mdi:lock' : 'mdi:lock-open-variant' }}",
        door: "{{ ['open','on','opening'].includes(String(value).toLowerCase()) ? 'mdi:door-open' : 'mdi:door-closed' }}",
        window: "{{ ['open','on','opening'].includes(String(value).toLowerCase()) ? 'mdi:window-open' : 'mdi:window-closed' }}",
        leak: "{{ ['on','wet','leak','detected','problem'].includes(String(value).toLowerCase()) ? 'mdi:water-alert' : 'mdi:water-check' }}",
        media: "{{ String(value).toLowerCase() === 'playing' ? 'mdi:play' : String(value).toLowerCase() === 'paused' ? 'mdi:pause' : String(value).toLowerCase() === 'stopped' ? 'mdi:stop' : 'mdi:play-outline' }}",
        'media-circle': "{{ String(value).toLowerCase() === 'playing' ? 'mdi:play-circle' : String(value).toLowerCase() === 'paused' ? 'mdi:pause-circle' : String(value).toLowerCase() === 'stopped' ? 'mdi:stop-circle' : 'mdi:play-circle-outline' }}",
        volume: "{{ (Number(value) <= 1 ? Number(value) * 100 : Number(value)) <= 0 ? 'mdi:volume-off' : (Number(value) <= 1 ? Number(value) * 100 : Number(value)) <= 33 ? 'mdi:volume-low' : (Number(value) <= 1 ? Number(value) * 100 : Number(value)) <= 66 ? 'mdi:volume-medium' : 'mdi:volume-high' }}",
      };
    }

    if (kind === "color") {
      return {
        roygbiv: "{{ Number(value) < 15 ? '#ef4444' : Number(value) < 30 ? '#f97316' : Number(value) < 45 ? '#eab308' : Number(value) < 60 ? '#22c55e' : Number(value) < 75 ? '#3b82f6' : Number(value) < 90 ? '#6366f1' : '#a855f7' }}",
        iroygbiv: "{{ Number(value) < 15 ? '#a855f7' : Number(value) < 30 ? '#6366f1' : Number(value) < 45 ? '#3b82f6' : Number(value) < 60 ? '#22c55e' : Number(value) < 75 ? '#eab308' : Number(value) < 90 ? '#f97316' : '#ef4444' }}",
        royg: "{{ Number(value) < 35 ? '#ef4444' : Number(value) < 70 ? '#eab308' : '#22c55e' }}",
        iroyg: "{{ Number(value) < 35 ? '#22c55e' : Number(value) < 70 ? '#eab308' : '#ef4444' }}",
        on_off: "{{ ['on','open','playing','locked'].includes(String(value).toLowerCase()) ? 'var(--state-icon-active-color, #f59e0b)' : 'var(--state-icon-color, #6b7280)' }}",
      };
    }

    return {};
  }

  _resolveNamedTemplate(kind, templateSpec, badge, fallback = "") {
    const spec = this._parseNamedTemplateSpec(templateSpec);
    if (!spec?.name) {
      this._debug("template:skip", { kind, reason: "no_spec_name", templateSpec, entity: badge?.entity });
      return fallback;
    }

    const templates = {
      ...this._builtinTemplates(kind),
      ...(this._config?.[`${kind}_templates`] || {}),
    };

    const normalizeKey = (s) => String(s ?? "")
      .normalize("NFKC")
      .replace(/\s+/g, "")
      .toLowerCase();

    let templateCode = templates[spec.name];
    let matchedTemplateName = spec.name;

    if (templateCode === undefined || templateCode === null) {
      const wanted = normalizeKey(spec.name);
      const fuzzy = Object.entries(templates).find(([k]) => normalizeKey(k) === wanted);
      if (fuzzy) {
        matchedTemplateName = fuzzy[0];
        templateCode = fuzzy[1];
      }
    }

    if (templateCode === undefined || templateCode === null) {
      this._debug("template:skip", {
        kind,
        reason: "template_not_found",
        templateName: spec.name,
        knownTemplates: Object.keys(templates || {}),
        entity: badge?.entity,
      });
      return fallback;
    }

    const defaultParam = badge?.entity && this._hass?.states?.[badge.entity]
      ? this._hass.states[badge.entity].state
      : undefined;
    const rawParamValue = spec.param === undefined
      ? defaultParam
      : this._tpl(spec.param, badge, defaultParam);

    const rawScale = spec.scale === undefined ? undefined : this._tpl(spec.scale, badge, undefined);
    const rawOffset = spec.offset === undefined ? undefined : this._tpl(spec.offset, badge, undefined);

    const hasScale = rawScale !== undefined && rawScale !== null && rawScale !== "";
    const hasOffset = rawOffset !== undefined && rawOffset !== null && rawOffset !== "";

    let paramValue = rawParamValue;
    if (hasScale || hasOffset) {
      const nValue = Number(rawParamValue);
      const nOffset = hasOffset ? Number(rawOffset) : 0;
      const nScale = hasScale ? Number(rawScale) : 100;
      const span = nScale - nOffset;

      if (!Number.isNaN(nValue) && !Number.isNaN(nOffset) && !Number.isNaN(nScale) && span !== 0) {
        paramValue = ((nValue - nOffset) / span) * 100;
      }
    }

    const resolved = this._tpl(templateCode, badge, fallback, { value: paramValue, template_name: matchedTemplateName });
    const out = typeof resolved === "string" ? resolved.trim() : resolved;

    this._debug("template:resolved", {
      kind,
      templateName: spec.name,
      matchedTemplateName,
      entity: badge?.entity,
      rawParamValue,
      paramValue,
      scale: rawScale,
      offset: rawOffset,
      resolved: out,
      fallback,
    });

    return out;
  }

  _evalExpr(expr, badge, extraCtx = {}) {
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

    const code = String(expr)
      .trim()
      .replace(/\bnone\b/gi, "null")
      .replace(/\btrue\b/gi, "true")
      .replace(/\bfalse\b/gi, "false")
      .replace(/\band\b/gi, "&&")
      .replace(/\bor\b/gi, "||")
      .replace(/\bnot\b/gi, "!");

    try {
      const fn = new Function(
        "hass",
        "entity",
        "badge",
        "config",
        "states",
        "state_attr",
        "is_state",
        "value",
        "template_name",
        "icon_templates",
        "color_templates",
        `return (${code});`
      );
      const out = fn(
        hass,
        entity,
        badge,
        this._config,
        states,
        state_attr,
        is_state,
        extraCtx.value,
        extraCtx.template_name,
        this._config?.icon_templates,
        this._config?.color_templates
      );
      return out ?? "";
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn("seagull-badges-card template error", e, code);
      return "";
    }
  }

  _tplJinja(template, badge, fallback = "", extraCtx = {}) {
    const tokens = String(template).split(/(\{\%[\s\S]*?\%\}|\{\{[\s\S]*?\}\})/g).filter(Boolean);
    const stack = [];

    const active = () => stack.every((f) => f.active);
    let out = "";

    for (const token of tokens) {
      if (token.startsWith("{{") && token.endsWith("}}")) {
        if (!active()) continue;
        const expr = token.slice(2, -2);
        const v = this._evalExpr(expr, badge, extraCtx);
        out += (v === undefined || v === null) ? "" : String(v);
        continue;
      }

      if (token.startsWith("{%") && token.endsWith("%}")) {
        const raw = token.slice(2, -2).trim();

        if (raw.startsWith("if ")) {
          const parentActive = active();
          const matched = parentActive && this._toBool(this._evalExpr(raw.slice(3), badge, extraCtx), false);
          stack.push({ parentActive, matched, active: matched });
          continue;
        }

        if (raw.startsWith("elif ")) {
          const top = stack[stack.length - 1];
          if (!top) continue;
          if (top.matched) {
            top.active = false;
          } else {
            const ok = top.parentActive && this._toBool(this._evalExpr(raw.slice(5), badge, extraCtx), false);
            top.active = ok;
            if (ok) top.matched = true;
          }
          continue;
        }

        if (raw === "else") {
          const top = stack[stack.length - 1];
          if (!top) continue;
          top.active = top.parentActive && !top.matched;
          top.matched = true;
          continue;
        }

        if (raw === "endif") {
          stack.pop();
          continue;
        }

        continue;
      }

      if (active()) out += token;
    }

    const normalized = out.trim();
    return normalized === "" ? fallback : normalized;
  }

  _tpl(value, badge, fallback = "", extraCtx = {}) {
    if (value === undefined || value === null) return fallback;
    if (typeof value !== "string") return value;

    const t = value.trim();
    const hasJinjaBlocks = t.includes("{%") && t.includes("%}");
    const hasMustache = t.includes("{{") && t.includes("}}");

    if (hasJinjaBlocks) {
      return this._tplJinja(value, badge, fallback, extraCtx);
    }

    if (!hasMustache) return value;

    const onlyExpr = t.match(/^\{\{([\s\S]+)\}\}$/);
    if (onlyExpr) {
      const out = this._evalExpr(onlyExpr[1], badge, extraCtx);
      return out === "" ? fallback : out;
    }

    const out = value.replace(/\{\{([\s\S]*?)\}\}/g, (_m, expr) => {
      const v = this._evalExpr(expr, badge, extraCtx);
      return v === undefined || v === null ? "" : String(v);
    });
    return out;
  }

  _debug(event, payload = {}) {
    if (!this._config?.debug) return;
    this._debugLines = this._debugLines || [];
    const line = `${event} ${JSON.stringify(payload)}`;
    this._debugLines.push(line);
    if (this._debugLines.length > 20) this._debugLines.shift();
    // eslint-disable-next-line no-console
    console.info("[seagull-badges-card]", event, payload);
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

  _normalizeColor(color, badge, _depth = 0) {
    if (color === undefined || color === null) return color;
    if (typeof color !== "string") return color;

    const raw = color.trim();
    const key = raw.toLowerCase();

    const palette = this._config?.palette || {};
    if (_depth < 4 && Object.prototype.hasOwnProperty.call(palette, raw)) {
      const paletteValue = this._tpl(palette[raw], badge, raw);
      return this._normalizeColor(paletteValue, badge, _depth + 1);
    }

    const map = {
      primary: "var(--primary-color)",
      secondary: "var(--secondary-text-color)",
      disabled: "var(--disabled-text-color)",
      active: "var(--state-icon-active-color, var(--primary-color))",
      inactive: "var(--state-icon-color, var(--secondary-text-color))",
    };

    return map[key] || raw;
  }

  _withAlpha(color, alpha) {
    const normalized = this._normalizeColor(color);
    if (!normalized) return `rgba(75,85,99,${alpha})`;
    if (normalized.startsWith("#") && (normalized.length === 7 || normalized.length === 4)) {
      const hex = normalized.length === 4
        ? `#${normalized[1]}${normalized[1]}${normalized[2]}${normalized[2]}${normalized[3]}${normalized[3]}`
        : normalized;
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    return `color-mix(in srgb, ${normalized} ${Math.round(alpha * 100)}%, transparent)`;
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
