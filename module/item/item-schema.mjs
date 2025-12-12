const field = foundry.data.fields;

export class AbilityModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      description: new field.StringField({ initial: "" }),
    };
  }
}

export class GearModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      description: new field.StringField({ initial: "" }),
    };
  }
}

export class PassiveModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      description: new field.StringField({ initial: "" }),
    };
  }
}

export class WeaponModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      description: new field.StringField({ initial: "" }),
    };
  }
}


