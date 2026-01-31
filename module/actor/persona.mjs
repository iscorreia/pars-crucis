import { PC } from "../config.mjs";
import { ORIGINS } from "../data/origins.mjs";
import { CULTURES } from "../data/cultures.mjs";
import { keywordResolver } from "../utils.mjs";

const {
  ArrayField,
  BooleanField,
  HTMLField,
  NumberField,
  SchemaField,
  StringField,
} = foundry.data.fields;

export class PersonaModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const skills = {};

    for (let [key, skill] of Object.entries(PC.skills)) {
      skills[key] = skillField(skill);
    }

    return {
      info: new SchemaField({
        origin: new StringField({ initial: "human" }),
        culture: new StringField({ initial: "adv" }),
        subculture: new StringField({ initial: null, nullable: true }),
        persona: new StringField({ initial: "aven" }),
        background: new HTMLField(),
      }),

      experience: new SchemaField({
        current: new NumberField({ initial: 50, integer: true }),
        reserved: new NumberField({ initial: 0, integer: true, min: 0 }),
        total: new NumberField({ initial: 50, integer: true, min: 0 }),
      }),

      currency: new SchemaField({
        silver: currencyField(),
        copper: currencyField(),
      }),

      attributes: new SchemaField({
        fis: attributeField(),
        des: attributeField(),
        ego: attributeField(),
        cog: attributeField(),
        esp: attributeField(),
        def: attributeField(),
      }),

      movement: new SchemaField({
        walk: attributeField({ initialBase: 4, minBase: 0 }),
        sprint: attributeField({ initialBase: 4, minBase: 0 }),
      }),

      subattributes: new SchemaField({
        pv: subField(),
        pe: subField(),
      }),

      luck: new SchemaField({
        current: new NumberField({ initial: 2, integer: true, min: 0 }),
        max: new NumberField({ initial: 2, integer: true }),
        booleans: new ArrayField(new BooleanField(), { initial: [true, true] }),
      }),

      minors: new SchemaField({
        sau: attributeField({
          minBase: 0,
          extraFields: {
            attributes: new ArrayField(new StringField(), {
              initial: ["fis", "ego"],
            }),
          },
        }),
        ref: attributeField({
          minBase: 0,
          extraFields: {
            attributes: new ArrayField(new StringField(), {
              initial: ["des", "cog"],
            }),
          },
        }),
        von: attributeField({
          minBase: 0,
          extraFields: {
            attributes: new ArrayField(new StringField(), {
              initial: ["ego", "esp"],
            }),
          },
        }),
      }),

      mitigation: new SchemaField({
        armor: mitigationField(),
        robust: mitigationField(),
        insulant: mitigationField(),
        abascant: mitigationField(),
      }),

      categoryModifiers: new SchemaField({
        corporais: new NumberField({ initial: 0, integer: true }),
        subterfugios: new NumberField({ initial: 0, integer: true }),
        conhecimentos: new NumberField({ initial: 0, integer: true }),
        oficios: new NumberField({ initial: 0, integer: true }),
        sociais: new NumberField({ initial: 0, integer: true }),
        espirituais: new NumberField({ initial: 0, integer: true }),
      }),

      groupModifiers: new SchemaField({
        meleeCombat: groupField(),
        rangedCombat: groupField(),
        supernatural: groupField(),
      }),

      skills: new SchemaField(skills),

      inventory: new SchemaField({
        slots: new NumberField({ initial: 20, integer: true, min: 0 }),
        occupied: new NumberField({ initial: 0, integer: true }),
      }),
    };
  }

  /** Do derived attribute calculations */
  prepareDerivedData() {
    const abilitiesXp = [];
    const attributesData = this.attributes;
    const attValues = { fis: [], des: [], ego: [], cog: [], esp: [] };
    const combatValue = [];
    const groupModifiers = this.groupModifiers;
    const infoData = this.info;
    const luckData = this.luck;
    const minorsData = this.minors;
    const mitigationData = this.mitigation;
    const mvData = this.movement;
    const parent = this.parent;
    const passivesXp = [];
    const passivesPts = [];
    const skillsData = this.skills;
    const skillsXp = [];
    const { pv, pe } = this.subattributes;
    const xpData = this.experience;

    // Gets a the favorables skills from culture and persona and creates a set
    const cultureFav = CULTURES[infoData.culture].favorables ?? [];
    const personaFav = PC.personas[infoData.persona].favorables ?? [];
    const mergedFav = new Set([...cultureFav, ...personaFav]);
    // const favorables = Array.from(mergedFav); // In case an Array is needed

    // SKILLS handling!
    for (let [key, sk] of Object.entries(skillsData)) {
      if (!Number.isFinite(sk.mod)) sk.mod = 0;

      // Calculates the attribute value based on a specific skill level.
      sk.attValue = Math.ceil(sk.level / sk.growth);
      attValues[sk.attribute].push(sk.attValue);

      // Calculates the XP spent on a specific skill base on its level.
      sk.xpSpent = 0;
      for (let e = sk.learning; e < sk.level + sk.learning; e++) {
        sk.xpSpent += e - (sk.favored ? 1 : 0);
      }
      sk.favored && (sk.xpDiscount = sk.level);
      skillsXp.push(sk.xpSpent);

      // Flags skills as favorable
      sk.favorable = mergedFav.has(key);
    }

    for (let [key, group] of Object.entries(groupModifiers)) {
      const groupLevels = [];
      for (let sk of PC[key].skills) {
        groupLevels.push(skillsData[sk].level);
      }
      group.level = Math.max(...groupLevels);
    }

    // ATTRIBUTES handling!
    const origin = ORIGINS[infoData.origin];
    for (let [key, att] of Object.entries(attributesData)) {
      if (key !== "def") {
        att.base =
          Math.max(...attValues[key]) +
          att.adjust +
          (origin.attributes[key] || 0);
      }
      if (key === "def") {
        for (let mcsk of PC.meleeCombat.skills) {
          const { level, mod } = skillsData[mcsk];
          const combatSkValue = level + mod;
          combatValue.push(combatSkValue);
        }
      }
    }

    eachAttribute(attributesData, deriveAttribute);
    eachAttribute(attributesData, calculateStatic);

    // MINORS handling!
    for (let [_, minor] of Object.entries(minorsData)) {
      const attributes = minor.attributes;
      const minorBase =
        ((attributesData[attributes[0]].derived || 0) +
          (attributesData[attributes[1]].derived || 0)) /
        2;
      minor.base = Math.ceil(minorBase) + minor.adjust;
    }

    eachAttribute(minorsData, deriveAttribute);

    // Sets DEFENSE value
    const refDef = minorsData.ref.derived + minorsData.ref.mod;
    attributesData.def.base =
      Math.max(...combatValue, refDef) +
      attributesData.def.adjust +
      (origin.attributes.def || 0);

    deriveAttribute(attributesData.def);
    calculateStatic(attributesData.def);

    // SUBATTRIBUTES handling
    pv.max = this.maxStatus("pv", "fis", "ego", "resis");
    pe.max = this.maxStatus("pe", "esp", "cog", "amago");
    if (pv.max) pv.value = Math.max(Math.min(pv.value, pv.max), 0);
    if (pe.max) pe.value = Math.max(Math.min(pe.value, pe.max), 0);
    pv.percent = (100 * pv.value) / pv.max;
    pe.percent = (100 * pe.value) / pe.max;

    mvData.walk.base = origin.attributes.mv + mvData.walk.adjust || 4;
    mvData.sprint.base =
      (mvData.walk.override || mvData.walk.base) +
      mvData.sprint.adjust +
      2 +
      Math.ceil(Math.max(skillsData.atlet.level, skillsData.agili.level) / 2);

    // Filter items by group, uses the helper actor#itemTypes
    // Gear|Weapon items are set into their specific groups once equipped
    // Otherwise they're assigned to [gear]
    const accGroup = ["accessory", "gadget"];
    const inventoryGroup = ["weapon", "gear"];
    this.abilities = parent.itemTypes.ability;
    const abilitiesData = this.abilities;
    this.weaponry = parent.itemTypes.weapon.filter(
      (i) => i.system.details.equipped || i.system.info.group === "unarmed",
    );
    this.vest = parent.itemTypes.gear.filter(
      (i) => i.system.details.equipped && i.system.info.group === "vest",
    );
    this.accessories = parent.itemTypes.gear.filter(
      (i) =>
        i.system.details.equipped && accGroup.includes(i.system.info.group),
    );
    this.gear = parent.items.filter((i) => {
      return inventoryGroup.includes(i.type) && !i.system.details.equipped;
    });
    this.passives = parent.itemTypes.passive;
    const passivesData = this.passives;
    // const weaponry = this.weaponry;
    const { abilities, weaponry, vest, accessories, gear } = this;
    const wear = [...vest, ...accessories];
    const itemGroup = [
      ...abilities,
      ...weaponry,
      ...vest,
      ...accessories,
      ...gear,
    ];

    // INVENTORY handling!
    // Max capacity: 20 + FIS (derived + mod)
    const inventoryData = this.inventory;
    inventoryData.slots =
      20 + (attributesData.fis?.derived ?? 0) + (attributesData.fis?.mod ?? 0);
    inventoryData.occupied = this.gear.reduce((acc, item) => {
      const { stack, stackMax, slots, stackable } = item.system?.details ?? {};
      const weight = stackable
        ? Math.ceil((stack ?? 0) / Math.max(stackMax || 1, 1))
        : (slots ?? 1);
      return acc + weight;
    }, 0);

    // ABILITIES and GEAR derived calculations
    handleGearAbilities(itemGroup, attributesData, parent.items);

    // PASSIVES handling!
    for (let passive of passivesData) {
      const system = passive.system;
      const cost = system.cost;
      if (system.info.acquirement === "learned") {
        passivesXp.push(cost.experience);
      } else {
        passivesPts.push(
          system.info.subtype === "drawback" ? cost.points : -cost.points,
        );
      }
    }
    xpData.ptsSum = passivesPts.reduce((acc, value) => acc + value, 0);

    // ABILITIES and GEAR derived calculations
    handleGearAbilities(itemGroup, attributesData, parent.items);

    // MITIGATION derived calculations
    const mitValues = wear.reduce(
      (acc, equipment) => {
        const { armor, robust, insulant, abascant } =
          equipment.system.keywords ?? {};
        const mitSum = (keyword, value) => {
          const n = Number(value);
          if (Number.isFinite(n)) acc[keyword] += n;
        };
        mitSum("armor", armor);
        mitSum("robust", robust);
        mitSum("insulant", insulant);
        mitSum("abascant", abascant);
        return acc;
      },
      { armor: 0, robust: 0, insulant: 0, abascant: 0 },
    );
    for (const [key, mitigation] of Object.entries(mitigationData)) {
      mitigation.base = mitValues[key] + mitigation.adjust;
    }

    // ABILITIES handling!
    const starterArts = {};
    for (let ability of abilitiesData) {
      abilitiesXp.push(ability.system.details.experience);
      // Checks for starter abilities
      if ("starter" in ability.system.keywords) {
        const art = ability.system.info.art;
        starterArts[art] = true;
      }
    }
    // Calculates XP discount once for each art with at least one starter ability
    const startersDiscount = Object.keys(starterArts).length * -2;

    // EXPERIENCE handling!
    xpData.abilitiesXpSum = abilitiesXp.reduce((acc, value) => acc + value, 0);
    xpData.skillsXpSum = skillsXp.reduce((acc, value) => acc + value, 0);
    xpData.passivesXpSum = passivesXp.reduce((acc, value) => acc + value, 0);
    xpData.current =
      xpData.total -
      xpData.abilitiesXpSum -
      xpData.skillsXpSum -
      startersDiscount -
      xpData.passivesXpSum -
      xpData.reserved;

    // LUCK handling!
    luckBooleans(luckData);
  }

  maxStatus(subatt, mainAtt, secAtt, skill) {
    const max =
      25 +
      2 * this.attributes[mainAtt].derived +
      this.attributes[secAtt].derived +
      2 * this.skills[skill].level +
      this.subattributes[subatt].adjust;

    return max;
  }
}

