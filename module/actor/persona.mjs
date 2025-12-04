export class PersonaModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const { NumberField, SchemaField } = foundry.data.fields;
    return {
      // attributes: new field.EmbeddedDataField(),
      fis: attributeField(),
      des: attributeField(),
      ego: attributeField(),
      cog: attributeField(),
      esp: attributeField(),
      mv: new SchemaField({
        walk: new NumberField({ initial: 4, integer: true, min: 0 }),
        sprint: new NumberField({ initial: 6, integer: true, min: 0 })
      }),
      pv: new SchemaField({
        value: new NumberField({ integer: true, min: 0 }),
        override: new NumberField({ initial: null, integer: true, nullable: true })
      }),
      pe: new SchemaField({
        value: new NumberField({ integer: true, min: 0 }),
        override: new NumberField({ initial: null, integer: true, nullable: true })
      }),
      sau: attributeField({ minBase: 0 }),
      ref: attributeField({ minBase: 0 }),
      von: attributeField({ minBase: 0 })
    };
  }

  /** Do derived attribute calculations */
  prepareDerivedData() {
    const fisDerived = deriveAttribute(this.fis)
    const desDerived = deriveAttribute(this.des)
    const egoDerived = deriveAttribute(this.ego)
    const cogDerived = deriveAttribute(this.cog)
    const espDerived = deriveAttribute(this.esp)

    this.pv.max = 25 + 2 * fisDerived + egoDerived;
    this.pe.max = 25 + cogDerived + 2 * espDerived;

    // Works current pv and pe **MAKE THIS INTO A FUNCTION**
    // Needs to also increase the PV|PE value when they are increased by attribute | skill increments
    const pvDerived = Number(this.pv?.value ?? 0)
    this.pv.value = Math.min(Math.max(pvDerived, 0), this.pv.max);
    const peDerived = Number(this.pe?.value ?? 0)
    this.pe.value = Math.min(Math.max(peDerived, 0), this.pe.max);

    console.log(this)
  }
}

function deriveAttribute(attribute) {
  return Number(attribute.override ?? attribute.base ?? null)
}

function attributeField({ initialBase = 0, minBase = -3 } = {}) {
  const { NumberField, SchemaField } = foundry.data.fields;

  return new SchemaField({
    base: new NumberField({ initial: initialBase, integer: true, min: minBase }),
    mod: new NumberField({ initial: 0, integer: true }),
    override: new NumberField({ initial: null, integer: true, nullable: true })
  })
}


