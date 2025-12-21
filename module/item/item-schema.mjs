import { PC } from "../config.mjs";

const { ArrayField, BooleanField, NumberField, SchemaField, StringField } =
  foundry.data.fields;

export class AbilityModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      info: new SchemaField({
        subtypes: new StringField({ initial: "power" }),
        art: new StringField({ initial: null, nullable: true }),
        category: new StringField({ initial: null, nullable: true }),
      }),
      actions: new ArrayField(action(), { initial: [] }),
      details: new SchemaField({
        experience: new NumberField({ initial: 2, integer: true }),
        preRequisites: new StringField({ initial: "" }),
        esoteric: new BooleanField({ initial: false }),
        properties: new ArrayField(property(), { initial: [] }),
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
      actions: new ArrayField(action(), { initial: [] }),
      cost: itemCost(),
      details: details({ equippable: true }),
      description: description(),
    };
  }
}

function action() {
  return new SchemaField({
    label: new StringField({ initial: "" }),
    type: new StringField({
      initial: "test",
      choices: ["attack", "direct", "test"], // create EXECUTION LOGIC FOR THE TYPE
      required: true,
    }),
    effect: new StringField({ initial: "" }),
    range: new StringField({ initial: "" }),
    effort: new StringField({ initial: 0 }),
    duration: new StringField({ initial: "" }),
    properties: new ArrayField(property(), { initial: [] }),
    skill: new StringField({
      nullable: true,
      choices: () => Object.keys(PC.skills),
    }),

    // ATTACK-only
    attackType: new StringField({
      nullable: true,
      choices: () => Object.keys(PC.attackTypes),
    }),

    // TEST-only
    difficulty: new NumberField({ nullable: true }),
  });
}

function property() {
  return new SchemaField({
    key: new StringField({ required: true }),
    value: new NumberField({ initial: null, nullable: true }),
  });
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
