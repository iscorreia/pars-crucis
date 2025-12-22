/**
 * Form to configure persona origin, culture, attributes, favorables etc
 * @extends {ApplicationV2}
 */

const { api } = foundry.applications;
import { PC } from "../config.mjs";

export default class PersonaConfig extends api.HandlebarsApplicationMixin(
  api.DocumentSheetV2
) {
  static DEFAULT_OPTIONS = {
    form: {
      submitOnChange: true,
      // closeOnSubmit: true,
      handler: this.#handleChanges,
    },
    position: {
      width: 800,
      height: 440,
    },
    tag: "form",
    window: {
      icon: "fas fa-wrench",
      title: "PC.configPersona",
    },
  };

  /** @inheritdoc */
  static PARTS = {
    content: {
      template: "systems/pars-crucis/templates/apps/persona-config.hbs",
    },
  };

  async _prepareContext() {
    const options = this.options;
    const system = options.document.system;
    const context = { system: system, config: PC };

    return context;
  }

  static async #handleChanges(event, form, formData) {
    const actor = this.options.document;
    const upData = formData.object;

    await actor.update(upData);
  }
}
