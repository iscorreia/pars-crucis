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
  };

  /** Defines where are the template PARTS */
  static PARTS = {
    header: {
      template: "systems/pars-crucis/templates/actor/parts/header.hbs",
    },
    main: { template: "systems/pars-crucis/templates/actor/parts/main.hbs" },
  };

  static TABS = {
    initial: "skills",
    tabs: {
      skills: "skills",
      gear: "gear",
    },
    tag: "form", // Default is div in case we don't want to define a tag
    window: {
      icon: "fa fa-address-card",
    },
    actions: {
      clickAttribute: this.onAttributeClick,
    },
  };

  async _prepareContext(options) {
    // const context = await super._prepareContext() // is this still necessary?

    context.actor = this.document;
    context.system = this.document.system;
    context.config = CONFIG.PC;

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
