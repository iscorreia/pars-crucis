/**
 * Form to pick actions for techntiques
 * @extends {ApplicationV2}
 */

const { api } = foundry.applications;

export default class ActionPicker extends api.HandlebarsApplicationMixin(
  api.DocumentSheetV2,
) {
  static DEFAULT_OPTIONS = {
    form: {
      submitOnChange: true,
    },
    position: {
      width: 800,
    },
    tag: "form",
    windows: {
      icon: "fa-regular fa-key-skeleton-left-right",
      title: "PC.actionPicker",
    },
    actions: {},
  };

  /** @inheritdoc */
  static PARTS = {
    content: {
      template: "systems/pars-crucis/templates/apps/action-picker.hbs",
    },
  };

  async _prepareContext() {
    console.log(this);
    const options = this.options;
    const system = options.document.system;
    const choices = options.choices;
    const context = { system: system, choices: choices };
    return context;
  }
}
