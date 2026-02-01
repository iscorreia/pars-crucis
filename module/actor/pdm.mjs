import { PC } from "../config.mjs";
import {
  calculateStatic,
  currencyField,
  eachAttribute,
  handleGearAbilities,
  luckBooleans,
} from "./persona.mjs";

const {
  ArrayField,
  BooleanField,
  HTMLField,
  NumberField,
  SchemaField,
  StringField,
} = foundry.data.fields;

export class PDMModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const skills = {};

    for (let [key, skill] of Object.entries(PC.skills)) {
      skills[key] = PDMskillField(skill);
    }

    return {
      info: new SchemaField({
        info1: new StringField({ initial: null, nullable: true }),
        info2: new StringField({ initial: null, nullable: true }),
        info3: new StringField({ initial: null, nullable: true }),
        background: new HTMLField(),
      }),

      challenge: new NumberField({ initial: 50, integer: true }),

      currency: new SchemaField({
        silver: currencyField(),
        copper: currencyField(),
      }),

      attributes: new SchemaField({
        fis: PDMattributeField(),
        des: PDMattributeField(),
        ego: PDMattributeField(),
        cog: PDMattributeField(),
        esp: PDMattributeField(),
        def: PDMattributeField(),
      }),

      movement: new SchemaField({
        walk: PDMattributeField(),
        sprint: PDMattributeField(),
      }),

      subattributes: new SchemaField({
        pv: PDMsubField(),
        pe: PDMsubField(),
      }),

      luck: new SchemaField({
        current: new NumberField({ initial: 0, integer: true, min: 0 }),
        max: new NumberField({ initial: 0, integer: true }),
        booleans: new ArrayField(new BooleanField(), { initial: [] }),
      }),

      minors: new SchemaField({
        sau: PDMattributeField(),
        ref: PDMattributeField(),
        von: PDMattributeField(),
      }),

      mitigation: new SchemaField({
        armor: PDMmitigationField(),
        robust: PDMmitigationField(),
        insulant: PDMmitigationField(),
        abascant: PDMmitigationField(),
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
        meleeCombat: new SchemaField({
          mod: new NumberField({ initial: 0, integer: true }),
        }),
        rangedCombat: new SchemaField({
          mod: new NumberField({ initial: 0, integer: true }),
        }),
        supernatural: new SchemaField({
          mod: new NumberField({ initial: 0, integer: true }),
        }),
      }),

      skills: new SchemaField(skills),
    };
  }

  prepareDerivedData() {
    const parent = this.parent;
    const attributesData = this.attributes;
    eachAttribute(attributesData, PDMderiveAttribute);
    eachAttribute(attributesData, calculateStatic);

    const minorsData = this.minors;
    eachAttribute(minorsData, PDMderiveAttribute);

    const { pv, pe } = this.subattributes;
    if (pv.max) pv.value = Math.max(Math.min(pv.value, pv.max), 0);
    if (pe.max) pe.value = Math.max(Math.min(pe.value, pe.max), 0);
    // Calculate percent
    pv.percent = (100 * pv.value) / pv.max;
    pe.percent = (100 * pe.value) / pe.max;

    // Filter items by group, uses the helper actor#itemTypes
    // Gear|Weapon items are set into their specific groups once equipped
    // Otherwise they're assigned to [gear]
    const accGroup = ["accessory", "gadget"];
    const inventoryGroup = ["weapon", "gear"];
    this.abilities = parent.itemTypes.ability;
    this.ammo = parent.itemTypes.ammo;
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
    // const weaponry = this.weaponry;
    const {
      abilities: abilitiesData,
      ammo: ammoData,
      weaponry,
      vest: vestData,
      accessories: accData,
      gear: gearData,
      passives: passivesData,
    } = this;
    const wearData = [...vestData, ...accData];
    const itemGroup = [
      ...abilitiesData,
      ...ammoData,
      ...weaponry,
      ...vestData,
      ...accData,
      ...gearData,
    ];

    // ABILITIES and GEAR derived calculations
    handleGearAbilities(itemGroup, attributesData, parent.items);

    // LUCK handling!
    const luckData = this.luck;
    luckBooleans(luckData);
  }
}

function PDMskillField(skill, { nullableSkill = true } = {}) {
  return new SchemaField({
    level: new NumberField({
      initial: null,
      integer: true,
      min: 0,
      nullable: nullableSkill,
    }),
    mod: new NumberField({ initial: 0, integer: true }),
    attribute: new StringField({ initial: skill.att }),
    category: new StringField({ initial: skill.cat }),
    modGroup: new StringField({
      initial: skill.modGroup || null,
      nullable: true,
    }),
  });
}

function PDMattributeField({ extraFields = null } = {}) {
  const fields = {
    base: new NumberField({ initial: null, integer: true, nullable: true }),
    mod: new NumberField({ initial: 0, integer: true, nullable: true }),
  };

  if (extraFields && typeof extraFields === "object") {
    Object.assign(fields, extraFields);
  }

  return new SchemaField(fields);
}

function PDMmitigationField({} = {}) {
  return new SchemaField({
    base: new NumberField({ initial: 0, integer: true, nullable: false }),
    mod: new NumberField({ initial: 0, integer: true, nullable: false }),
  });
}

function PDMsubField() {
  return new SchemaField({
    value: new NumberField({ initial: null, integer: true, min: 0 }),
    max: new NumberField({ initial: null, integer: true, min: 0 }),
  });
}

function PDMderiveAttribute(att) {
  const derivedAtt = Number(att.override ?? att.base ?? null);
  att.derived = derivedAtt;

  // It's not working as intended, need to revise
  if (att.mod !== null && typeof att.mod !== "number") {
    att.mod = 0;
  }

  return att;
}
