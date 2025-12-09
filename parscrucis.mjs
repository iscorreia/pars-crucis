import { PC } from "./module/config.mjs";
import { PersonaModel } from "./module/actor/persona.mjs";
import { PersonaSheet } from "./module/actor/persona-sheet.mjs";

async function preloadHandlebarsTemplates() {
  const templatePaths = [
    "systems/pars-crucis/templates/actor/blocks/attributes.hbs",
    "systems/pars-crucis/templates/actor/blocks/experience.hbs",
    "systems/pars-crucis/templates/actor/blocks/minors.hbs",
    "systems/pars-crucis/templates/actor/blocks/mitigation.hbs",
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

  preloadHandlebarsTemplates();
});
