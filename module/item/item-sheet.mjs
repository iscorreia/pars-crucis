const { api, sheets } = foundry.applications;
import { PC } from "../config.mjs";

export class ParsCrucisItemSheet extends api.HandlebarsApplicationMixin(
  sheets.ItemSheetV2
) {
  static DEFAULT_OPTIONS = {
    form: {
      submitOnChange: true,
    },
    position: {
      width: 600,
      height: 440,
    },
    tag: "form",
    window: {
      icon: "fa fa-magic",
    },
  };

  /** Defines where are the template PARTS */
  static PARTS = {
    header: {
      template: "systems/pars-crucis/templates/item/parts/header.hbs",
    },
    tabs: {
      template: "templates/generic/tab-navigation.hbs",
    },
    description: {
      template: "systems/pars-crucis/templates/item/parts/description.hbs",
    },
  };

  static TABS = {
    primary: {
      initial: "description",
      tabs: [
        {
          id: "description",
          label: "Descrição",
        },
      ],
    },
  };

  getTitle() {
    // Retorna apenas o nome do item, sem o tipo
    return this.document.name || "Novo Item";
  }

  async _prepareContext() {
    const context = {
      item: this.document,
      document: this.document,
      system: this.document.system,
      config: CONFIG.PC,
      tabs: this._prepareTabs("primary"),
    };
    console.log(context);
    return context;
  }

  async _preparePartContext(partId, context) {
    switch (partId) {
      case "description":
        context.tab = context.tabs[partId];
        break;
      default:
    }

    return context;
  }

  activateListeners(html) {
    super.activateListeners(html);

    if (!this.options.editable) return;

    // Delete Self
    html.find(".self-destruct").click((ev) => {
      const id = $(ev.currentTarget).attr("self");
      if (this.document.actor != null) {
        this.document.actor.items.get(id)?.delete();
      }
    });
  }
}

// create fields that contain image, name and a simple text
