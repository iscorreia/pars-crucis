const { api, sheets } = foundry.applications;
import { PC } from "../config.mjs";

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

    // Check if Shift or Ctrl is pressed.
    const isShiftPressed = event.shiftKey;
    const isCtrlPressed = event.ctrlKey || event.metaKey;

    // Create dice formula based on key pressed
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
    const formula = `${diceFormula} + ${attributeData.derived} + ${attributeData.mod}`;

    // Create the roll with flavor
    const roll = await Roll.create(
      formula,
      {},
      {
        flavor: `${game.i18n.localize(PC.attribute[attributeKey].abv)}`,
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
