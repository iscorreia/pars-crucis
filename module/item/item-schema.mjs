const { NumberField, SchemaField, StringField } = foundry.data.fields;

export class AbilityModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      details: details(),
    };
  }
}

export class GearModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      details: details(),
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
      details: details(),
    };
  }
}

export class WeaponModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      details: details(),
    };
  }
}

function details() {
  return new SchemaField({
    description: new StringField({ initial: "" }),
    shortDescription: new StringField({ initial: "" }),
    notes: new StringField({ initial: "" }),
  });
}
