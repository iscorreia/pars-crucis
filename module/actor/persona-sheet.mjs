const { api, sheets } = foundry.applications;
import { PC } from "../config.mjs";
import PersonaConfig from "../apps/persona-config.mjs";
import PCRoll from "../rolls/basic-roll.mjs";

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
      clickAbilityAttack: this.abilityAttack,
      clickAbilityTest: this.abilityTest,
      clickAbilityUse: this.abilityUse,
      clickAttribute: this.onAttributeClick,
      clickDelete: this.deleteItemOnClick,
      clickEdit: this.editItemOnClick,
      clickEquip: this.equipItemOnClick,
      clickLuck: this.onLuckClick,
      clickGearAttack: this.gearAttack,
      clickGearTest: this.gearTest,
      clickGearUse: this.gearUse,
      clickSkill: this.onSkillClick,
      sortAbilities: this.changeSortMode,
      toggleExpand: this.toggleAbilityExpand,
      configurePersona: this.configurePersona,
    },
  };

  get title() {
    return this.actor.name;
  }

  /** @inheritdoc Defines where are the template PARTS */
  static PARTS = {
    header: {
      template: "systems/pars-crucis/templates/actor/parts/header.hbs",
    },
    tabs: {
      // Foundry-provided generic template
      template: "templates/generic/tab-navigation.hbs",
      classes: ["pars-crucis-nav"],
    },
    skills: {
      template: "systems/pars-crucis/templates/actor/parts/skills.hbs",
    },
    abilities: {
      template: "systems/pars-crucis/templates/actor/parts/abilities.hbs",
      scrollable: [".abilities-list-block"],
    },
    gear: {
      template: "systems/pars-crucis/templates/actor/parts/gear.hbs",
      scrollable: [".gear-list-block"],
    },
    passives: {
      template: "systems/pars-crucis/templates/actor/parts/passives.hbs",
      scrollable: [".passives-list-block"],
    },
    background: {
      template: "systems/pars-crucis/templates/actor/parts/background.hbs",
    },
  };

  static TABS = {
    primary: {
      initial: "gear", // Change to simplify testing, once done set back to skills
      tabs: [
        { id: "skills", label: "PC.tabs.skills" },
        { id: "abilities", label: "PC.tabs.abilities" },
        { id: "gear", label: "PC.tabs.gear" },
        { id: "passives", label: "PC.tabs.passives" },
        { id: "background", label: "PC.tabs.background" },
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

  /** @override */
  async _prepareContext() {
    const baseData = await super._prepareContext();
    const document = baseData.document;
    const system = document.system;
    const categorizedAbilities = this.categorize(
      system.abilities,
      "system.info.art",
      this.sortAbilities.bind(this)
    );
    const categorizedPassives = this.categorize(
      system.passives,
      "system.info.subtype",
      this.sortItems.bind(this)
    );

    const context = {
      editable: baseData.editable,
      document: document,
      actor: document,
      system: system,
      // items: document.items, // if needed
      systemFields: system.schema.fields, // used in formInput|formGroup
      categorized: {
        abilities: categorizedAbilities,
        passives: categorizedPassives,
      },
      config: CONFIG.PC,
      tabs: this._prepareTabs("primary"),
      effects: document.effects, // easier access fo effects
    };

    return context;
  }

  /** @override */
  async _preparePartContext(partId, context) {
    switch (partId) {
      case "skills":
      case "abilities":
      case "gear":
      case "passives":
      case "background":
        context.tab = context.tabs[partId];
        break;
      default:
    }

    return context;
  }

  /** @override */
  _onRender(context, options) {}

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
    const dataset = target.dataset;
    const attKey = dataset.attribute;
    const attType = dataset.type;
    const actor = this.actor;
    const attData = actor.system[attType][attKey];
    const diceFormula = this.dice(event);

    // Create roll formula
    const formula = `${diceFormula} + ${attData.derived} + ${attData.mod}`;

    // Create the roll with flavor
    const roll = await PCRoll.create(
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
    const dataset = target.dataset;
    const luckBooleans = this.actor.system.luck.booleans;
    const index = dataset.luckIndex;

    luckBooleans[index] = !luckBooleans[index];

    this.actor.update({ "system.luck.booleans": luckBooleans });
  }

  static async onSkillClick(event, target) {
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
    const itemId = target.dataset.itemId;
    const item = this.actor.items.get(itemId);

    if (this.actor.isOwner) {
      // Skips Dialog and immediatelly Deletes the item
      if (event.ctrlKey) {
        item.delete();
        return;
      }

      api.Dialog.wait({
        window: { title: "Destruir item" },
        content: `<p>Deseja destruir o item: ${item.name}</p>`,
        buttons: [
          {
            action: "delete",
            icon: '<i class="fa-solid fa-trash-can"></i>',
            label: "PC.delete",
            callback: () => item.delete(),
            default: true,
          },
          {
            action: "edit",
            icon: '<i class="fas fa-edit"></i>',
            label: "PC.edit",
            callback: () => item.sheet.render(true),
          },
          {
            action: "cancel",
            icon: '<i class="fas fa-times"></i>',
            label: "PC.cancel",
          },
        ],
      });
    }
  }

  categorize(itemCollection, path, sortFn) {
    const categorized = {};

    for (let item of itemCollection) {
      const category = path.split(".").reduce((obj, key) => obj[key], item);
      if (!categorized[category]) {
        categorized[category] = [];
      }
      categorized[category].push(item);
    }

    for (const key of Object.keys(categorized)) {
      const sortMode = this.getSortMode(key);
      categorized[key] = sortFn(categorized[key], sortMode);
    }

    return categorized;
  }

  sortAbilities(group, sortMode = "coreLevel-asc") {
    return group.slice().sort((a, b) => {
      switch (sortMode) {
        case "coreLevel-desc":
          return b.system.details.coreLevel - a.system.details.coreLevel;
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        default: // "coreLevel-asc"
          return a.system.details.coreLevel - b.system.details.coreLevel;
      }
    });
  }

  sortItems(group, sortMode = "name-asc") {
    return group.slice().sort((a, b) => {
      switch (sortMode) {
        case "name-desc":
          return b.name.localeCompare(a.name);
        default: // "name-asc"
          return a.name.localeCompare(b.name);
      }
    });
  }

  getSortMode(flag) {
    const actor = this.document;
    return actor.getFlag("pars-crucis", flag) || "name-asc";
  }

  // Renders item sheet if owner
  static async editItemOnClick(_, target) {
    const item = this.actor.items.get(target.dataset.itemId);
    if (this.actor.isOwner) item.sheet.render(true);
  }

  static async equipItemOnClick(_, target) {
    const dataset = target.dataset;
    const item = this.actor.items.get(dataset.itemId);
    if (this.actor.isOwner)
      return item.update({ ["system.details.equipped"]: dataset.equip });
  }

  static async configurePersona() {
    new PersonaConfig({ document: this.actor })?.render(true);
  }

  static async toggleAbilityExpand(_, target) {
    const item = this.actor.items.get(target.dataset.itemId);
    const current = item.getFlag("pars-crucis", "expanded") ?? false;
    item.setFlag("pars-crucis", "expanded", !current);
  }

  static async abilityAttack() {
    console.log("ATTACK ABILITY HERE");
  }

  static async abilityTest() {
    console.log("TEST ABILITY HERE");
  }

  static async abilityUse() {
    console.log("USE ABILITY HERE");
  }

  static async gearAttack() {
    console.log("ATTACK GEAR HERE");
  }

  static async gearTest() {
    console.log("TEST GEAR HERE");
  }

  static async gearUse() {
    console.log("USE GEAR HERE");
  }

  static async changeSortMode(_, target) {
    const dataset = target.dataset;
    const actor = this.document;
    actor.setFlag("pars-crucis", dataset.group, dataset.sortMode);
  }
}
