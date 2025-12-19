const { api, sheets } = foundry.applications;
import { PC } from "../config.mjs";
import PersonaConfig from "../apps/persona-config.mjs";

export class PersonaSheet extends api.HandlebarsApplicationMixin(
  sheets.ActorSheetV2
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
      clickDelete: this.deleteItemOnClick,
      clickEdit: this.editItemOnClick,
      clickLuck: this.onLuckClick,
      clickSkill: this.onSkillClick,
      configurePersona: this.configurePersona,
    },
  };

  /** @inheritdoc Defines where are the template PARTS */
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
        { id: "skills", label: "PC.tabs.skills" },
        { id: "abilities", label: "PC.tabs.abilities" },
        { id: "gear", label: "PC.tabs.gear" },
        { id: "passives", label: "PC.tabs.passives" },
        { id: "details", label: "PC.tabs.details" },
      ],
    },
  };

  _getHeaderControls() {
    let controls = super._getHeaderControls();
    if (this.actor.isOwner) {
      controls.unshift({
        label: "PC.configPersona",
        icon: "fas fa-wrench",
        action: "configurePersona",
      });
    }
    return controls;
  }

  async _prepareContext() {
    const context = {
      actor: this.document,
      document: this.document,
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

  dice(event) {
    let dice = "2d10";
    // Checks if Shift or Ctrl is pressed and adjusts formula.
    if (event.shiftKey) {
      dice = "3d10kh2"; // Keep 2 highest out of 3d10
    } else if (event.ctrlKey || event.metaKey) {
      dice = "3d10kl2"; // Keep 2 lowest out of 3d10
    }
    return dice;
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
    const diceFormula = this.dice(event);

    // Create roll formula
    const formula = `${diceFormula} + ${attData.derived} + ${attData.mod}`;

    // Create the roll with flavor
    const roll = await Roll.create(
      formula,
      {},
      {
        flavor: `${game.i18n.localize(PC[attType][attKey].label)}`,
      }
    );

    // Send to chat (toMessage)
    await roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: actor }),
      rollMode: game.settings.get("core", "rollMode"),
    });

    return roll;
  }

  static async onLuckClick(event, target) {
    event.preventDefault();
    const dataset = target.dataset;
    const luckBooleans = this.actor.system.luck.booleans;
    const index = dataset.luckIndex;

    luckBooleans[index] = !luckBooleans[index];

    this.actor.update({ "system.luck.booleans": luckBooleans });
  }

  static async onSkillClick(event, target) {
    event.preventDefault();
    const dataset = target.dataset;
    const skKey = dataset.skill;
    const skType = dataset.type;
    const actor = this.actor;
    const skData = actor.system[skType][skKey];
    const catMod = actor.system.categoryModifiers[skData.category];
    const diceFormula = this.dice(event);

    const formula = `${diceFormula} + ${skData.level} + ${skData.mod + catMod}`;

    const roll = await Roll.create(
      formula,
      {},
      {
        flavor: `${game.i18n.localize(PC[skType][skKey].label)}`,
      }
    );

    await roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: actor }),
      rollMode: game.settings.get("core", "rollMode"),
    });

    return roll;
  }

  // Open a Dialog box with options to Delete, Edit or Cancel
  static async deleteItemOnClick(event, target) {
    event.preventDefault();
    const itemId = target.dataset.itemId;
    const item = this.actor.items.get(itemId);

    if (this.actor.isOwner) {
      // Skips Dialog and immediatelly Deletes the item
      if (event.ctrlKey) {
        item.delete();
        return;
      }

      api.Dialog.wait({
        window: { title: "DELETE ITEM" },
        content: `<p>WILL DELETE-> ${item.name}</p>`,
        buttons: [
          {
            action: "delete",
            icon: '<i class="fa-solid fa-trash-can"></i>',
            label: "DELETE",
            callback: () => item.delete(),
            default: true,
          },
          {
            action: "edit",
            icon: '<i class="fas fa-edit"></i>',
            label: "EDIT",
            callback: () => item.sheet.render(true),
          },
          {
            action: "cancel",
            icon: '<i class="fas fa-times"></i>',
            label: "CANCEL",
          },
        ],
      });
    }
  }

  // Renders item sheet if owner
  static async editItemOnClick(event, target) {
    event.preventDefault();
    const itemId = target.dataset.itemId;
    const item = this.actor.items.get(itemId);
    if (this.actor.isOwner) item.sheet.render(true);
  }

  static async configurePersona(event) {
    event.preventDefault();
    new PersonaConfig({ document: this.actor })?.render(true);
  }
}
