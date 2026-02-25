const { api, sheets } = foundry.applications;
import ActionPicker from "../apps/action-picker.mjs";
import AmmoPicker from "../apps/ammo-picker.mjs";

//This is the basic class for Pars Crucis Actor and should be extended
export class ParsCrucisActorSheet extends api.HandlebarsApplicationMixin(
  sheets.ActorSheetV2,
) {
  static DEFAULT_OPTIONS = {
    form: {
      submitOnChange: true,
    },
    position: {
      width: 800,
      height: 680,
    },
    tag: "form", // Default is div in case we don't want to define a tag
    window: {
      icon: "fa fa-address-card",
    },
    actions: {
      actionPicker: this._actionPicker,
      ammoPicker: this._ammoPicker,
      callAction: this._callActionOnClick,
      clickDelete: this._deleteItemOnClick,
      clickEdit: this._editItemOnClick,
      clickEquip: this._equipItemOnClick,
      rollAttribute: this._rollAttributeOnClick,
      attack: this._rollTestOnClick,
      tech: this._rollTechOnClick,
      test: this._rollTestOnClick,
      rollSkill: this._rollSkillOnClick,
      use: this._useOnClick,
      sortAbilities: this._changeSortMode,
      switchLuck: this._switchLuckOnClick,
      toggleExpand: this._toggleAbilityExpand,
    },
  };

  get title() {
    return this.actor.name;
  }

  /** @inheritdoc Defines where are the template PARTS */
  static PARTS = {
    header: {
      template: "systems/pars-crucis/templates/actor/parts/header.hbs",
    },
    tabs: {
      // Foundry-provided generic template
      template: "templates/generic/tab-navigation.hbs",
      classes: ["pars-crucis-nav"],
    },
    skills: {
      template: "systems/pars-crucis/templates/actor/parts/skills.hbs",
    },
    abilities: {
      template: "systems/pars-crucis/templates/actor/parts/abilities.hbs",
      scrollable: [".abilities-list-block"],
    },
    gear: {
      template: "systems/pars-crucis/templates/actor/parts/gear.hbs",
      scrollable: [".item-list-block"],
    },
    passives: {
      template: "systems/pars-crucis/templates/actor/parts/passives.hbs",
      scrollable: [".passives-list-block"],
    },
    background: {
      template: "systems/pars-crucis/templates/actor/parts/background.hbs",
    },
  };

  static TABS = {
    primary: {
      initial: "abilities", // Change to simplify testing, once done set back to skills
      tabs: [
        { id: "skills", label: "PC.tabs.skills" },
        { id: "abilities", label: "PC.tabs.abilities" },
        { id: "gear", label: "PC.tabs.gear" },
        { id: "passives", label: "PC.tabs.passives" },
        { id: "background", label: "PC.tabs.background" },
      ],
    },
  };

  /**
   * An event that occurs when a drag workflow begins for a draggable item on the sheet.
   * @param {DragEvent} event       The initiating drag start event
   * @returns {Promise<void>}
   * @protected
   */
  async _onDragStart(event) {
    const target = event.currentTarget;
    const { dataset } = target;
    const { action, itemId } = dataset;
    let dragData;

    // Dragged element is an Action
    if (action && itemId) {
      const item = this.actor.items.get(itemId);
      // console.log(item.toDragData()); // DEBUG logging
      dataset.type = item.toDragData().type;
      dataset.uuid = item.toDragData().uuid;
      dragData = dataset;
    } else if (action) {
      dragData = dataset;
    }

    // Set data transfer
    if (!dragData) return;
    event.dataTransfer.setData("text/plain", JSON.stringify(dragData));
  }

  /** @override */
  _onChangeForm(formConfig, event) {
    if (event?.target.matches("input[data-field][data-item-id]"))
      return this._updateDataOnChange(event.target);
    super._onChangeForm(formConfig, event);
  }

  /** @override */
  async _prepareContext() {
    const baseData = await super._prepareContext();
    const document = baseData.document;
    const system = document.system;
    const categorizedAbilities = this.categorize(
      system.abilities,
      "system.info.art",
      this.sortAbilities.bind(this),
    );
    const categorizedPassives = this.categorize(
      system.passives,
      "system.info.subtype",
      this.sortItems.bind(this),
    );

    const context = {
      editable: baseData.editable,
      document: document,
      actor: document,
      system: system,
      // items: document.items, // if needed
      systemFields: system.schema.fields, // used in formInput|formGroup
      categorized: {
        abilities: categorizedAbilities,
        passives: categorizedPassives,
      },
      config: CONFIG.PC,
      tabs: this._prepareTabs("primary"),
      effects: document.effects, // easier access fo effects
    };

    return context;
  }

  /** @override */
  async _preparePartContext(partId, context) {
    switch (partId) {
      case "skills":
      case "abilities":
      case "gear":
      case "passives":
      case "background":
        context.tab = context.tabs[partId];
        break;
      default:
    }

    return context;
  }

  static async _callActionOnClick(event, target) {
    const { acType } = target.dataset;
    if (["attack", "test"].includes(acType))
      ParsCrucisActorSheet._rollTestOnClick.call(this, event, target);
    if (acType === "tech")
      ParsCrucisActorSheet._rollTechOnClick.call(this, event, target);
    if (acType === "use")
      ParsCrucisActorSheet._useOnClick.call(this, event, target);
  }

  /**
   * Handle attribute and skill roll clicks
   * @param {PointerEvent} event - The originating click event
   * @param {HTMLElement} target - The capturing HTML element which defined a [data-action]
   */
  static async _rollAttributeOnClick(event, target) {
    const { attribute, attType } = target.dataset;
    const dice = pickDice(event);
    return this.actor.rollAttribute(attribute, attType, dice);
  }

  static async _rollSkillOnClick(event, target) {
    const { skill } = target.dataset;
    const dice = pickDice(event);
    return this.actor.rollSkill(skill, dice);
  }

  static async _rollTechOnClick(event, target) {
    const { acId, itemId } = target.dataset;
    const dice = pickDice(event);
    return this.actor.rollTech(itemId, acId, dice);
  }

  static async _rollTestOnClick(event, target) {
    const { acId, itemId } = target.dataset;
    const dice = pickDice(event);
    return this.actor.rollTest(itemId, acId, dice);
  }

  static async _useOnClick(_, target) {
    const { acId, itemId } = target.dataset;
    return this.actor.useGearOrAbility(itemId, acId);
  }

  static async _switchLuckOnClick(_, target) {
    const dataset = target.dataset;
    const luckBooleans = this.actor.system.luck.booleans;
    const index = dataset.luckIndex;
    luckBooleans[index] = !luckBooleans[index];
    this.actor.update({ "system.luck.booleans": luckBooleans });
  }

  static async _equipItemOnClick(_, target) {
    const { equip, itemId } = target.dataset;
    return this.actor.equipGear(equip, itemId);
  }

  static async _toggleAbilityExpand(_, target) {
    const item = this.actor.items.get(target.dataset.itemId);
    const current = item.getFlag("pars-crucis", "expanded") ?? false;
    item.setFlag("pars-crucis", "expanded", !current);
  }

  // Renders item sheet if owner
  static async _editItemOnClick(_, target) {
    const item = this.actor.items.get(target.dataset.itemId);
    if (this.actor.isOwner) item.sheet.render(true);
  }

  static async _actionPicker(_, target) {
    const { acId, itemId } = target.dataset;
    const { actor } = this;
    const { weaponry, vest, accessories, gear } = actor.system;
    const gearArray = [...weaponry, ...vest, ...accessories, ...gear];
    const attackChoices = gearArray
      .map((item) => {
        if (!item.system.actions) return;
        const actions = getItemActionsByType(item, "attack");
        return Object.keys(actions).length ? { item, actions } : null;
      })
      .filter(Boolean);

    new ActionPicker({
      document: actor,
      choices: attackChoices,
      acId,
      itemId,
    })?.render(true);
  }

  static async _ammoPicker(_, target) {
    const { itemId } = target.dataset;
    const { actor } = this;
    const item = actor.items.get(itemId);
    const { type } = item.system.ammoInfo;
    const ammoChoices = [];
    actor.system.ammo.forEach((ammunition) => {
      if ([type, "omni"].includes(ammunition.system.info.group))
        ammoChoices.push(ammunition);
    });
    new AmmoPicker({
      choices: ammoChoices,
      document: actor,
      itemId,
    })?.render(true);
  }

  // Open a Dialog box with options to Delete, Edit or Cancel
  static async _deleteItemOnClick(event, target) {
    const itemId = target.dataset.itemId;
    const item = this.actor.items.get(itemId);

    if (this.actor.isOwner) {
      // Skips Dialog and immediatelly Deletes the item
      if (event.ctrlKey) {
        item.delete();
        return;
      }

      api.Dialog.wait({
        window: { title: "Destruir item" },
        content: `<p>Deseja destruir o item: ${item.name}</p>`,
        buttons: [
          {
            action: "delete",
            icon: '<i class="fa-solid fa-trash-can"></i>',
            label: "PC.delete",
            callback: () => item.delete(),
            default: true,
          },
          {
            action: "edit",
            icon: '<i class="fas fa-edit"></i>',
            label: "PC.edit",
            callback: () => item.sheet.render(true),
          },
          {
            action: "cancel",
            icon: '<i class="fas fa-times"></i>',
            label: "PC.cancel",
          },
        ],
      });
    }
  }

  static async _changeSortMode(_, target) {
    const dataset = target.dataset;
    const actor = this.document;
    actor.setFlag("pars-crucis", dataset.group, dataset.sortMode);
  }

  categorize(itemCollection, path, sortFn) {
    const categorized = {};

    for (let item of itemCollection) {
      const category = path.split(".").reduce((obj, key) => obj[key], item);
      if (!categorized[category]) {
        categorized[category] = [];
      }
      categorized[category].push(item);
    }

    for (const key of Object.keys(categorized)) {
      const sortMode = this.getSortMode(key);
      categorized[key] = sortFn(categorized[key], sortMode);
    }

    return categorized;
  }

  sortAbilities(group, sortMode = "coreLevel-asc") {
    return group.slice().sort((a, b) => {
      switch (sortMode) {
        case "coreLevel-desc":
          return b.system.details.coreLevel - a.system.details.coreLevel;
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        default: // "coreLevel-asc"
          return a.system.details.coreLevel - b.system.details.coreLevel;
      }
    });
  }

  sortItems(group, sortMode = "name-asc") {
    return group.slice().sort((a, b) => {
      switch (sortMode) {
        case "name-desc":
          return b.name.localeCompare(a.name);
        default: // "name-asc"
          return a.name.localeCompare(b.name);
      }
    });
  }

  getSortMode(flag) {
    const actor = this.document;
    return actor.getFlag("pars-crucis", flag) || "name-asc";
  }

  /**
   * Handles change on inputs with [data-update][data-item-id] (e.g. stack).
   * Uses data-field as the path as selector; callback calls item.update().
   * @param {Event} event
   */
  async _updateDataOnChange({ dataset, value }) {
    const { actor } = this;
    if (!actor) return;
    const item = actor.items?.get(dataset.itemId);
    if (!item?.isOwner) return;
    item.update({ [`${dataset.field}`]: value });
  }
}

function getItemActionsByType(item, type) {
  return Object.fromEntries(
    Object.entries(item.system.actions).filter(
      ([_, action]) => action.type === type,
    ),
  );
}

function pickDice(event) {
  let dice = "2d10";
  // Checks if Shift or Ctrl is pressed and adjusts formula.
  if (event.shiftKey) {
    dice = "3d10kh2"; // Keep 2 highest out of 3d10
  } else if (event.ctrlKey || event.metaKey) {
    dice = "3d10kl2"; // Keep 2 lowest out of 3d10
  }
  return dice;
}
