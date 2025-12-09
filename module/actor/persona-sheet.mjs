const { api, sheets } = foundry.applications;

export class PersonaSheet extends foundry.applications.api.HandlebarsApplicationMixin(
  foundry.applications.sheets.ActorSheetV2
) {
  static DEFAULT_OPTIONS = {
    form: {
      submitOnChange: true,
    },
    position: {
      width: 800,
      height: 680,
    },
    tag: "form", // Default is div in case we don't want to define a tag
    window: {
      icon: "fa fa-address-card",
    },
    actions: {
      clickAttribute: this.onAttributeClick,
    },
  };

  /** Defines where are the template PARTS */
  static PARTS = {
    header: {
      template: "systems/pars-crucis/templates/actor/parts/header.hbs",
    },
    tabs: {
      // Foundry-provided generic template
      template: "templates/generic/tab-navigation.hbs",
      // classes: ['sysclass'], // Optionally add extra classes to the part for extra customization
    },
    skills: {
      template: "systems/pars-crucis/templates/actor/parts/skills.hbs",
    },
    abilities: {
      template: "systems/pars-crucis/templates/actor/parts/abilities.hbs",
    },
    gear: {
      template: "systems/pars-crucis/templates/actor/parts/gear.hbs",
    },
    passives: {
      template: "systems/pars-crucis/templates/actor/parts/passives.hbs",
    },
    details: {
      template: "systems/pars-crucis/templates/actor/parts/details.hbs",
    },
  };

  static TABS = {
    primary: {
      initial: "skills",
      tabs: [
        {
          id: "skills",
          label: "PC.skills",
        },
        {
          id: "abilities",
          label: "PC.abilities",
        },
        {
          id: "gear",
          label: "PC.gear",
        },
        {
          id: "passives",
          label: "PC.passives",
        },
        {
          id: "details",
          label: "PC.details",
        },
      ],
    },
  };

  async _prepareContext() {
    const context = {
      actor: this.document,
      documento: this.document,
      system: this.document.system,
      config: CONFIG.PC,
      tabs: this._prepareTabs("primary"),
    };

    return context;
  }

  async _preparePartContext(partId, context) {
    switch (partId) {
      case "skills":
      case "abilities":
      case "gear":
      case "passives":
      case "details":
        context.tab = context.tabs[partId];
        break;
      default:
    }

    return context;
  }

  /**
   * @param {PointerEvent} event - The originating click event
   * @param {HTMLElement} target - the capturing HTML element which defined a [data-action]
   */
  static onAttributeClick(event, target) {
    console.log("Attribute:", target.dataset.attribute);
    event.preventDefault();
  }
}

// how to make a roll
// on click roll a d6 for clicked attribute
