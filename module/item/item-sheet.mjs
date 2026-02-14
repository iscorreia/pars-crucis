const { api, sheets } = foundry.applications;
import ActionKeywordPicker from "../apps/ac-keyword-picker.mjs";
import KeywordPicker from "../apps/keyword-picker.mjs";
import SetDamage from "../apps/set-damage.mjs";
import SkillPicker from "../apps/skill-picker.mjs";

// Defining default information for created actions based on its type
const ACTION_DEFAULTS = {
  attack: { damaging: true, range: "0", damage: { dmgBase: 3 } },
  tech: { damaging: true },
  test: { skill: "atlet" },
};

//This is the basic class for Pars Crucis Items and should be extended
export class ParsCrucisItemSheet extends api.HandlebarsApplicationMixin(
  sheets.ItemSheetV2,
) {
  static DEFAULT_OPTIONS = {
    form: {
      submitOnChange: true,
    },
    position: {
      width: 560,
      height: 600,
    },
    tag: "form",
    window: {
      icon: "fa-solid fa-magic",
    },
    actions: {
      keywordPicker: this.keywordPicker,
      actionKeywordPicker: this.actionKeywordPicker,
      cutKeyword: this.cutKeywordOnClick,
      cutActionKeyword: this.cutActionKeywordOnClick,
      actionSkillPicker: this.actionSkillPicker,
      createAction: this.createActionOnClick,
      deleteAction: this.deleteActionOnClick,
      setDamage: this.setDamageOnClick,
    },
  };

  get title() {
    return this.document.name || "Item";
  }

  async _prepareContext() {
    const document = this.document;
    const system = document.system;
    const PC = CONFIG.PC;

    /** Create a translated group key for @selectOptions */
    for (let [_, sk] of Object.entries(PC.skills)) {
      sk.group = game.i18n.localize(`PC.categories.${[sk.cat]}`);
    }
    const context = {
      item: document,
      document: document,
      system: system,
      systemFields: system.schema.fields,
      config: CONFIG.PC,
    };

    return context;
  }

  static async actionSkillPicker(_, target) {
    const { acId } = target.dataset;
    new SkillPicker({ document: this.item, acId: acId })?.render(true);
  }

  static async keywordPicker() {
    new KeywordPicker({ document: this.item })?.render(true);
  }

  static async actionKeywordPicker(_, target) {
    const { acId } = target.dataset;
    new ActionKeywordPicker({ document: this.item, acId: acId })?.render(true);
  }

  static async cutKeywordOnClick(_, target) {
    const item = this.document;
    const keywordKey = target.dataset.keyword;
    item.update({ [`system.keywords.-=${keywordKey}`]: null });
  }

  static async cutActionKeywordOnClick(_, target) {
    const item = this.document;
    const { acId } = target.dataset;
    const keywordKey = target.dataset.keyword;
    item.update({ [`system.actions.${acId}.keywords.-=${keywordKey}`]: null });
  }

  static async createActionOnClick(_, target) {
    const item = this.document;
    const acType = target.dataset.acType;
    const acId = foundry.utils.randomID();
    const newAction = {
      img: item.img,
      name: game.i18n.localize(`PC.${acType}`),
      type: acType,
      _id: acId,
      ...(ACTION_DEFAULTS[acType] ?? {}),
    };

    await item.update({
      [`system.actions.${acId}`]: newAction,
    });
  }

  // Deletes an Item Action from the actions collections
  static async deleteActionOnClick(_, target) {
    const { acId } = target.dataset;
    const item = this.document;
    item.update({ [`system.actions.-=${acId}`]: null });
  }

  static async setDamageOnClick(_, target) {
    const { acId } = target.dataset;
    new SetDamage({ document: this.item, acId: acId })?.render(true);
  }
}
