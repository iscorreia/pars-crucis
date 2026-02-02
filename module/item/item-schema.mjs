import { PC } from "../config.mjs";
import { currencyField } from "../actor/persona.mjs";

const {
  ArrayField,
  BooleanField,
  FilePathField,
  HTMLField,
  NumberField,
  SchemaField,
  StringField,
  TypedObjectField,
  TypedSchemaField,
} = foundry.data.fields;
const { DataModel, TypeDataModel } = foundry.abstract;

export class ActionModel extends DataModel {
  static get TYPES() {
    return {
      attack: AttackActionModel,
      tech: TechActionModel,
      test: TestActionModel,
      use: UseActionModel,
    };
  }
  static defineSchema() {
    return {
      img: new FilePathField({
        initial: "icons/svg/d10-grey.svg",
        categories: ["IMAGE"],
        nullable: true,
      }),
      name: new StringField({ initial: null, nullable: true }),
      type: new StringField({
        initial: "attack",
        choices: ["attack", "use", "test", "tech"], // required to get TYPES
        required: true,
      }),
      damaging: new BooleanField({ initial: false }),
      damage: damage(),
      usesAmmo: new BooleanField({ initial: false }),
      effect: new StringField({ initial: "" }),
      range: new StringField({ initial: "" }),
      effort: new StringField({ initial: "" }),
      prepTime: new StringField({ initial: "" }),
      duration: new StringField({ initial: "" }),
      keywords: keywords(),
      _id: new StringField({}),
    };
  }
}

export class AttackActionModel extends ActionModel {
  static defineSchema() {
    const parentSchema = super.defineSchema();
    return {
      ...parentSchema,
      skill: new StringField({
        initial: "briga",
        choices: () => Object.keys(PC.skills),
      }),
      subtype: new StringField({
        initial: "melee",
        choices: () => Object.keys(PC.action.types.attack.subtypes),
      }),
    };
  }
}

export class TestActionModel extends ActionModel {
  static defineSchema() {
    const parentSchema = super.defineSchema();
    return {
      ...parentSchema,
      skill: new StringField({
        initial: "briga",
        choices: () => Object.keys(PC.skills),
      }),
      difficulty: new NumberField({ initial: 10, integer: true }),
    };
  }
}

export class UseActionModel extends ActionModel {
  static defineSchema() {
    const parentSchema = super.defineSchema();
    return {
      ...parentSchema,
      usage: new StringField({ initial: "", nullable: true }),
    };
  }
}

export class TechActionModel extends ActionModel {
  static defineSchema() {
    const parentSchema = super.defineSchema();
    return {
      ...parentSchema,
      damage: damage({ damageType: "inherit" }),
      skill: new StringField({
        initial: "inherit",
        choices: () => Object.keys(PC.techSkills),
      }),
      subtype: new StringField({
        initial: "inherit",
        choices: () => Object.keys(PC.techSubtypes),
      }),
      _gearAcId: new StringField({ initial: null, nullable: true }),
      _gearId: new StringField({ initial: null, nullable: true }),
    };
  }
}

export class AmmoModel extends TypeDataModel {
  static defineSchema() {
    return {
      info: information({ subtype: "ammo", group: "arrow" }),
      details: details({ stackable: true, stack: 20 }),
      damage: damage(),
      effect: new StringField({ initial: "" }),
      cost: itemCost(),
      keywords: keywords(),
      description: description(),
    };
  }
}

export class AbilityModel extends TypeDataModel {
  static defineSchema() {
    return {
      info: new SchemaField({
        subtype: new StringField({ initial: "power" }),
        art: new StringField({ initial: "meleeTech", nullable: true }),
        category: new StringField({ initial: null, nullable: true }),
      }),
      actions: new TypedObjectField(new TypedSchemaField(ActionModel.TYPES)),
      details: new SchemaField({
        experience: new NumberField({ initial: 2, integer: true }),
        preRequisites: new StringField({ initial: "" }),
        coreSkill: new StringField({ initial: "briga" }),
        coreLevel: new NumberField({ initial: 1, integer: true }),
      }),
      keywords: keywords(),
      description: description(),
    };
  }

