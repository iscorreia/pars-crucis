import { ParsCrucisActorSheet } from "./actor-sheet.mjs";
import PersonaConfig from "../apps/persona-config.mjs";

export class PersonaSheet extends ParsCrucisActorSheet {
  static DEFAULT_OPTIONS = foundry.utils.mergeObject(
    super.DEFAULT_OPTIONS,
    {
      actions: {
        configurePersona: this.configurePersona,
      },
    },
    { inplace: false }
  );

  _getHeaderControls() {
    let controls = super._getHeaderControls();
    if (this.actor.isOwner) {
      controls.unshift({
        label: "PC.configPersona",
        icon: "fas fa-wrench",
        action: "configurePersona",
      });
    }
    return controls;
  }

  static async configurePersona() {
    new PersonaConfig({ document: this.actor })?.render(true);
  }
}