export function luckBooleans(luck) {
  let luckBooleans = luck.booleans.length;
  luck.max < 0 ? (luck.max = 0) : luck.max;

  // Increments or decrements luck based on changes to {luck.max}
  if (luck.max > luckBooleans) {
    for (let i = luckBooleans; i < luck.max; i++) luck.booleans.push(true);
  } else if (luck.max < luckBooleans) {
    for (let i = luckBooleans; i > luck.max; i--) {
      let idx = luck.booleans.indexOf(true);
      if (idx === -1) idx = luck.booleans.indexOf(false);
      if (idx !== -1) luck.booleans.splice(idx, 1);
    }
  }

  // Updates the current luck value
  luck.current = luck.booleans.filter(Boolean).length;

  return luck;
}

function attributeField({
  initialBase = 0,
  minBase = -3,
  extraFields = null,
} = {}) {
  const fields = {
    base: new NumberField({
      initial: initialBase,
      integer: true,
      min: minBase,
    }),
    mod: new NumberField({ initial: 0, integer: true }),
    override: new NumberField({ initial: null, integer: true, nullable: true }),
    adjust: new NumberField({ initial: 0, integer: true }),
  };

  if (extraFields && typeof extraFields === "object") {
    Object.assign(fields, extraFields);
  }

  return new SchemaField(fields);
}

