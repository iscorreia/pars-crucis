const { api, handlebars, sheets } = foundry.applications;
import ActionPicker from "../apps/action-picker.mjs";
import { PC } from "../config.mjs";
import PCRoll from "../rolls/basic-roll.mjs";
import TestRoll from "../rolls/test-roll.mjs";

//This is the basic class for Pars Crucis Actor and should be extended
export class ParsCrucisActorSheet extends api.HandlebarsApplicationMixin(
  sheets.ActorSheetV2,
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
      actionPicker: this.actionPicker,
      callAction: this.callActionOnClick,
      clickDelete: this.deleteItemOnClick,
      clickEdit: this.editItemOnClick,
      clickEquip: this.equipItemOnClick,
      rollAttack: this.rollTestOnClick,
      rollAttribute: this.rollAttributeOnClick,
      rollAbilityAttack: this.rollTestOnClick,
      rollTech: this.rollTechOnClick,
      rollTest: this.rollTestOnClick,
      rollSkill: this.rollSkillOnClick,
      useAbility: this.useOnClick,
      useGear: this.useOnClick,
      sortAbilities: this.changeSortMode,
      switchLuck: this.switchLuckOnClick,
      toggleExpand: this.toggleAbilityExpand,
      // configurePersona: this.configurePersona,
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
      scrollable: [".item-list-block"],
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
      initial: "abilities", // Change to simplify testing, once done set back to skills
      tabs: [
        { id: "skills", label: "PC.tabs.skills" },
        { id: "abilities", label: "PC.tabs.abilities" },
        { id: "gear", label: "PC.tabs.gear" },
        { id: "passives", label: "PC.tabs.passives" },
        { id: "background", label: "PC.tabs.background" },
      ],
    },
  };

  /** @override */
  async _prepareContext() {
    const baseData = await super._prepareContext();
    const document = baseData.document;
    const system = document.system;
    const categorizedAbilities = this.categorize(
      system.abilities,
      "system.info.art",
      this.sortAbilities.bind(this),
    );
    const categorizedPassives = this.categorize(
      system.passives,
      "system.info.subtype",
      this.sortItems.bind(this),
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

  static async callActionOnClick(event, target) {
    const { acType } = target.dataset;
    if (["attack", "test"].includes(acType))
      ParsCrucisActorSheet.rollTestOnClick.call(this, event, target);
    if (acType === "tech")
      ParsCrucisActorSheet.rollTechOnClick.call(this, event, target);
    if (acType === "use")
      ParsCrucisActorSheet.useOnClick.call(this, event, target);
  }

  /**
   * Handle attribute and skill roll clicks
   * @param {PointerEvent} event - The originating click event
   * @param {HTMLElement} target - The capturing HTML element which defined a [data-action]
   */
  static async rollAttributeOnClick(event, target) {
    const { attribute, type } = target.dataset;
    const actor = this.actor;
    const { derived, mod } = actor.system[type][attribute];
    const dice = this.dice(event);
    const formula = `${dice} + ${derived} + ${mod}`;
    const testLabel = `${game.i18n.localize("PC.testOf")}`;
    const attLabel = `${game.i18n.localize(PC[type][attribute].label)}`;
    const RollOptions = { flavor: `${testLabel} ${attLabel}` };
    const roll = new PCRoll(formula, {}, RollOptions);

    // Send to chat (toMessage)
    await roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: actor }),
      rollMode: game.settings.get("core", "rollMode"),
    });

    return roll;
  }

  static async rollTestOnClick(event, target) {
    const { acId, itemId } = target.dataset;
    const actor = this.actor;
    const item = actor.items.get(itemId);
    const action = item.system.actions[acId];
    const { difficulty, skill, subtype, type } = action;
    const { category, modGroup, level, mod } = actor.system.skills[skill];
    const keywords = keywordResolver(item.system.keywords, action.keywords);
    const catMod = actor.system.categoryModifiers[category];
    const groupMod = modGroup ? actor.system.groupModifiers[modGroup].mod : 0;
    const modifiers =
      mod +
      catMod +
      groupMod +
      (Number(keywords?.handling) || 0) +
      (Number(keywords?.modifier) || 0);
    const dice = this.dice(event);
    const formula = `${dice} + ${level || 0} + ${modifiers || 0}`;
    const flavor = craftFlavor({
      skill: skill,
      acType: type,
      acSubtype: subtype,
      difficulty: difficulty,
    });
    // Additional information passed to the roll
    const info = {
      subtype: action.subtype,
      damaging: action.damaging,
      damage: action.damage?.dmgTxt,
      effort: action.effort,
      duration: action.duration,
      effect: action.effect,
      keywords: keywords,
      range: action.range,
      prepTime: action.prepTime,
    };
    // Important options passed to the roll
    const RollOptions = {
      flavor: flavor,
      difficulty: difficulty,
      img: action.img || item.img,
      itemName: item.name,
      actionName: action.name,
      info: info,
      type: type,
    };

    // console.log("rollTestOnClick", actor, item, item.system.actions[acId]); // DEBUG logging

    // Create the Test Roll
    const roll = new TestRoll(formula, {}, RollOptions);
    await roll.evaluate();
    await roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: actor }),
      rollMode: game.settings.get("core", "rollMode"),
    });
    return roll;
  }

  static async rollTechOnClick(event, target) {
    const { acId, itemId } = target.dataset;
    const actor = this.actor;
    const item = actor.items.get(itemId);
    const action = item.system.actions[acId];
    const { techSkill, techSubtype, type } = action;
    const { category, modGroup, level, mod } = actor.system.skills[techSkill];
    const techKeywords = keywordResolver(item.system.keywords, action.keywords);
    const { selectedAction, selectedItem } = action;
    const srcKeywords = keywordResolver(
      selectedItem.system.keywords,
      selectedAction.keywords,
    );
    const keywords = keywordResolver(techKeywords, srcKeywords);
    // console.log(resolvedKeywords); // DEBUG logging the merge keywords
    const catMod = actor.system.categoryModifiers[category];
    const groupMod = modGroup ? actor.system.groupModifiers[modGroup].mod : 0;
    const modifiers =
      mod +
      catMod +
      groupMod +
      (Number(keywords?.handling) || 0) +
      (Number(keywords?.modifier) || 0);
    const dice = this.dice(event);
    const formula = `${dice} + ${level || 0} + ${modifiers || 0}`;
    const flavor = craftFlavor({
      skill: techSkill,
      acSubtype: techSubtype,
      acType: type,
    });
    const withItem = {
      selectedItem: {
        img: selectedItem.img,
        name: selectedItem.name,
      },
      selectedAction: {
        img: selectedAction.img,
        name: selectedAction.name,
      },
    };
    // Additional information passed to the roll
    const info = {
      withItem: withItem,
      subtype: action.techSubtype,
      damaging: action.damaging,
      damage: action.damage?.dmgTxt,
      effort: action.effort,
      duration: action.duration,
      effect: action.effect,
      keywords: keywords,
      range: action.range,
      prepTime: action.prepTime,
    };
    // Important options passed to the roll
    const RollOptions = {
      flavor: flavor,
      img: action.img || item.img,
      itemName: item.name,
      actionName: action.name,
      info: info,
      type: type,
    };

    // console.log("rollTechOnClick", flavor, formula, item, action, dice); // DEBUG logging

    // Create the Test Roll
    const roll = new TestRoll(formula, {}, RollOptions);
    await roll.evaluate();
    await roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: actor }),
      rollMode: game.settings.get("core", "rollMode"),
    });
    return roll;
  }

  static async rollSkillOnClick(event, target) {
    const { skill } = target.dataset;
    const actor = this.actor;
    const { category, modGroup, level, mod } = actor.system.skills[skill];
    const groupMod = modGroup ? actor.system.groupModifiers[modGroup].mod : 0;
    const catMod = actor.system.categoryModifiers[category];
    const dice = this.dice(event);
    const formula = `${dice} + ${level} + ${mod + catMod + groupMod}`;
    const flavor = craftFlavor({ skill: skill });
    const RollOptions = { flavor: flavor };
    const roll = new PCRoll(formula, {}, RollOptions);
    await roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: actor }),
      rollMode: game.settings.get("core", "rollMode"),
    });
    return roll;
  }

  static async useOnClick(_, target) {
    const { acId, itemId } = target.dataset;
    const item = this.actor.items.get(itemId);
    const action = item.system.actions[acId];
    const actor = this.actor;
    const img = action.img || item.img;
    const keywords = { ...item.system.keywords, ...action.keywords };
    // Additional info passed to the html
    const info = {
      usage: action.usage,
      damaging: action.damaging,
      damage: action.damage?.dmgTxt,
      effort: action.effort,
      duration: action.duration,
      effect: action.effect,
      keywords: keywords,
      range: action.range,
      prepTime: action.prepTime,
    };
    const html = await handlebars.renderTemplate(
      "systems/pars-crucis/templates/chat/use-action.hbs",
      { itemName: item.name, actionName: action.name, img, info },
    );

    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: actor }),
      content: html,
    });
  }

  static async switchLuckOnClick(_, target) {
    const dataset = target.dataset;
    const luckBooleans = this.actor.system.luck.booleans;
    const index = dataset.luckIndex;
    luckBooleans[index] = !luckBooleans[index];
    this.actor.update({ "system.luck.booleans": luckBooleans });
  }

  static async equipItemOnClick(_, target) {
    const dataset = target.dataset;
    const item = this.actor.items.get(dataset.itemId);
    if (this.actor.isOwner)
      return item.update({ ["system.details.equipped"]: dataset.equip });
  }

  static async toggleAbilityExpand(_, target) {
    const item = this.actor.items.get(target.dataset.itemId);
    const current = item.getFlag("pars-crucis", "expanded") ?? false;
    item.setFlag("pars-crucis", "expanded", !current);
  }

  // Renders item sheet if owner
  static async editItemOnClick(_, target) {
    const item = this.actor.items.get(target.dataset.itemId);
    if (this.actor.isOwner) item.sheet.render(true);
  }

  static async actionPicker(_, target) {
    const { acId, itemId } = target.dataset;
    const { actor } = this;
    const { weaponry, vest, accessories, gear } = actor.system;
    const gearArray = [...weaponry, ...vest, ...accessories, ...gear];
    const attackChoices = gearArray
      .map((item) => {
        const actions = getItemActionsByType(item, "attack");
        return Object.keys(actions).length ? { item, actions } : null;
      })
      .filter(Boolean);

    new ActionPicker({
      document: actor,
      choices: attackChoices,
      acId: acId,
      itemId: itemId,
    })?.render(true);
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

  static async changeSortMode(_, target) {
    const dataset = target.dataset;
    const actor = this.document;
    actor.setFlag("pars-crucis", dataset.group, dataset.sortMode);
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
}

function getItemActionsByType(item, type) {
  return Object.fromEntries(
    Object.entries(item.system.actions).filter(
      ([_, action]) => action.type === type,
    ),
  );
}

function craftFlavor({ skill, acType, difficulty, acSubtype }) {
  const testLabel = `${game.i18n.localize("PC.testOf")}`;
  const skillLabel = `${game.i18n.localize(PC.skills[skill].label)}`;
  let flavor = `${testLabel} ${skillLabel}`;
  if (acType === "test") {
    const difLabel = `${game.i18n.localize("PC.difficulty.label")}`;
    flavor += ` — ${difLabel} ${difficulty || 0}`;
    return flavor;
  }
  if (["attack", "tech"].includes(acType) && acSubtype) {
    const versusLabel = `${game.i18n.localize("PC.versus")}`;
    const counter = PC.versus[acSubtype];
    const counterAttLabel = game.i18n.localize(`PC.attributes.${counter}.abv`);
    flavor += ` — ${versusLabel} ${counterAttLabel}`;
    return flavor;
  }
  return flavor;
}

function sumKwVal(a, b) {
  const na = Number(a);
  const nb = Number(b);
  const aIsNum = Number.isFinite(na);
  const bIsNum = Number.isFinite(nb);
  if (aIsNum && bIsNum) return `+${na + nb}`;
  return a;
}

function lowestKwVal(a, b) {
  const na = Number(a);
  const nb = Number(b);
  const aIsNum = Number.isFinite(na);
  const bIsNum = Number.isFinite(nb);
  if (aIsNum && bIsNum) return Math.min(na, nb);
  return a;
}

// Should be called only when a keyword is present in both set A and set B
function keywordMerger(a, b, key) {
  switch (key) {
    case "lethality":
      const aIsDiv = a === "/2";
      const bIsDiv = b === "/2";
      const na = Number(a);
      const nb = Number(b);
      const aIsNum = Number.isFinite(na);
      const bIsNum = Number.isFinite(nb);
      if (aIsDiv && bIsDiv) return "/2";
      if (aIsNum && bIsNum) return `+${na + nb}`;
      if ((aIsNum && bIsDiv) || (aIsDiv && bIsNum)) {
        const n = aIsNum ? na : nb;
        const result = (1 + n) / 2 - 1;
        return result > 0 ? `+${result}` : undefined;
      }
      return a;
    case "handling":
    case "modifier":
    case "plague":
      return sumKwVal(a, b);
    case "fragile":
    case "freezing":
    case "impact":
      return lowestKwVal(a, b);
    default:
      return a;
  }
}

export function keywordResolver(kwSetA, kwSetB) {
  const keywords = {};
  const keys = new Set([...Object.keys(kwSetA), ...Object.keys(kwSetB)]);

  for (const key of keys) {
    const a = kwSetA[key];
    const b = kwSetB[key];
    if (a !== undefined && b === undefined) {
      keywords[key] = a;
      continue;
    }
    if (a === undefined && b !== undefined) {
      keywords[key] = b;
      continue;
    }
    // Exists in both sets, verify merge rules
    keywords[key] = keywordMerger(a, b, key);
  }

  // Remove undefined keywords, they should always have a value or be null
  for (const key of Object.keys(keywords)) {
    if (keywords[key] === undefined) {
      delete keywords[key];
    }
  }

  return keywords;
}
