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
      cutKeyword: this.cutKeywordOnClick,
      createAction: this.createActionOnClick,
      deleteAction: this.deleteActionOnClick,
    },
  };

  getTitle() {
    // Retorna apenas o nome do item, sem o tipo
    return this.document.name || "Novo Item";
  }

  async _prepareContext() {
    const document = this.document;
    const system = document.system;
    const context = {
      item: document,
      document: document,
      system: system,
      systemFields: system.schema.fields,
      config: CONFIG.PC,
    };

    return context;
  }

  static async addKeywordOnClick(event, target) {
    event.preventDefault();
    const item = this.document;

    const keywordButtons = Object.entries(PC.keyword).map(([key, data]) => ({
      action: key,
      label: game.i18n.localize(data.label),
      callback: async () => {
        await item.update({
          [`system.details.keywords.${key}`]: null,
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

  static async cutKeywordOnClick(event, target) {
    event.preventDefault();
    const item = this.document;
    const keywordKey = target.dataset.keyword;
    item.update({ [`system.details.keywords.-=${keywordKey}`]: null });
  }

  static async createActionOnClick(event, target) {
    event.preventDefault();
    const item = this.document;
    const dataset = target.dataset;
    const actionId = foundry.utils.randomID();
    const newAction = {
      img: item.img,
      name: item.name,
      type: dataset.acType,
      _id: actionId,
    };

    await item.update({
      [`system.actions.${actionId}`]: newAction,
    });
  }

  // Deletes an Item Action from the actions collections
  static async deleteActionOnClick(event, target) {
    event.preventDefault();
    const actionId = target.dataset.actionId;
    const item = this.document;
    item.update({ [`system.actions.-=${actionId}`]: null });
  }
}
