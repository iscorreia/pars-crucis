const { api, sheets } = foundry.applications;

export class PersonaSheet extends foundry.applications.api.HandlebarsApplicationMixin(
  foundry.applications.sheets.ActorSheetV2
) {
  /** Defines where are the template PARTS */
  static PARTS = {
    header: {
      template: "systems/pars-crucis/templates/actor/parts/header.hbs",
    },
    main: { template: "systems/pars-crucis/templates/actor/parts/main.hbs" },
  };

  static DEFAULT_OPTIONS = {
    form: {
      submitOnChange: true,
    },
    position: {
      width: 800,
      height: 680
    },
    tag: "form", // Default is div in case we don't want to define a tag
    window: {
      icon: "fa fa-address-card"
    }
  };

  async _prepareContext(options) {
    // const context = await super._prepareContext() // is this still necessary?

    context.actor = this.document;
    context.system = this.document.system;
    context.config = CONFIG.PC;

    return context;
  }
}


/** Some reference, might be VERY WRONG */
// export class ParsCrucisActorSheet extends api.HandlebarsApplicationMixin(
//   sheets.ActorSheetV2
// ) {
//   static get defaultOptions() {
//     return mergeObject(super.defaultOptions, {
//       classes: ["parscrucis", "sheet", "actor"],
//       template: "templates/actor/actor-sheet.hbs",
//       width: 400,
//       height: 300,
//     });
//   }

//   getData() {
//     const data = super.getData();
//     data.system = this.actor.system;
//     data.PV = this.actor.PV; // dynamic PV
//     return data;
//   }

//   activateListeners(html) {
//     super.activateListeners(html);

//     html.find(".increment").click((ev) => {
//       const attr = ev.currentTarget.dataset.attr;
//       const current = getProperty(this.actor.system, attr) || 0;
//       this.actor.update({ [`system.${attr}`]: current + 1 });
//     });

//     html.find(".decrement").click((ev) => {
//       const attr = ev.currentTarget.dataset.attr;
//       const current = getProperty(this.actor.system, attr) || 0;
//       if (current > 0) this.actor.update({ [`system.${attr}`]: current - 1 });
//     });
//   }
// }