const { api, sheets } = foundry.applications;
import { PC } from "../config.mjs";

export class ParsCrucisItemSheet extends api.HandlebarsApplicationMixin(
  sheets.ItemSheetV2
) {
  static DEFAULT_OPTIONS = {
    form: {
      submitOnChange: true,
    },
    position: {
      width: 600,
      height: 440,
    },
    tag: "form",
    window: {
      icon: "fa fa-magic",
    },
  };

  getTitle() {
    // Retorna apenas o nome do item, sem o tipo
    return this.document.name || "Novo Item";
  }

  async _prepareContext() {
    const context = {
      item: this.document,
      document: this.document,
      system: this.document.system,
      config: CONFIG.PC,
      tabs: this._prepareTabs("primary"),
    };

    return context;
  }

  async _preparePartContext(partId, context) {
    switch (partId) {
      case "description":
        context.tab = context.tabs[partId];
        break;
      default:
    }

    return context;
  }
}
