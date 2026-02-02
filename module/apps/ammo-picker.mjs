/**
 * Form to pick actions for techntiques
 * @extends {ApplicationV2}
 */

const { api } = foundry.applications;

export default class AmmoPicker extends api.HandlebarsApplicationMixin(
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
      title: "PC.ammoPicker",
    },
    actions: {
      selectAmmo: this.selectAmmo,
    },
  };

  /** @inheritdoc */
  static PARTS = {
    content: {
      template: "systems/pars-crucis/templates/apps/ammo-picker.hbs",
    },
  };

  async _prepareContext() {
    const { options } = this;
    const { choices, document, itemId } = options;
    const { system } = document;
    const item = document.items.get(itemId);
    const context = {
      choices: choices,
      system: system,
      item: item,
    };
    return context;
  }

  static async selectAmmo(_, target) {
    const { options } = this;
    const { document, itemId } = options;
    const item = document.items.get(itemId);
    await item.update({ [`system.ammo._ammoId`]: target.dataset.ammoId });
    this.close();
  }
}
