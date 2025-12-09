import { PC } from "../config.mjs";

export class PersonaModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const { NumberField, SchemaField } = foundry.data.fields;
    const skills = {};

    for (let [key, skill] of Object.entries(PC.skill)) {
      skills[key] = skillField(skill);
    }

    return {
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
        pv: new SchemaField({
          value: new NumberField({ integer: true, min: 0 }),
          override: new NumberField({
            initial: null,
            integer: true,
            nullable: true,
          }),
        }),
        pe: new SchemaField({
          value: new NumberField({ integer: true, min: 0 }),
          override: new NumberField({
            initial: null,
            integer: true,
            nullable: true,
          }),
        }),
      }),

      minors: new SchemaField({
        sau: attributeField({ minBase: 0 }),
        ref: attributeField({ minBase: 0 }),
        von: attributeField({ minBase: 0 }),
      }),
      skills: new SchemaField(skills),
    };
  }

  /** Do derived attribute calculations */
  prepareDerivedData() {
    const attributesData = this.attributes;
    const xpData = this.experience;
    const skillsData = this.skills;
    const skillsExp = [];

    // SKILLS handling!
    for (let [_, sk] of Object.entries(skillsData)) {
      // Calculates the attribute value based on a specific skill level.
      sk.attValue = Math.ceil(sk.level / sk.growth);

      // Calculates the XP spent on a specific skill base on its level.
      sk.expSpent = 0;
      for (let e = sk.learning; e < sk.level + sk.learning; e++) {
        sk.expSpent += e - (sk.favored ? 1 : 0);
        skillsExp.push(sk.expSpent);
      }
    }

    // ATTRIBUTES handling!
    for (let [key, att] of Object.entries(attributesData)) {
      const attValueArray = [];
      for (let [_, sk] of Object.entries(skillsData)) {
        if (sk.attribute === key) attValueArray.push(sk.attValue);
      }
      att.base = Math.max(...attValueArray);
    }

    eachAttribute(attributesData, deriveAttribute);
    eachAttribute(this.minors, deriveAttribute);

    this.subattributes.pv.max =
      25 +
      2 * attributesData.fis.derived +
      attributesData.ego.derived +
      2 * skillsData.resis.level;
    this.subattributes.pe.max =
      25 +
      attributesData.cog.derived +
      2 * attributesData.esp.derived +
      2 * skillsData.amago.level;

    // Works current pv and pe **MAKE THIS INTO A FUNCTION**
    const pvDerived = Number(this.subattributes.pv?.value ?? 0);
    this.subattributes.pv.value = Math.min(
      Math.max(pvDerived, 0),
      this.subattributes.pv.max
    );
    const peDerived = Number(this.subattributes.pe?.value ?? 0);
    this.subattributes.pe.value = Math.min(
      Math.max(peDerived, 0),
      this.subattributes.pe.max
    );

    // EXPERIENCE handling!
    xpData.skillsExpSum = skillsExp.reduce((acc, value) => acc + value, 0);
    xpData.current = xpData.total - xpData.skillsExpSum;

    // console.log(this)
  }

  /**
   * Prepare data for dice rolls
   * @returns {Object} Data object for use in roll formulas
   */
  getRollData() {
    const data = {};
    
    // Add attribute values to roll data
    Object.keys(this.attributes).forEach(key => {
      const attr = this.attributes[key];
      const base = attr.override ?? attr.base ?? 0;
      const mod = attr.mod ?? 0;
      data[`attr_${key}`] = base + mod;
    });
    
    // Add minor attributes
    Object.keys(this.minors).forEach(key => {
      const minor = this.minors[key];
      const base = minor.override ?? minor.base ?? 0;
      const mod = minor.mod ?? 0;
      data[`minor_${key}`] = base + mod;
    });
    
    return data;
  }
}

function attributeField({ initialBase = 0, minBase = -3 } = {}) {
  const { NumberField, SchemaField } = foundry.data.fields;

  return new SchemaField({
    base: new NumberField({
      initial: initialBase,
      integer: true,
      min: minBase,
    }),
    mod: new NumberField({ initial: 0, integer: true }),
    override: new NumberField({ initial: null, integer: true, nullable: true }),
  });
}

function skillField(skill, { nullableSkill = false } = {}) {
  const { BooleanField, NumberField, SchemaField, StringField } =
    foundry.data.fields;

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
  if (typeof att.mod !== "number") att.mod = 0;

  return att;
}
