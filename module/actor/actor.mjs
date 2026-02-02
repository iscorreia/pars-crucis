const { handlebars } = foundry.applications;
import { PC } from "../config.mjs";
import PCRoll from "../rolls/basic-roll.mjs";
import TestRoll from "../rolls/test-roll.mjs";
import { keywordResolver } from "../utils.mjs";

const defaultSight = {
  enabled: true,
  range: 0.5,
  angle: 360,
  visionMode: "darkvision",
  // Advanced options
  attenuation: 0,
  brightness: 0,
  saturation: -1,
  contrast: 0,
  color: null,
};

/**
 * System-wide Actor document class.
 * Used to apply default prototype token configuration for actor types.
 * @extends { Actor }
 */
export class PCActor extends foundry.documents.Actor {
  /** @override */
  async _preCreate(data, options, user) {
    const allowed = await super._preCreate(data, options, user);
    if (allowed === false) return false;

    const type = data.type;
    if (!isParsCrucisActorType(type)) return;

    const expectedActorLink = expectedActorLinkForType(type);

    const updates = {
      prototypeToken: {
        actorLink: expectedActorLink,
        sight: { ...defaultSight },
        displayBars: CONST.TOKEN_DISPLAY_MODES.HOVER,
        bar1: {
          attribute: "subattributes.pv",
        },
        bar2: {
          attribute: "subattributes.pe",
        },
      },
    };

    this.updateSource(updates);
  }

  async equipGear(equip, itemId) {
    const item = this.items.get(itemId);
    const group = item.system.info.group;
    const vest = this.system.vest;
    if (this.isOwner) {
      if (group === "vest" && vest.length > 0) {
        const wearing = this.items.get(vest[0].id);
        await wearing.update({ ["system.details.equipped"]: false });
      }
      return item.update({ ["system.details.equipped"]: equip });
    }
  }

