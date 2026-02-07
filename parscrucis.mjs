import { PC } from "./module/config.mjs";
import { PDMModel } from "./module/actor/pdm.mjs";
import { PDMSheet } from "./module/actor/pdm-sheet.mjs";
import { PCActor } from "./module/actor/actor.mjs";
import { PersonaModel } from "./module/actor/persona.mjs";
import { PersonaSheet } from "./module/actor/persona-sheet.mjs";
import { PCChatMessage } from "./module/chat/chat-message.mjs";
import { registerFonts } from "./module/fonts.mjs";
import PassiveSheet from "./module/item/passive-sheet.mjs";
import AbilitySheet from "./module/item/ability-sheet.mjs";
import WeaponSheet from "./module/item/weapon-sheet.mjs";
import GearSheet from "./module/item/gear-sheet.mjs";
import {
  AbilityModel,
  AmmoModel,
  GearModel,
  PassiveModel,
  WeaponModel,
} from "./module/item/item-schema.mjs";
import PCRoll from "./module/rolls/basic-roll.mjs";
import TestRoll from "./module/rolls/test-roll.mjs";
import onRenderChatMessageHTML from "./hooks/onRenderChatMessageHTML.mjs";
import handleMacroCreation from "./hooks/handleMacroCreation.mjs";
import AmmoSheet from "./module/item/ammo-sheet.mjs";

async function preloadHandlebarsTemplates() {
  const templatePaths = [
    "systems/pars-crucis/templates/actor/partials/attributes.hbs",
    "systems/pars-crucis/templates/actor/partials/currency.hbs",
    "systems/pars-crucis/templates/actor/partials/experience.hbs",
    "systems/pars-crucis/templates/actor/partials/inline-action.hbs",
    "systems/pars-crucis/templates/actor/partials/items.hbs",
    "systems/pars-crucis/templates/actor/partials/list-action.hbs",
    "systems/pars-crucis/templates/actor/partials/list-ammo.hbs",
    "systems/pars-crucis/templates/actor/partials/list-tech-action.hbs",
    "systems/pars-crucis/templates/actor/partials/minors.hbs",
    "systems/pars-crucis/templates/actor/partials/mitigation.hbs",
    "systems/pars-crucis/templates/actor/partials/vest.hbs",
    "systems/pars-crucis/templates/actor/partials/weaponry.hbs",
    "systems/pars-crucis/templates/actor/pdm/challenge.hbs",
    "systems/pars-crucis/templates/item/partials/name-cost.hbs",
    "systems/pars-crucis/templates/partials/pc-keyword.hbs",
    "systems/pars-crucis/templates/partials/pc-sec-keyword.hbs",
  ];

  return foundry.applications.handlebars.loadTemplates(templatePaths);
}

Hooks.once("init", () => {
  console.log("PARS CRUCIS | Initializing system");

  registerFonts();

  CONFIG.PC = PC;
  CONFIG.Dice.rolls = [PCRoll, TestRoll];
  CONFIG.ChatMessage.documentClass = PCChatMessage;
  CONFIG.Actor.documentClass = PCActor;

  // Register the data model for the Actor subtype.
  Object.assign(CONFIG.Actor.dataModels, {
    persona: PersonaModel,
    pdm: PDMModel,
  });

  // Register the data model for the Item subtype.
  Object.assign(CONFIG.Item.dataModels, {
    ability: AbilityModel,
    gear: GearModel,
    passive: PassiveModel,
    weapon: WeaponModel,
    ammo: AmmoModel,
  });

  // Register the V2 sheet for 'persona'
  foundry.applications.apps.DocumentSheetConfig.registerSheet(
    foundry.documents.Actor,
    "parscrucis",
    PersonaSheet,
    { types: ["persona"], makeDefault: true, label: "Persona Sheet" },
  );
  // Register the V2 sheet for 'pdm' - persona de mestre
  foundry.applications.apps.DocumentSheetConfig.registerSheet(
    foundry.documents.Actor,
    "parscrucis",
    PDMSheet,
    { types: ["pdm"], makeDefault: true, label: "PDM Sheet" },
  );

  // Register the V2 sheet for all item types
  foundry.applications.apps.DocumentSheetConfig.registerSheet(
    foundry.documents.Item,
    "parscrucis",
    AbilitySheet,
    { types: ["ability"], makeDefault: true, label: "Ability Item Sheet" },
  );
  foundry.applications.apps.DocumentSheetConfig.registerSheet(
    foundry.documents.Item,
    "parscrucis",
    AmmoSheet,
    { types: ["ammo"], makeDefault: true, label: "Ammo Item Sheet" },
  );
  foundry.applications.apps.DocumentSheetConfig.registerSheet(
    foundry.documents.Item,
    "parscrucis",
    GearSheet,
    { types: ["gear"], makeDefault: true, label: "Gear Item Sheet" },
  );
  foundry.applications.apps.DocumentSheetConfig.registerSheet(
    foundry.documents.Item,
    "parscrucis",
    PassiveSheet,
    { types: ["passive"], makeDefault: true, label: "Passive Item Sheet" },
  );
  foundry.applications.apps.DocumentSheetConfig.registerSheet(
    foundry.documents.Item,
    "parscrucis",
    WeaponSheet,
    { types: ["weapon"], makeDefault: true, label: "Weapon Item Sheet" },
  );

  preloadHandlebarsTemplates();

  Handlebars.registerHelper("lt", (a, b) => Number(a) < Number(b));
  Handlebars.registerHelper("gt", (a, b) => Number(a) > Number(b));
  Handlebars.registerHelper("lte", (a, b) => Number(a) <= Number(b));
  Handlebars.registerHelper("gte", (a, b) => Number(a) >= Number(b));
  Handlebars.registerHelper("isEmpty", (value) => {
    if (value == null) return true;
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === "object") return Object.keys(value).length === 0;
    return false;
  });
  Handlebars.registerHelper("hasKey", function (obj, key) {
    if (!obj || typeof obj !== "object") return false;
    return Object.prototype.hasOwnProperty.call(obj, key);
  });

  /**
   * Set an initiative formula for the system
   * Formula: 1d10 + Reflexo (derived) + Reflexo (modifiers)
   * @type {Object}
   */
  CONFIG.Combat.initiative = {
    formula: "1d10 + @minors.ref.derived + @minors.ref.mod",
  };
});

Hooks.once("ready", async function () {
  Hooks.on("hotbarDrop", (bar, data, slot) => {
    if (data.action || ["Actor", "Item"].includes(data.type)) {
      handleMacroCreation(bar, data, slot);
      return false;
    }
  });
  console.log("PARS CRUCIS | System ready!");
});

onRenderChatMessageHTML();
