/**
 * Form to configure to action damage
 * @extends {ApplicationV2}
 */

const { api } = foundry.applications;
import { PC } from "../config.mjs";

export default class SetDamage extends api.HandlebarsApplicationMixin(
  api.DocumentSheetV2,
) {
  static DEFAULT_OPTIONS = {
    form: {
      submitOnChange: true,
      handler: this.#handleChanges,
    },
    position: {
      width: 400,
      height: 200,
    },
    tag: "form",
    window: {
      icon: "fa-regular fa-wrench",
      title: "PC.configPersona",
    },
    actions: {
      addDmgAttribute: this.addDmgAttributeOnClick,
      cutDmgAttribute: this.cutDmgAttributeOnClick,
    },
  };

  /** @inheritdoc */
  static PARTS = {
    content: {
      template: "systems/pars-crucis/templates/apps/set-damage.hbs",
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
    const actor = this.options.document;
    const upData = formData.object;
    await actor.update(upData);
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
            `actions.${acId}.damage.dmgAttributes`,
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

  static async cutDmgAttributeOnClick(_, target) {
    const item = this.document;
    const { acId, att } = target.dataset;
    const currentArray =
      foundry.utils.getProperty(
        item.system,
        `actions.${acId}.damage.dmgAttributes`,
      ) ?? [];
    const actions = foundry.utils.getProperty(item.system, `actions`) ?? [];
    const updatedArray = currentArray.filter((i) => i !== att);
    item.update({
      [`system.actions.${acId}.damage.dmgAttributes`]: updatedArray,
    });
  }
}
