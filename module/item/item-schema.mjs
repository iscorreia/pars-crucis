import { PC } from "../config.mjs";

const {
  EmbeddedDataField,
  BooleanField,
  FilePathField,
  HTMLField,
  NumberField,
  SchemaField,
  StringField,
  TypedObjectField,
} = foundry.data.fields;

export class ActionModel extends foundry.abstract.DataModel {
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
        choices: ["attack", "use", "test"], // create EXECUTION LOGIC FOR THE TYPE
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
        art: new StringField({ initial: "meleeTech", nullable: true }),
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
        coreSkill: new StringField({ initial: "none" }),
        coreLevel: new NumberField({ initial: 1, integer: true }),
      }),
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
        experience: currencyField(),
        points: currencyField(),
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
    for (let [key, ac] of Object.entries(this.actions)) {
      if (ac.type === "attack") {
        ac.difficulty = null;
      } else if (ac.type === "test") {
        ac.subtype = null;
      } else if (ac.type === "use") {
        ac.skill = null;
        ac.subtype = null;
        ac.difficulty = null;
      }
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

function currencyField() {
  return new NumberField({
    initial: null,
    integer: true,
    nullable: true,
  });
}

function description() {
  return new SchemaField({
    description: new HTMLField(),
    shortDescription: new StringField({ initial: "" }),
    notes: new StringField({ initial: "" }),
  });
}
