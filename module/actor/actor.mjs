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
    const { skills, techSubtype, type } = action;
    if (!skills || !techSubtype || !type) return;
    const techKeywords = keywordResolver(item.system.keywords, action.keywords);
    const { selectedAction, selectedItem } = action;
    if (!selectedAction || !selectedItem) return;
    const { usesAmmo } = selectedAction;
    const { hasAmmo, ammoInfo } = selectedItem.system;
    const ammunition = ammoInfo?._ammoId
      ? this.items.get(ammoInfo._ammoId)
      : null;
    // If tech is executed with action that uses ammo
    // And either of the following statements fail, return
    // Else, consumes ammo an reduces loaded ammo (if loaded)
    if (usesAmmo && !ammunition) return;
    if (usesAmmo && hasAmmo && ammunition) {
      if (
        (ammoInfo.loaded === 0 && ammoInfo.capacity > 0) ||
        ammunition.system.details.stack === 0
      )
        return;
      consumeAmmo(ammoInfo, ammunition, selectedItem);
    }
    const srcKeywords = keywordResolver(
      selectedItem.system.keywords,
      selectedAction.keywords,
    );
    let keywords = keywordResolver(techKeywords, srcKeywords);
    if (ammunition) {
      keywords = keywordResolver(keywords, ammunition.system.keywords);
    }
    const bestSkill = await getBestSkillData(this.system, skills);
    const compiledModifiers =
      bestSkill.modifiers +
      (Number(keywords?.handling) || 0) +
      (Number(keywords?.modifier) || 0);
    const formula = `${dice} + ${bestSkill.level || 0} + ${compiledModifiers || 0}`;
    const flavor = craftFlavor({
      skill: bestSkill.skillId,
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
      ...(ammunition && {
        withAmmo: { img: ammunition.img, name: ammunition.name },
      }),
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
    const { difficulty, skills, subtype, type, usesAmmo } = action;
    const { hasAmmo, ammoInfo } = item.system;
    // If action requires ammo but item doesn't accept ammo, return
    if (usesAmmo && !hasAmmo) return;
    const ammunition = ammoInfo?._ammoId
      ? this.items.get(ammoInfo._ammoId)
      : null;
    // Has ammo but could not get the ammo data, return
    if (hasAmmo && !ammunition) return;
    // If tech is executed with action that uses ammo
    // And either of the following statements fail, return
    // Else, consumes ammo an reduces loaded ammo (if loaded)
    if (usesAmmo) {
      if (
        (ammoInfo.loaded === 0 && ammoInfo.capacity > 0) ||
        ammunition.system.details.stack === 0
      )
        return;
      consumeAmmo(ammoInfo, ammunition, item);
    }
    const bestSkill = await getBestSkillData(this.system, skills);
    let keywords = keywordResolver(item.system.keywords, action.keywords);
    if (ammunition) {
      keywords = keywordResolver(keywords, ammunition.system.keywords);
    }
    const compiledModifiers =
      bestSkill.modifiers +
      (Number(keywords?.handling) || 0) +
      (Number(keywords?.modifier) || 0);
    const formula = `${dice} + ${bestSkill.level || 0} + ${compiledModifiers || 0}`;
    const flavor = craftFlavor({
      skill: bestSkill.skillId,
      acType: type,
      acSubtype: subtype,
      difficulty,
    });
    // Additional information passed to the roll
    const info = {
      ...(ammunition && {
        withAmmo: { img: ammunition.img, name: ammunition.name },
      }),
      subtype: action.subtype,
      damaging: action.damaging,
      damage: action.damage?.dmgTxt,
      effort: action.effort,
      duration: action.duration,
      effect: action.effect,
      keywords,
      range: action.range,
      area: action.area,
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
    const { usesAmmo } = action;
    const { hasAmmo, ammoInfo } = item.system;
    if (usesAmmo && hasAmmo && ammoInfo._ammoId) {
      const ammunition = this.items.get(ammoInfo._ammoId);
      if (
        (ammoInfo.loaded === 0 && ammoInfo.capacity > 0) ||
        ammunition.system.details.stack === 0
      )
        return;
      consumeAmmo(ammoInfo, ammunition, item);
    }
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
      area: action.area,
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
  let flavor = `${game.i18n.localize("PC.test")}`;
  if (skill) {
    const testLabel = `${game.i18n.localize("PC.testOf")}`;
    const skillLabel = `${game.i18n.localize(PC.skills[skill].label)}`;
    flavor = `${testLabel} ${skillLabel}`;
  }
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

async function consumeAmmo(ammoInfo, ammunition, item) {
  const details = ammunition.system.details;
  const itemLoad = ammoInfo.loaded > 0 ? ammoInfo.loaded - 1 : 0;
  const ammoStack = details.stack > 0 ? details.stack - 1 : 0;
  if (ammunition.system.info.group !== "dynamo") {
    await item.update({ ["system.ammoInfo.loaded"]: itemLoad });
    await ammunition.update({ ["system.details.stack"]: ammoStack });
  }
}

async function getBestSkillData(system, skills) {
  if (!skills || Object.keys(skills).length === 0) {
    return {
      skillId: null,
      level: 0,
      modifiers: 0,
      total: 0,
    };
  }
  let best = null;
  for (const skillId of Object.keys(skills)) {
    const skill = system.skills[skillId];
    if (!skill) continue;
    const { category, modGroup, level, mod } = skill;
    const categoryMod = system.categoryModifiers?.[category] ?? 0;
    const groupMod = modGroup
      ? (system.groupModifiers?.[modGroup]?.mod ?? 0)
      : 0;
    const modifiers = categoryMod + groupMod + mod;
    const total = level + modifiers;
    if (!best || total > best.total)
      best = { skillId, level, modifiers, total };
  }
  return (
    best ?? {
      skillId: null,
      level: 0,
      modifiers: 0,
      total: 0,
    }
  );
}
