import { PC } from "./module/config.mjs";
import { PersonaModel } from "./module/actor/persona.mjs";
import { PersonaSheet } from "./module/actor/persona-sheet.mjs";
import { registerFonts } from "./module/fonts.mjs";
import PassiveSheet from "./module/item/passive-sheet.mjs";
import AbilitySheet from "./module/item/ability-sheet.mjs";
import WeaponSheet from "./module/item/weapon-sheet.mjs";
import GearSheet from "./module/item/gear-sheet.mjs";
import {
  AbilityModel,
  GearModel,
  PassiveModel,
  WeaponModel,
} from "./module/item/item-schema.mjs";
import PCRoll from "./module/rolls/basic-roll.mjs";

async function preloadHandlebarsTemplates() {
  const templatePaths = [
    "systems/pars-crucis/templates/actor/blocks/attributes.hbs",
    "systems/pars-crucis/templates/actor/blocks/experience.hbs",
    "systems/pars-crucis/templates/actor/blocks/minors.hbs",
    "systems/pars-crucis/templates/actor/blocks/mitigation.hbs",
    "systems/pars-crucis/templates/item/parts/description.hbs",
  ];

  return foundry.applications.handlebars.loadTemplates(templatePaths);
}

Hooks.once("init", () => {
  console.log("PARS CRUCIS | Initializing system");

  registerFonts();
  CONFIG.PC = PC;

  CONFIG.Dice.rolls = [PCRoll];

  // Register the data model for the Actor subtype.
  Object.assign(CONFIG.Actor.dataModels, {
    persona: PersonaModel,
  });

  // Register the data model for the Item subtype.
  Object.assign(CONFIG.Item.dataModels, {
    ability: AbilityModel,
    gear: GearModel,
    passive: PassiveModel,
    weapon: WeaponModel,
  });

  // Register the V2 sheet for 'persona'
  foundry.applications.apps.DocumentSheetConfig.registerSheet(
    foundry.documents.Actor,
    "parscrucis",
    PersonaSheet,
    { types: ["persona"], makeDefault: true, label: "Persona Sheet" }
  );

  // Register the V2 sheet for all item types
  foundry.applications.apps.DocumentSheetConfig.registerSheet(
    foundry.documents.Item,
    "parscrucis",
    AbilitySheet,
    { types: ["ability"], makeDefault: true, label: "Ability Item Sheet" }
  );
  foundry.applications.apps.DocumentSheetConfig.registerSheet(
    foundry.documents.Item,
    "parscrucis",
    GearSheet,
    { types: ["gear"], makeDefault: true, label: "Gear Item Sheet" }
  );
  foundry.applications.apps.DocumentSheetConfig.registerSheet(
    foundry.documents.Item,
    "parscrucis",
    PassiveSheet,
    { types: ["passive"], makeDefault: true, label: "Passive Item Sheet" }
  );
  foundry.applications.apps.DocumentSheetConfig.registerSheet(
    foundry.documents.Item,
    "parscrucis",
    WeaponSheet,
    { types: ["weapon"], makeDefault: true, label: "Weapon Item Sheet" }
  );

  preloadHandlebarsTemplates();

  /**
   * Set an initiative formula for the system
   * Formula: 1d10 + Reflexo (derived) + Reflexo (modifiers)
   * @type {Object}
   */
  CONFIG.Combat.initiative = {
    formula: "1d10 + @minors.ref.derived + @minors.ref.mod",
  };
});
