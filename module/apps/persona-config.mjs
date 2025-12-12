/**
 * Form to configure persona origin, culture, attributes, favorables etc
 * @extends {ApplicationV2}
 */

const { api } = foundry.applications;
import { PC } from "../config.mjs";

export default class PersonaConfig extends api.HandlebarsApplicationMixin(
  api.ApplicationV2
) {
  static DEFAULT_OPTIONS = {
    form: {
      submitOnChange: true,
      // closeOnSubmit: true,
      handler: this.#handleChanges,
    },
    position: {
      width: 800,
      height: 500,
    },
    tag: "form",
    action: {},
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
    const system = options.actor.system;
    const context = { system: system, config: PC };

    return context;
  }

  static async #handleChanges(event, form, formData) {
    const actor = this.options.actor;
    const upData = formData.object;

    await actor.update(upData);
  }
}
