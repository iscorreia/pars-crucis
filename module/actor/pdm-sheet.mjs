import { ParsCrucisActorSheet } from "./actor-sheet.mjs";
import PDMConfig from "../apps/pdm-config.mjs";

export class PDMSheet extends ParsCrucisActorSheet {
  static DEFAULT_OPTIONS = foundry.utils.mergeObject(
    super.DEFAULT_OPTIONS,
    {
      actions: {
        configurePDM: this.configurePDM,
      },
    },
    { inplace: false },
  );

  /** @inheritdoc Defines where are the template PARTS */
  static PARTS = {
    header: {
      template: "systems/pars-crucis/templates/actor/pdm/header.hbs",
    },
    tabs: {
      // Foundry-provided generic template
      template: "templates/generic/tab-navigation.hbs",
      classes: ["pars-crucis-nav"],
    },
    skills: {
      template: "systems/pars-crucis/templates/actor/parts/skills.hbs",
    },
    abilities: {
      template: "systems/pars-crucis/templates/actor/parts/abilities.hbs",
      scrollable: [".abilities-list-block"],
    },
    gear: {
      template: "systems/pars-crucis/templates/actor/parts/gear.hbs",
      scrollable: [".item-list-block"],
    },
    passives: {
      template: "systems/pars-crucis/templates/actor/parts/passives.hbs",
      scrollable: [".passives-list-block"],
    },
    background: {
      template: "systems/pars-crucis/templates/actor/parts/background.hbs",
    },
  };

  _getHeaderControls() {
    let controls = super._getHeaderControls();
    if (this.actor.isOwner) {
      controls.unshift({
        label: "PC.configPDM",
        icon: "fas fa-wrench",
        action: "configurePDM",
      });
    }
    return controls;
  }

  static async configurePDM() {
    new PDMConfig({ document: this.actor })?.render(true);
  }
}
