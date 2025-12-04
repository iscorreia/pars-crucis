import { PersonaModel } from "./module/actor/persona.mjs";
import { PersonaSheet } from "./module/actor/persona-sheet.mjs";

Hooks.once("init", () => {
  console.log("PARS CRUCIS | Initializing system");

  // Register the data model for the Actor subtype.
  Object.assign(CONFIG.Actor.dataModels, {
    persona: PersonaModel,
  });

  // Register the V2 sheet for 'persona'
  DocumentSheetConfig.registerSheet(
    foundry.documents.Actor,
    "parscrucis",
    PersonaSheet,
    {
      types: ["persona"],
      makeDefault: true,
      label: "Persona Sheet",
    }
  );
});
