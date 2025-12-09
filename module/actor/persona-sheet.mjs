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

  async _prepareContext(options) {
    //const context = await super._prepareContext(options);

    context.actor = this.document;
    context.system = this.document.system;
    context.config = CONFIG.PC;

    return context;
  }

  // find how to implement listeners
  // use Handlebars and Action

  /**
   * Handle attribute roll clicks
   * @param {PointerEvent} event - The originating click event
   * @param {HTMLElement} target - the capturing HTML element which defined a [data-action]
   */
  static async onAttributeClick(event, target) {
    event.preventDefault();

    // Get actor ID from data attribute
    const actorId = target.dataset.actorId;
    if (!actorId) {
      console.error("Actor ID not found");
      return;
    }

    // Get the actor from the game
    const actor = game.actors.get(actorId);
    if (!actor) {
      console.error("Actor not found for roll", actorId);
      return;
    }

    const attributeKey = target.dataset.attribute;
    if (!attributeKey) {
      console.error("Attribute key not found");
      return;
    }

    // Get attribute data directly
    const attributeData = actor.system.attributes[attributeKey];

    const baseValue = attributeData.override ?? attributeData.base ?? 0;
    const modValue = attributeData.mod ?? 0;

    // Check if Shift or Ctrl is pressed.
    const isShiftPressed = event.shiftKey;
    const isCtrlPressed = event.ctrlKey || event.metaKey;

    // Create formula based on key pressed
    let diceFormula;
    if (isShiftPressed) {
      // with Shift
      diceFormula = "3d10kh2";
    } else if (isCtrlPressed) {
      // with Ctrl
      diceFormula = "3d10kl2";
    } else {
      // Normal roll
      diceFormula = "2d10";
    }

    // Create roll formula
    const formula = `${diceFormula} + ${baseValue} + ${modValue}`;

    // Create the roll with flavor
    const roll = await Roll.create(
      formula,
      {},
      {
        flavor: attributeKey.toUpperCase(), // Shows the attribute "FIS", "DES", "EGO"...
      }
    );

    // Send to chat (toMessage)
    await roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: actor }),
      rollMode: game.settings.get("core", "rollMode"),
    });

    return roll;
  }
}

// how to make a roll
// on click roll a d6 for clicked attribute

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
