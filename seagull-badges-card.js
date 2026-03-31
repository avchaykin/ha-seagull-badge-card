class SeagullBadgesCard extends HTMLElement {
  static getStubConfig() {
    return {
      type: "custom:seagull-badges-card",
      title: "Seagull Badges",
      badges: [
        { label: "Online", color: "#1db954" },
        { label: "Test", color: "#3b82f6" }
      ]
    };
  }

  setConfig(config) {
    this._config = {
      title: "Seagull Badges",
      badges: [],
      ...config,
    };

    if (!Array.isArray(this._config.badges)) {
      throw new Error("badges must be an array");
    }
  }

  set hass(_hass) {
    if (!this._card) {
      this._card = document.createElement("ha-card");
      this._card.style.padding = "14px";
      this.appendChild(this._card);
    }

    const title = this._config.title ?? "Seagull Badges";
    const badges = this._config.badges ?? [];

    const items = badges
      .map((b) => {
        const label = b?.label ?? "Badge";
        const color = b?.color ?? "var(--primary-color)";
        return `<span style="background:${color};color:white;padding:4px 10px;border-radius:999px;font-size:12px;font-weight:600;">${label}</span>`;
      })
      .join(" ");

    this._card.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:10px;">
        <div style="font-size:16px;font-weight:600;">${title}</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;">${items || '<span style="opacity:.65">No badges configured</span>'}</div>
      </div>
    `;
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
  description: "Badge-style custom card for Home Assistant"
});
