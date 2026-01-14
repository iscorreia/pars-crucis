const { api, sheets } = foundry.applications;
import ActionKeywordPicker from "../apps/ac-keyword-picker.mjs";
import KeywordPicker from "../apps/keyword-picker.mjs";
import { PC } from "../config.mjs";

//This is the basic class for Pars Crucis Items and should be extended
export class ParsCrucisItemSheet extends api.HandlebarsApplicationMixin(
  sheets.ItemSheetV2
) {
  static DEFAULT_OPTIONS = {
    form: {
      submitOnChange: true,
    },
    position: {
      width: 500,
      height: 540,
    },
    tag: "form",
    window: {
      icon: "fa-solid fa-magic",
    },
    actions: {
      keywordPicker: this.keywordPicker,
      actionKeywordPicker: this.actionKeywordPicker,
      addDmgAttribute: this.addDmgAttributeOnClick,
      cutKeyword: this.cutKeywordOnClick,
      cutActionKeyword: this.cutActionKeywordOnClick,
      cutDmgAttribute: this.cutDmgAttributeOnClick,
      createAction: this.createActionOnClick,
      deleteAction: this.deleteActionOnClick,
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

  static async keywordPicker() {
    new KeywordPicker({ document: this.item })?.render(true);
  }

  static async actionKeywordPicker(_, target) {
    const { acId } = target.dataset;
    new ActionKeywordPicker({ document: this.item, acId: acId })?.render(true);
  }

  static async addDmgAttributeOnClick(_, target) {
    const item = this.document;
    const acId = target.dataset.acId;
    let attributes = PC.attributes;

    const attributeButtons = Object.entries(attributes).map(([key, data]) => ({
      action: key,
      label: game.i18n.localize(data.abv),
      callback: async () => {
        const currentArray =
          foundry.utils.getProperty(
            item.system,
            `actions.${acId}.damage.dmgAttributes`
          ) ?? [];
        const updatedArray = currentArray.includes(key)
          ? currentArray
          : [...currentArray, key];
        await item.update({
          [`system.actions.${acId}.damage.dmgAttributes`]: updatedArray,
        });
      },
    }));

    await api.Dialog.wait({
      classes: ["attribute-picker"],
      window: {
        title: "Selecione um attributo de dano",
      },
      content: `<p>Clique para adicionar um atributo de dano a ação</p>`,
      buttons: attributeButtons,
    });
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

  static async cutDmgAttributeOnClick(_, target) {
    const item = this.document;
    const { acId, att } = target.dataset;
    const currentArray =
      foundry.utils.getProperty(
        item.system,
        `actions.${acId}.damage.dmgAttributes`
      ) ?? [];
    const updatedArray = currentArray.filter((i) => i !== att);
    item.update({
      [`system.actions.${acId}.damage.dmgAttributes`]: updatedArray,
    });
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
}
