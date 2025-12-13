import { PC } from "../config.mjs";
import { ORIGINS } from "../data/origins.mjs";
import { CULTURES } from "../data/cultures.mjs";

const { ArrayField, BooleanField, NumberField, SchemaField, StringField } =
  foundry.data.fields;

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
        persona: new StringField({ initial: "aven" }),
      }),

      experience: new SchemaField({
        current: new NumberField({ initial: 50, integer: true }),
        reserved: new NumberField({ initial: 0, integer: true, min: 0 }),
        total: new NumberField({ initial: 50, integer: true, min: 0 }),
      }),

      attributes: new SchemaField({
        fis: attributeField(),
        des: attributeField(),
        ego: attributeField(),
        cog: attributeField(),
        esp: attributeField(),
      }),

      mv: new SchemaField({
        walk: new NumberField({ initial: 4, integer: true, min: 0 }),
        override: new NumberField({
          initial: null,
          integer: true,
          nullable: true,
        }),
        sprint: new NumberField({ initial: 6, integer: true, min: 0 }),
        sprintOverride: new NumberField({
          initial: null,
          integer: true,
          nullable: true,
        }),
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
      skills: new SchemaField(skills),
    };
  }

  /** Do derived attribute calculations */
  prepareDerivedData() {
    const attributesData = this.attributes;
    const infoData = this.info;
    const luckData = this.luck;
    const minorsData = this.minors;
    const skillsData = this.skills;
    const skillsExp = [];
    const subData = this.subattributes;
    const xpData = this.experience;

    // Gets a the favorables skills from culture and persona and creates a set
    const cultureFav = CULTURES[infoData.culture].favorables ?? [];
    const personaFav = PC.personas[infoData.persona].favorables ?? [];
    const mergedFav = new Set([...cultureFav, ...personaFav]);
    // const favorables = Array.from(mergedFav); // In case an Array is needed

    // SKILLS handling!
    for (let [key, sk] of Object.entries(skillsData)) {
      // Calculates the attribute value based on a specific skill level.
      sk.attValue = Math.ceil(sk.level / sk.growth);

      // Calculates the XP spent on a specific skill base on its level.
      sk.expSpent = 0;
      for (let e = sk.learning; e < sk.level + sk.learning; e++) {
        sk.expSpent += e - (sk.favored ? 1 : 0);
      }
      skillsExp.push(sk.expSpent);

      // Flags skills as favorable
      sk.favorable = mergedFav.has(key);
    }

    // ATTRIBUTES handling!
    for (let [key, att] of Object.entries(attributesData)) {
      const attValueArray = [];
      for (let [_, sk] of Object.entries(skillsData)) {
        if (sk.attribute === key) attValueArray.push(sk.attValue);
      }
      att.base =
        Math.max(...attValueArray) +
        att.adjust +
        (ORIGINS[infoData.origin].attributes[key] || 0);
    }

    eachAttribute(attributesData, deriveAttribute);

    // MINORS handling!
    for (let [_, minor] of Object.entries(minorsData)) {
      const attributes = minor.attributes;
      const minorBase =
        ((attributesData[attributes[0]].derived || 0) +
          (attributesData[attributes[0]].derived || 0)) /
        2;
      minor.base = Math.ceil(minorBase) + minor.adjust;
    }

    eachAttribute(minorsData, deriveAttribute);

    subData.pv.max =
      25 +
      2 * attributesData.fis.derived +
      attributesData.ego.derived +
      2 * skillsData.resis.level +
      subData.pv.adjust;
    subData.pe.max =
      25 +
      attributesData.cog.derived +
      2 * attributesData.esp.derived +
      2 * skillsData.amago.level +
      subData.pe.adjust;

    // Works current pv and pe **MAKE THIS INTO A FUNCTION**
    const pvDerived = Number(subData.pv?.current ?? 0);
    subData.pv.current = Math.min(Math.max(pvDerived, 0), subData.pv.max);
    const peDerived = Number(subData.pe?.current ?? 0);
    subData.pe.current = Math.min(Math.max(peDerived, 0), subData.pe.max);

    // EXPERIENCE handling!
    xpData.skillsExpSum = skillsExp.reduce((acc, value) => acc + value, 0);
    xpData.current = xpData.total - xpData.skillsExpSum - xpData.reserved;

    // LUCK handling!
    luckBooleans(luckData);
  }

  /**
   * Prepare data for dice rolls
   * @returns {Object} Data object for use in roll formulas
   */

  // DOESN'T SEEM TO BE CALLED ANYWHERE
  getRollData() {
    const data = {};

    // Add attribute values to roll data
    Object.keys(this.attributes).forEach((key) => {
      const att = this.attributes[key];
      const mod = att.mod ?? 0;
      data[`att_${key}`] = att.derived + mod;
    });

    // Add minor attributes
    Object.keys(this.minors).forEach((key) => {
      const minor = this.minors[key];
      const mod = minor.mod ?? 0;
      data[`minor_${key}`] = minor.derived + mod;
    });

    return data;
  }
}

function luckBooleans(luck) {
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

function subField() {
  return new SchemaField({
    current: new NumberField({ integer: true, min: 0 }),
    override: new NumberField({ initial: null, integer: true, nullable: true }),
    adjust: new NumberField({ initial: 0, integer: true }),
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
  });
}

function eachAttribute(objectMap, callback) {
  for (let [key, attribute] of Object.entries(objectMap)) {
    callback(attribute, key);
  }
}

function deriveAttribute(att) {
  const derivedAtt = Number(att.override ?? att.base ?? null);
  att.derived = derivedAtt;

  // It's not working as intended, need to revise
  if (typeof att.mod !== "number") {
    att.mod = 0;
  }

  return att;
}
