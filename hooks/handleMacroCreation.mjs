import { PC } from "../module/config.mjs";

/**
 * Handle macro creation, called from the hotbarDrop hook
 * @param {Hotbar} bar - The hotbar related information
 * @param {dataset} data - The dataset transfered from the draggable element
 * @param {slot} slot - The slot number where the draggable was dropped
 */

export default async function (bar, data, slot) {
  console.log("data:", data);
  const { action, acId, uuid, itemId } = data;
  const document = await fromUuid(uuid);
  if (!document) return;
  console.log(document);
  const { documentName, name, img } = document;
  let macro;

  if (action === "rollSkill") {
    const actor = await fromUuid(uuid);
    if (!actor) return;
    const skill = data.skill;
    const skillFlavor = `${game.i18n.localize(PC.skills[skill].label)}`;
    const name = `${actor.name}: ${skillFlavor}`;
    const command = `
      const actor = await fromUuid("${uuid}");
      if (!actor) return;
      actor.rollSkill("${skill}", "2d10");
    `;
    macro = game.macros.contents.find((m) => m.command === command);
    if (!macro) {
      macro = await Macro.create(
        { name, type: "script", img: actor.img, command },
        { displaySheet: false },
      );
    }
  }

  if (
    ["rollAttack", "rollAbilityAttack", "rollTech", "rollTest"].includes(action)
  ) {
    const item = await fromUuid(uuid);
    if (!item) return;
    const actor = item?.parent;
    if (!actor) return;
    const itemAction = item.system.actions[acId];
    if (!itemAction) return;
    const name = `${actor.name}: ${item.name} — ${itemAction.name}`;
    const img = itemAction.img || item.img;
    let command =
      action !== "rollTech"
        ? `const item = await fromUuid("${uuid}");
          if (!item) return;
          const actor = game.actors.get(item.parent?.id);
          if (!actor) return;
          const action = item.system.actions["${acId}"];
          if (!action) return;
          actor.rollTest("${itemId}", "${acId}", "2d10");`
        : `const item = await fromUuid("${uuid}");
          if (!item) return;
          const actor = game.actors.get(item.parent?.id);
          if (!actor) return;
          const action = item.system.actions["${acId}"];
          if (!action) return;
          actor.rollTech("${itemId}", "${acId}", "2d10");`;
    macro = game.macros.contents.find((m) => m.command === command);
    if (!macro) {
      macro = await Macro.create(
        { name, type: "script", img, command },
        { displaySheet: false },
      );
    }
  }

  if (["useAbility", "useGear"].includes(action)) {
    const item = await fromUuid(uuid);
    if (!item) return;
    const actor = item?.parent;
    if (!actor) return;
    const itemAction = item.system.actions[acId];
    if (!itemAction) return;
    const useFlavor = game.i18n.localize("PC.use");
    const name = `${actor.name}, ${useFlavor}: ${item.name} — ${itemAction.name}`;
    const img = itemAction.img || item.img;
    const command = `
      const item = await fromUuid("${uuid}");
      if (!item) return;
      const actor = game.actors.get(item.parent?.id);
      if (!actor) return;
      const action = item.system.actions["${acId}"];
      if (!action) return;
      actor.useGearOrAbility("${itemId}", "${acId}");
    `;
    macro = game.macros.contents.find((m) => m.command === command);
    if (!macro) {
      macro = await Macro.create(
        { name, type: "script", img, command },
        { displaySheet: false },
      );
    }
  }

  if (["Actor", "Item"].includes(documentName) && !action) {
    const command = `foundry.applications.ui.Hotbar.toggleDocumentSheet("${uuid}")`;
    macro = game.macros.contents.find((m) => m.command === command);
    if (!macro) {
      macro = await Macro.create(
        { name: `${name}`, type: "script", img: img, command: command },
        { displaySheet: false },
      );
    }
  }

  game.user.assignHotbarMacro(macro, slot);
}