  async rollAttribute(attribute, type, dice) {
    const { derived, mod } = this.system[type][attribute];
    const formula = `${dice} + ${derived} + ${mod}`;
    const testLabel = `${game.i18n.localize("PC.testOf")}`;
    const attLabel = `${game.i18n.localize(PC[type][attribute].label)}`;
    const flavor = `${testLabel} ${attLabel}`;
    const roll = new PCRoll(formula, {}, { flavor });
    await roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      rollMode: game.settings.get("core", "rollMode"),
    });
    return roll;
  }

  async rollSkill(skill, dice) {
    const { category, modGroup, level, mod } = this.system.skills[skill];
    const groupMod = modGroup ? this.system.groupModifiers[modGroup].mod : 0;
    const catMod = this.system.categoryModifiers[category];
    const formula = `${dice} + ${level} + ${mod + catMod + groupMod}`;
    const flavor = craftFlavor({ skill });
    const roll = new PCRoll(formula, {}, { flavor });
    await roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      rollMode: game.settings.get("core", "rollMode"),
    });
    return roll;
  }

  async rollTech(itemId, acId, dice) {
    const item = this.items.get(itemId);
    if (!item) return;
    const action = item.system.actions[acId];
    if (!action) return;
    const { techSkill, techSubtype, type } = action;
    if (!techSkill || !techSubtype || !type) return;
    const { category, modGroup, level, mod } = this.system.skills[techSkill];
    const techKeywords = keywordResolver(item.system.keywords, action.keywords);
    const { selectedAction, selectedItem } = action;
    if (!selectedAction || !selectedItem) return;
    const srcKeywords = keywordResolver(
      selectedItem.system.keywords,
      selectedAction.keywords,
    );
    const keywords = keywordResolver(techKeywords, srcKeywords);
    const catMod = this.system.categoryModifiers[category];
    const groupMod = modGroup ? this.system.groupModifiers[modGroup].mod : 0;
    const modifiers =
      mod +
      catMod +
      groupMod +
      (Number(keywords?.handling) || 0) +
      (Number(keywords?.modifier) || 0);
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
      withItem,
      subtype: action.techSubtype,
      damaging: action.damaging,
      damage: action.damage?.dmgTxt,
      effort: action.effort,
      duration: action.duration,
      effect: action.effect,
      keywords,
      range: action.range,
      prepTime: action.prepTime,
    };
    // Important options passed to the roll
    const RollOptions = {
      flavor,
      img: action.img || item.img,
      itemName: item.name,
      actionName: action.name,
      info,
      type,
    };
    // Create the Test Roll
    const roll = new TestRoll(formula, {}, RollOptions);
    await roll.evaluate();
    await roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      rollMode: game.settings.get("core", "rollMode"),
    });
    return roll;
  }

  async rollTest(itemId, acId, dice) {
    const item = this.items.get(itemId);
    if (!item) return;
    const action = item.system.actions[acId];
    if (!action) return;
    const { difficulty, skill, subtype, type, usesAmmo } = action;
    const { hasAmmo, ammo } = item.system;
    if (usesAmmo && hasAmmo && ammo._ammoId) {
      const ammunition = this.items.get(ammo._ammoId);
      const details = ammunition.system.details;
      const { stack } = details;
      if ((ammo.loaded === 0 && ammo.capacity > 0) || stack === 0) return;
      const itemLoad = ammo.loaded > 0 ? (ammo.loaded -= 1) : 0;
      const ammoStack = stack > 0 ? (details.stack -= 1) : 0;
      await item.update({ ["system.ammo.loaded"]: itemLoad });
      await ammunition.update({ ["system.details.stack"]: ammoStack });
    }
    const { category, modGroup, level, mod } = this.system.skills[skill];
    const keywords = keywordResolver(item.system.keywords, action.keywords);
    const catMod = this.system.categoryModifiers[category];
    const groupMod = modGroup ? this.system.groupModifiers[modGroup].mod : 0;
    const modifiers =
      mod +
      catMod +
      groupMod +
      (Number(keywords?.handling) || 0) +
      (Number(keywords?.modifier) || 0);
    const formula = `${dice} + ${level || 0} + ${modifiers || 0}`;
    const flavor = craftFlavor({
      skill,
      acType: type,
      acSubtype: subtype,
      difficulty,
    });
    // Additional information passed to the roll
    const info = {
      subtype: action.subtype,
      damaging: action.damaging,
      damage: action.damage?.dmgTxt,
      effort: action.effort,
      duration: action.duration,
      effect: action.effect,
      keywords,
      range: action.range,
      prepTime: action.prepTime,
    };
    // Important options passed to the roll
    const RollOptions = {
      flavor,
      difficulty,
      img: action.img || item.img,
      itemName: item.name,
      actionName: action.name,
      info,
      type,
    };
    // Create roll
    const roll = new TestRoll(formula, {}, RollOptions);
    await roll.evaluate();
    await roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      rollMode: game.settings.get("core", "rollMode"),
    });
    return roll;
  }

  async useGearOrAbility(itemId, acId) {
    const item = this.items.get(itemId);
    if (!item) return;
    const action = item.system.actions[acId];
    if (!action) return;
    const img = action.img || item.img;
    const keywords = keywordResolver(item.system.keywords, action.keywords);
    // Information passed to the html context
    const info = {
      usage: action.usage,
      damaging: action.damaging,
      damage: action.damage?.dmgTxt,
      effort: action.effort,
      duration: action.duration,
      effect: action.effect,
      keywords,
      range: action.range,
      prepTime: action.prepTime,
    };
    const html = await handlebars.renderTemplate(
      "systems/pars-crucis/templates/chat/use-action.hbs",
      { itemName: item.name, actionName: action.name, img, info },
    );
    // Create message on chat
    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      content: html,
    });
  }
}

function isParsCrucisActorType(type) {
  return type === "persona" || type === "pdm";
}

function expectedActorLinkForType(type) {
  // Persona: linked token. PDM: unlinked token.
  return type === "persona";
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
