import { ParsCrucisItemSheet } from "./item-sheet.mjs";

export default class GearSheet extends ParsCrucisItemSheet {
  static DEFAULT_OPTIONS = {
    window: {
      icon: "fa-solid fa-address-card",
      contentClasses: ["item-sheet"],
    },
  };

  async _prepareContext() {
    const context = await super._prepareContext();

    context.tabs = this._prepareTabs("primary");

    return context;
  }

  /** @inheritdoc Defines where are the template PARTS */
  static PARTS = {
    header: {
      template: `systems/pars-crucis/templates/item/gear/header.hbs`,
    },
    tabs: {
      template: "templates/generic/tab-navigation.hbs",
      classes: ["pars-crucis-nav"],
    },
    description: {
      template: "systems/pars-crucis/templates/item/parts/description.hbs",
    },
    config: {
      template: "systems/pars-crucis/templates/item/gear/config.hbs",
      classes: ["pc-item-tab"],
    },
  };

  static TABS = {
    primary: {
      initial: "config",
      tabs: [
        { id: "description", label: "PC.description" },
        { id: "config", label: "PC.config" },
      ],
    },
  };

  async _preparePartContext(partId, context) {
    switch (partId) {
      case "description":
      case "config":
        context.tab = context.tabs[partId];
        break;
      default:
    }

    return context;
  }
}
