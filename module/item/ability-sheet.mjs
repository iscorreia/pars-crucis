import { ParsCrucisItemSheet } from "./item-sheet.mjs";

export default class AbilitySheet extends ParsCrucisItemSheet {
  static DEFAULT_OPTIONS = {
    window: {
      icon: "fa fa-address-card",
    },
  };

  /** Defines where are the template PARTS */
  static PARTS = {
    header: {
      template: `systems/pars-crucis/templates/item/ability/header.hbs`,
    },
    tabs: {
      template: "templates/generic/tab-navigation.hbs",
    },
    description: {
      template: "systems/pars-crucis/templates/item/parts/description.hbs",
    },
  };

  static TABS = {
    primary: {
      initial: "description",
      tabs: [
        {
          id: "description",
          label: "Descrição",
        },
      ],
    },
  };
}
