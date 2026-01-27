/**
 * Handle macro creation, called from the hotbarDrop hook
 * @param {Hotbar} bar - The hotbar related information
 * @param {dataset} data - The dataset transfered from the draggable element
 * @param {slot} slot - The slot number where the draggable was dropped
 */

export default async function (bar, data, slot) {
  console.log("data:", data);
  const { action, uuid } = data;
  const document = await fromUuid(uuid);
  if (!document) return;
  console.log(document);
  const { documentName, name, img } = document;
  let macro;

  if (action) {
    console.log("SUPPOSED TO CREATE ACTION MACRO");
    return;
  }

  if (documentName === "Actor" && !action) {
    const command = `foundry.applications.ui.Hotbar.toggleDocumentSheet("${uuid}")`;
    macro = game.macros.contents.find((m) => m.command === command);
    if (!macro) {
      macro = await Macro.create(
        { name: `${name}`, type: "script", img: img, command: command },
        { displaySheet: false },
      );
    }
  }

  if (documentName === "Item" && !action) {
    const command = `foundry.applications.ui.Hotbar.toggleDocumentSheet("${uuid}")`;
    macro = game.macros.contents.find((m) => m.command === command);
    if (!macro) {
      macro = await Macro.create(
        { name: `${name}`, type: "script", img: img, command: command },
        { displaySheet: false },
      );
    }
  }

  console.log(macro);

  game.user.assignHotbarMacro(macro, slot);
}
