/**
 * Form to pick item keywords
 * @extends {ApplicationV2}
 */

const { api } = foundry.applications;
import { PC } from "../config.mjs";

export default class KeywordPicker extends api.HandlebarsApplicationMixin(
  api.DocumentSheetV2
) {
  static DEFAULT_OPTIONS = {
    form: {
      submitOnChange: true,
      // closeOnSubmit: true,
      handler: this.#handleChanges,
    },
    position: {
      width: 340,
      height: 600,
    },
    tag: "form",
    window: {
      icon: "fa-regular fa-key-skeleton-left-right",
      title: "PC.keywordPicker",
    },
    actions: {
      addKeyword: this.addKeywordOnClick,
      cutKeyword: this.cutKeywordOnClick,
    },
  };

  /** @inheritdoc */
  static PARTS = {
    content: {
      template: "systems/pars-crucis/templates/apps/keyword-picker.hbs",
    },
  };

  async _prepareContext() {
    const options = this.options;
    const system = options.document.system;
    const context = { system: system, config: PC };
    return context;
  }

  static async #handleChanges(_event, _form, formData) {
    const item = this.options.document;
    const upData = formData.object;
    await item.update(upData);
  }

  static async addKeywordOnClick(_, target) {
    const item = this.options.document;
    const { keyword } = target.dataset;
    await item.update({ [`system.keywords.${keyword}`]: null });
  }

  static async cutKeywordOnClick(_, target) {
    const item = this.options.document;
    const { keyword } = target.dataset;
    await item.update({ [`system.keywords.-=${keyword}`]: null });
  }
}
