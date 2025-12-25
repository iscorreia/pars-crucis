import { PC } from "../config.mjs";

const {
  EmbeddedDataField,
  BooleanField,
  NumberField,
  SchemaField,
  StringField,
  TypedObjectField,
} = foundry.data.fields;

export class ActionModel extends foundry.abstract.DataModel {
  static defineSchema() {
    return {
      name: new StringField({ initial: "" }),
      type: new StringField({
        initial: "attack",
        choices: ["attack", "direct", "test"], // create EXECUTION LOGIC FOR THE TYPE
        required: true,
      }),
      effect: new StringField({ initial: "" }),
      range: new StringField({ initial: "" }),
      effort: new StringField({ initial: "0" }),
      prepTime: new StringField({ initial: "" }),
      duration: new StringField({ initial: "" }),
      keywords: new TypedObjectField(
        new NumberField({ initial: null, nullable: true }),
        {}
      ),
      _id: new StringField({}),
      // ATTACK|TEST-only
      skill: new StringField({
        nullable: true,
        choices: () => Object.keys(PC.skills),
      }),
      // ATTACK-only
      subtype: new StringField({
        nullable: true,
        choices: () => Object.keys(PC.action.types.attack.subtypes),
      }),
      // TEST-only
      difficulty: new NumberField({ nullable: true }),
    };
  }
}

export class AbilityModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      info: new SchemaField({
        subtype: new StringField({ initial: "power" }),
        art: new StringField({ initial: null, nullable: true }),
        category: new StringField({ initial: null, nullable: true }),
      }),
      actions: new TypedObjectField(new EmbeddedDataField(ActionModel), {
        validateKey: (key) => foundry.data.validators.isValidId(key),
        initial: {},
      }),
      details: new SchemaField({
        experience: new NumberField({ initial: 2, integer: true }),
        preRequisites: new StringField({ initial: "" }),
        keywords: new TypedObjectField(
          new NumberField({ initial: null, nullable: true }),
          {}
        ),
      }),
      description: description(),
    };
  }
}

export class GearModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      info: information(),
      cost: itemCost(),
      details: details(),
      description: description(),
    };
  }
}

export class PassiveModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      info: new SchemaField({
        subtype: new StringField({ initial: "benefit" }),
        acquirement: new StringField({ initial: "natural" }),
      }),
      cost: new SchemaField({
        experience: new NumberField({
          initial: null,
          integer: true,
          nullable: true,
        }),
        points: new NumberField({
          initial: null,
          integer: true,
          nullable: true,
        }),
      }),
      description: description(),
    };
  }
}

export class WeaponModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      info: information({ subtype: "melee", group: "light" }),
      actions: new TypedObjectField(new EmbeddedDataField(ActionModel), {
        validateKey: (key) => foundry.data.validators.isValidId(key),
        initial: {},
      }),
      cost: itemCost(),
      details: details({ equippable: true }),
      description: description(),
    };
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

function details({
  stackable = false,
  equippable = false,
  stack = 1,
  extraFields = null,
} = {}) {
  const fields = {
    load: new NumberField({ initial: 1 }),
    stack: new NumberField({ initial: stack }),
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
    description: new StringField({ initial: "" }),
    shortDescription: new StringField({ initial: "" }),
    notes: new StringField({ initial: "" }),
  });
}
