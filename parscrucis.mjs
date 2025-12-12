import { PC } from "./module/config.mjs";
import { PersonaModel } from "./module/actor/persona.mjs";
import { PersonaSheet } from "./module/actor/persona-sheet.mjs";
import { ParsCrucisItemSheet } from "./module/item/item-sheet.mjs";
import {
  AbilityModel,
  GearModel,
  PassiveModel,
  WeaponModel,
} from "./module/item/item-schema.mjs";

async function preloadHandlebarsTemplates() {
  const templatePaths = [
    "systems/pars-crucis/templates/actor/blocks/attributes.hbs",
    "systems/pars-crucis/templates/actor/blocks/experience.hbs",
    "systems/pars-crucis/templates/actor/blocks/minors.hbs",
    "systems/pars-crucis/templates/actor/blocks/mitigation.hbs",
    "systems/pars-crucis/templates/item/parts/header.hbs",
    "systems/pars-crucis/templates/item/parts/description.hbs",
    "systems/pars-crucis/templates/item/parts/details.hbs",
  ];

  return foundry.applications.handlebars.loadTemplates(templatePaths);
}

Hooks.once("init", () => {
  console.log("PARS CRUCIS | Initializing system");

  CONFIG.PC = PC;

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
    {
      types: ["persona"],
      makeDefault: true,
      label: "Persona Sheet",
    }
  );

  // Register the V2 sheet for all item types
  foundry.applications.apps.DocumentSheetConfig.registerSheet(
    foundry.documents.Item,
    "parscrucis",
    ParsCrucisItemSheet,
    {
      types: ["ability", "gear", "passive", "weapon"],
      makeDefault: true,
      label: "Item Sheet",
    }
  );

  preloadHandlebarsTemplates();
});