function mitigationField() {
  return new SchemaField({
    base: new NumberField({ initial: 0, integer: true }),
    override: new NumberField({ initial: null, integer: true, nullable: true }),
    adjust: new NumberField({ initial: 0, integer: true }),
  });
}

function subField() {
  return new SchemaField({
    value: new NumberField({ initial: 0, integer: true, min: 0 }),
    max: new NumberField({ initial: 0, integer: true }),
    override: new NumberField({ initial: null, integer: true, nullable: true }),
    adjust: new NumberField({ initial: 0, integer: true }),
  });
}

export function currencyField() {
  return new NumberField({
    initial: null,
    integer: true,
    min: 0,
    nullable: true,
  });
}

function skillField(skill, { nullableSkill = false } = {}) {
  return new SchemaField({
    level: new NumberField({
      initial: 0,
      integer: true,
      min: 0,
      nullable: nullableSkill,
    }),
    mod: new NumberField({ initial: 0, integer: true }),
    favored: new BooleanField({ initial: false }),
    learning: new NumberField({ initial: skill.learning }),
    growth: new NumberField({ initial: skill.growth }),
    attribute: new StringField({ initial: skill.att }),
    category: new StringField({ initial: skill.cat }),
    modGroup: new StringField({
      initial: skill.modGroup || null,
      nullable: true,
    }),
  });
}

