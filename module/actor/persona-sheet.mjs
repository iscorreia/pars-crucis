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
          label: "PC.tabs.skills",
        },
        {
          id: "abilities",
          label: "PC.tabs.abilities",
        },
        {
          id: "gear",
          label: "PC.tabs.gear",
        },
        {
          id: "passives",
          label: "PC.tabs.passives",
        },
        {
          id: "details",
          label: "PC.tabs.details",
        },
      ],
    },
  };

  async _prepareContext() {
    const context = {
      actor: this.document,
      documento: this.document,
      system: this.document.system,
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
   * Handle attribute and skill roll clicks
   * @param {PointerEvent} event - The originating click event
   * @param {HTMLElement} target - The capturing HTML element which defined a [data-action]
   */
  static async onAttributeClick(event, target) {
    event.preventDefault();
    const dataset = target.dataset;
    const attKey = dataset.attribute;
    const attType = dataset.type;
    const actor = this.actor;
    const attData = actor.system[attType][attKey];

    // Checks if Shift or Ctrl is pressed.
    const isShiftPressed = event.shiftKey;
    const isCtrlPressed = event.ctrlKey || event.metaKey;

    // Creates dice formula taking into account Shit and Ctrl
    let diceFormula;
    if (isShiftPressed) {
      diceFormula = "3d10kh2";
    } else if (isCtrlPressed) {
      diceFormula = "3d10kl2";
    } else {
      diceFormula = "2d10";
    }

    // Create roll formula
    const formula = `${diceFormula} + ${attData.derived} + ${attData.mod}`;

    let flavor = "";
    if (attType == "minors") {
      flavor = `${game.i18n.localize(PC[attType][attKey].label)}`;
    } else flavor = `${game.i18n.localize(PC[attType][attKey].abv)}`;

    // Create the roll with flavor
    const roll = await Roll.create(
      formula,
      {},
      {
        flavor: flavor,
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
