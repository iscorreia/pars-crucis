import { PC } from "../config.mjs";

export class PersonaModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const { NumberField, SchemaField } = foundry.data.fields;
    const skills = {};

    for (let [key, skill] of Object.entries(PC.skill)) {
      skills[key] = skillField(skill);
    }

    return {
      // attributes: new field.EmbeddedDataField(),
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
    eachAttribute(this.attributes, deriveAttribute);
    eachAttribute(this.minors, deriveAttribute);
    const att = this.attributes;

    this.pv.max = 25 + 2 * att.fis.derived + att.ego.derived;
    this.pe.max = 25 + att.cog.derived + 2 * att.esp.derived;

    // Works current pv and pe **MAKE THIS INTO A FUNCTION**
    const pvDerived = Number(this.pv?.value ?? 0);
    this.pv.value = Math.min(Math.max(pvDerived, 0), this.pv.max);
    const peDerived = Number(this.pe?.value ?? 0);
    this.pe.value = Math.min(Math.max(peDerived, 0), this.pe.max);

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
  for (let [_, attribute] of Object.entries(objectMap)) {
    callback(attribute);
  }
}

function deriveAttribute(attribute) {
  const deviredAttribute = Number(attribute.override ?? attribute.base ?? null);
  return (attribute.derived = deviredAttribute);
}
