/**
 * Form to pick action keywords
 * @extends {ApplicationV2}
 */

const { api } = foundry.applications;
import { PC } from "../config.mjs";

export default class ActionKeywordPicker extends api.HandlebarsApplicationMixin(
  api.DocumentSheetV2,
) {
  static DEFAULT_OPTIONS = {
    form: {
      submitOnChange: true,
      // closeOnSubmit: true,
      handler: this.#handleChanges,
    },
    position: {
      width: 340,
      height: 680,
    },
    tag: "form",
    window: {
      icon: "fa-regular fa-key-skeleton-left-right",
      title: "PC.keywordPicker",
    },
    actions: {
      addActionKeyword: this.addActionKeywordOnClick,
      cutActionKeyword: this.cutActionKeywordOnClick,
    },
  };

  /** @inheritdoc */
  static PARTS = {
    content: {
      template: "systems/pars-crucis/templates/apps/ac-keyword-picker.hbs",
    },
  };

  async _prepareContext() {
    const { options } = this;
    const { acId, document } = options;
    const { system } = document;
    const action = system.actions[acId];
    const context = { system: system, config: PC, action: action };
    return context;
  }

  static async #handleChanges(_event, _form, formData) {
    const item = this.options.document;
    const upData = formData.object;
    await item.update(upData);
  }

  static async addActionKeywordOnClick(_, target) {
    const { document, acId } = this.options;
    const item = document;
    const { keyword } = target.dataset;
    await item.update({ [`system.actions.${acId}.keywords.${keyword}`]: null });
  }

  static async cutActionKeywordOnClick(_, target) {
    const { document, acId } = this.options;
    const item = document;
    const { keyword } = target.dataset;
    await item.update({
      [`system.actions.${acId}.keywords.-=${keyword}`]: null,
    });
  }
}
