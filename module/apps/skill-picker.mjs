/**
 * Form to pick skills
 * @extends {ApplicationV2}
 */

const { api } = foundry.applications;
import { PC } from "../config.mjs";

export default class SkillPicker extends api.HandlebarsApplicationMixin(
  api.DocumentSheetV2,
) {
  static DEFAULT_OPTIONS = {
    form: {
      submitOnChange: true,
      // closeOnSubmit: true,
      handler: this.#handleChanges,
    },
    position: {
      width: 800,
      height: 300,
    },
    tag: "form",
    window: {
      icon: "fa-regular fa-key-skeleton-left-right",
      title: "PC.keywordPicker",
    },
    actions: {
      addSkill: this.addSkillOnClick,
      cutSkill: this.cutSkillOnClick,
    },
  };

  /** @inheritdoc */
  static PARTS = {
    content: {
      template: "systems/pars-crucis/templates/apps/skill-picker.hbs",
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

  static async addSkillOnClick(_, target) {
    const { document, acId } = this.options;
    const { skill } = target.dataset;
    const item = document;
    await item.update({ [`system.actions.${acId}.skills.${skill}`]: 0 });
  }

  static async cutSkillOnClick(_, target) {
    const { document, acId } = this.options;
    const { skill } = target.dataset;
    const item = document;
    await item.update({ [`system.actions.${acId}.skills.-=${skill}`]: null });
  }
}
