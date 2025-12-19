const { BooleanField, NumberField, SchemaField, StringField } =
  foundry.data.fields;

export class AbilityModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      description: description(),
    };
  }
}

export class GearModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      info: new SchemaField({
        subtype: new StringField({}),
        group: new StringField({}),
        subgroup: new StringField({}),
        quality: new StringField({ initial: "common" }),
      }),
      cost: new SchemaField({
        price: new NumberField({ initial: 0, integer: true, nullable: true }),
        currency: new StringField({ initial: "silver" }),
      }),
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
      details: details(),
      description: description(),
    };
  }
}

function details({ stackable = false, equippable = false, stack = 1 } = {}) {
  const fields = {
    load: new NumberField({ initial: 1 }),
    stack: new SchemaField({ initial: stack }),
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