  prepareDerivedData() {
    const info = this.info;
    const art = info.art;
    if (!PC.ability.arts[art].categories) {
      info.category = null;
    } else if (!(info.category in PC.ability.arts[art].categories)) {
      info.category = "unknown";
    }
  }
}

export class GearModel extends TypeDataModel {
  static defineSchema() {
    return {
      info: information(),
      actions: new TypedObjectField(new TypedSchemaField(ActionModel.TYPES)),
      cost: itemCost(),
      details: details(),
      keywords: keywords(),
      description: description(),
    };
  }
}

export class PassiveModel extends TypeDataModel {
  static defineSchema() {
    return {
      info: new SchemaField({
        subtype: new StringField({ initial: "benefit" }),
        acquirement: new StringField({ initial: "natural" }),
      }),
      cost: new SchemaField({
        experience: currencyField(),
        points: currencyField(),
      }),
      keywords: keywords(),
      description: description(),
    };
  }
}

export class WeaponModel extends TypeDataModel {
  static defineSchema() {
    return {
      info: information({ subtype: "melee", group: "light" }),
      actions: new TypedObjectField(new TypedSchemaField(ActionModel.TYPES)),
      cost: itemCost(),
      details: details({ equippable: true }),
      keywords: keywords(),
      description: description(),
      hasAmmo: new BooleanField({ initial: false }),
      ammoInfo: new SchemaField({
        type: new StringField({ initial: "arrow" }),
        loaded: new NumberField({
          initial: 0,
          integer: true,
          nullable: false,
        }),
        capacity: new NumberField({
          initial: null,
          integer: true,
          nullable: true,
        }),
        _ammoId: new StringField({ initial: null, nullable: true }),
      }),
    };
  }

  prepareDerivedData() {
    const info = this.info;
    const details = this.details;
    const subtype = info.subtype;
    const groups = PC.weapon.subtypes[subtype].groups;
    if (!(info.group in groups)) {
      info.group = Object.keys(groups)[0] ?? "exotic";
    }
    if (info.group === "unarmed") {
      details.equippable = false;
      details.equipped = true;
    }
  }
}

function itemCost() {
  const fields = {
    price: new NumberField({ initial: 0, integer: true, nullable: true }),
    currency: new StringField({ initial: "silver" }),
  };

  return new SchemaField(fields);
}

function information({
  subtype = "item",
  group = "utility",
  quality = "common",
} = {}) {
  const fields = {
    subtype: new StringField({ initial: subtype }),
    group: new StringField({ initial: group }),
    subgroup: new StringField({ initial: null, nullable: true }),
    quality: new StringField({ initial: quality }),
  };

  return new SchemaField(fields);
}

function damage({ damageType = "phy" } = {}) {
  return new SchemaField({
    dmgBase: new NumberField({ initial: 0, integer: true }),
    dmgAttributes: new ArrayField(new StringField(), { initial: [] }),
    dmgAttMultiplier: new NumberField({ initial: 1 }),
    dmgAddition: new StringField({ initial: "" }),
    scalable: new BooleanField({ initial: true }),
    dmgType: new StringField({ initial: damageType }),
    dmgSubtype: new StringField({ initial: "" }),
  });
}

function keywords() {
  return new TypedObjectField(
    new StringField({ initial: null, nullable: true }),
    {},
  );
}

function details({
  stackable = false,
  equippable = false,
  stackMax = 1,
  extraFields = null,
} = {}) {
  const fields = {
    slots: new NumberField({ initial: 1, integer: true, nullable: true }),
    stack: new NumberField({ initial: 1, integer: true }),
    stackMax: new NumberField({ initial: stackMax, integer: true }),
    stackable: new BooleanField({ initial: stackable }),
    equippable: new BooleanField({ initial: equippable }),
    equipped: new BooleanField({ initial: false }),
  };

  if (extraFields && typeof extraFields === "object") {
    Object.assign(fields, extraFields);
  }

  return new SchemaField(fields);
}

function description() {
  return new SchemaField({
    description: new HTMLField(),
    summary: new StringField({ initial: "" }),
    notes: new StringField({ initial: "" }),
  });
}