function groupField() {
  return new SchemaField({
    mod: new NumberField({ initial: 0, integer: true }),
    level: new NumberField({ initial: 0, integer: true }),
  });
}

export function eachAttribute(objectMap, callback) {
  for (let [key, attribute] of Object.entries(objectMap)) {
    callback(attribute, key);
  }
}

function deriveAttribute(att) {
  const derivedAtt = Number(att.override ?? att.base ?? null);
  att.derived = derivedAtt;

  // It's not working as intended, need to revise
  if (!Number.isFinite(att.mod)) {
    att.mod = 0;
  }

  return att;
}

export function calculateStatic(att) {
  att.static = Math.max(10 + att.derived + att.mod, 10);
  return att;
}

export function handleGearAbilities(itemGroup, attributesData, items) {
  for (let [_, gear] of Object.entries(itemGroup)) {
    const { actions } = gear.system;
    // Calculates equipped gear and abilities damage
    for (let [_, action] of Object.entries(actions)) {
      if (action.damaging && action.type !== "tech") {
        const dmg = action.damage ?? {};
        const attValues = [];
        for (const att of dmg.dmgAttributes) {
          const attValue =
            attributesData[att].derived + attributesData[att].mod;
          attValues.push(attValue);
        }
        const highestDmgAtt = attValues.length > 0 ? Math.max(...attValues) : 0;
        const multipliedDmg = Math.ceil(highestDmgAtt * dmg.dmgAttMultiplier);
        const calculatedDmg = dmg.dmgBase + multipliedDmg;
        const dmgTypeLabel = game.i18n.localize(
          `PC.dmgType.${dmg.dmgType}.abv`,
        );
        action.damage.dmgVal = calculatedDmg;
        action.damage.dmgTxt = `${calculatedDmg}${dmg.dmgAddition} ${dmgTypeLabel}`;
        if (!dmg.scalable) {
          action.damage.dmgTxt = `[${calculatedDmg}${dmg.dmgAddition}] ${dmgTypeLabel}`;
        }
      } else if (action.type === "tech") {
        const selectedItem = items.get(action._gearId);
        const selectedAction = selectedItem?.system.actions[action._gearAcId];
        action.selectedItem = selectedItem ?? null;
        action.selectedAction = selectedAction ?? null;
        action.ready = selectedItem && selectedAction ? true : false;
        action.techKeywords = action.keywords;
        // Once an item attack action is selected, handles necessary data
        if (action.ready) {
          action.techSkill = action.skill;
          action.techSubtype = action.skill;
          if (action.skill === "inherit")
            action.techSkill = selectedAction.skill;
          if (action.subtype === "inherit")
            action.techSubtype = selectedAction.subtype;
          const srcKeywords = keywordResolver(
            selectedItem.system.keywords,
            selectedAction.keywords,
          );
          action.techKeywords = keywordResolver(action.keywords, srcKeywords);
        }
        // Calculates technique damage based on selected item attack action
        if (action.damaging && action.ready) {
          const dmg = action.damage ?? {};
          const srcDmg = selectedAction?.damage ?? {};
          const attValues = [];
          const joinedAtt = [
            ...new Set([...dmg.dmgAttributes, ...srcDmg.dmgAttributes]),
          ];
          for (const att of joinedAtt) {
            const attValue =
              attributesData[att].derived + attributesData[att].mod;
            attValues.push(attValue);
          }
          const highestDmgAtt =
            attValues.length > 0 ? Math.max(...attValues) : 0;
          const multipliedSrcDmg = Math.ceil(
            highestDmgAtt * srcDmg.dmgAttMultiplier,
          );
          const reCalculatedSrcDmg = srcDmg.dmgBase + multipliedSrcDmg;
          const calculatedDmg = reCalculatedSrcDmg + dmg.dmgBase;
          let dmgType = dmg.dmgType;
          if (dmg.dmgType === "inherit") dmgType = srcDmg.dmgType;
          const dmgTypeLabel = game.i18n.localize(`PC.dmgType.${dmgType}.abv`);
          action.damage.dmgTxt = `${calculatedDmg}${srcDmg.dmgAddition}${dmg.dmgAddition} ${dmgTypeLabel}`;
        } else if (action.damaging) {
          action.damage.dmgTxt = `ø`;
        }
      }
    }
  }
}
