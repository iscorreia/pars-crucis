const { api, sheets } = foundry.applications;
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
      addKeyword: this.addKeywordOnClick,
      addActionKeyword: this.addActionKeywordOnClick,
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

  static async addKeywordOnClick(_, target) {
    const item = this.document;
    let keywords = PC[`${target.dataset.type}Keyword`];

    const keywordButtons = Object.entries(keywords).map(([key, data]) => ({
      action: key,
      label: game.i18n.localize(data.label),
      callback: async () => {
        await item.update({
          [`system.keywords.${key}`]: null,
        });
      },
    }));

    // Show the keyword picker dialog
    await api.Dialog.wait({
      classes: ["keyword-picker"],
      window: {
        title: "Selecionar palavra-chave",
      },
      content: `<p>Clique para adicionar uma palavra chave ao item ${item.name}</p>`,
      buttons: keywordButtons,
    });
  }

  static async addActionKeywordOnClick(_, target) {
    const item = this.document;
    const acId = target.dataset.acId;
    let keywords = PC[`${target.dataset.type}Keyword`];

    const keywordButtons = Object.entries(keywords).map(([key, data]) => ({
      action: key,
      label: game.i18n.localize(data.label),
      callback: async () => {
        await item.update({
          [`system.actions.${acId}.keywords.${key}`]: null,
        });
      },
    }));

    // Show the keyword picker dialog
    await api.Dialog.wait({
      classes: ["keyword-picker"],
      window: {
        title: "Selecionar palavra-chave",
      },
      content: `<p>Clique para adicionar uma palavra chave ao item ${item.name}</p>`,
      buttons: keywordButtons,
    });
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
    const acId = target.dataset.acId;
    const keywordKey = target.dataset.keyword;
    item.update({ [`system.actions.${acId}.keywords.-=${keywordKey}`]: null });
  }

  static async cutDmgAttributeOnClick(_, target) {
    const item = this.document;
    const acId = target.dataset.acId;
    const dmgAtt = target.dataset.att;
    const currentArray =
      foundry.utils.getProperty(
        item.system,
        `actions.${acId}.damage.dmgAttributes`
      ) ?? [];
    const updatedArray = currentArray.filter((att) => att !== dmgAtt);
    item.update({
      [`system.actions.${acId}.damage.dmgAttributes`]: updatedArray,
    });
  }

  static async createActionOnClick(_, target) {
    const item = this.document;
    const acType = target.dataset.acType;
    const actionId = foundry.utils.randomID();
    const newAction = {
      img: item.img,
      name: game.i18n.localize(`PC.${acType}`),
      type: acType,
      _id: actionId,
    };

    await item.update({
      [`system.actions.${actionId}`]: newAction,
    });
  }

  // Deletes an Item Action from the actions collections
  static async deleteActionOnClick(_, target) {
    const actionId = target.dataset.actionId;
    const item = this.document;
    item.update({ [`system.actions.-=${actionId}`]: null });
  }
}
