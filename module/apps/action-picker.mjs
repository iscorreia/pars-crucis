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
    window: {
      icon: "fa-regular fa-key-skeleton-left-right",
      title: "PC.actionPicker",
    },
    actions: {
      selectAction: this.selectAction,
    },
  };

  /** @inheritdoc */
  static PARTS = {
    content: {
      template: "systems/pars-crucis/templates/apps/action-picker.hbs",
    },
  };

  async _prepareContext() {
    const { options } = this;
    const { acId, choices, document, itemId } = options;
    const { system } = document;
    const item = document.items.get(itemId);
    const tech = item.system.actions[acId];
    const context = {
      choices: choices,
      system: system,
      item: item,
      tech: tech,
    };
    return context;
  }

  static async selectAction(_, target) {
    const { options } = this;
    const { acId, document, itemId } = options;
    const { gearAcId, gearId } = target.dataset;
    const item = document.items.get(itemId);
    await item.update({
      [`system.actions.${acId}._gearAcId`]: gearAcId,
      [`system.actions.${acId}._gearId`]: gearId,
    });
    this.close(); // closes de app window after action select
  }
}
