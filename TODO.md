# DOING

- Improved Weapon **_logic hbs style/css_**
- Improved Gear **_hbs style/css_**
- Improved Ability sheet **_hbs style/css_**
- Further improve Ability Technique data handling and presentation **_logic hbs_**
- Gray-out and disable Techniques that are not `Ready`, need to select Item Action **_logic_**

# HIGH PRIORITY

- Basic compendium **_logic_**
- PV and PE properly set for token **_logic_**
- Show Abilities/Items on chat **_feature_**

## IMPORTANT

- Persona Inventory calculations **_logic_**
- Improved PASSIVE SHEET **_logic hbs style/css_**
- Create a prompt for last roll action adjustment on pressing ALT **_feature_**
- PDM sheet having Attributes and Skills grayed out and not rollable when null **_feature hbs style/css_**

## NECESSARY

- Review Overrides **_logic_**
- Final touches on the PDM config app **_hbs/css_**
- Weapon/Gear/Abilities ammunition, how to interact? **_logic hbs css qol_**
- Add Inventory sorting **_qol feature_**

## LOW PRIORITY

- Calculate AR / Robust / Insulant / AB based on equipped Gear/Passives/other **_logic_**
- Notes on the Persona Ability Tab **_feature update_**
- Weapons Compendium **_pack_**
- Items Compendium **_pack_**
- Abilities Compendium **_pack_**
- Passives Compendium **_pack_**
- Add Abilities (art) sorting **_qol_**
- ?? Filter keywords such as Initial / Recipe on chat **_qol_**
- Persona/PDM image picked from config instead of the sheet **_qol_**

### INTERESTING BUT NOT NECESSARY

- Ability and Item use Limits and Conditions
- Draggable Macros for Attribute and Skill rolls
- Draggable Macros for Ability and Item actions
- Automatic rest on click, with possibility to set an amount of hours to rest, so it recovers PV/PE
- Implement `enrichHTML` in the item descriptions/effect **_feature_**
- Skills/Abilities/Items Macros **_feature_**
- Tooltips / Information on hover **_feature_** or;
- Information icon: on click: pops a window with origin/skills/etc description **_feature_**
- Usable passives **_feature_**
- Improved favorable skills on Persona Config **_logic style/css_**
- Option for Action effort to be automatically deduced when used **_qol_**
- reroll option on rollable actions (possibility to use luck) **_qol_**

### MIGHT BE INTERESTING

- Custom effects **_feature_**
- Implement currency working on items **_feature_**

### KNOWN BUGS

- PDM mitigation is `NaN` when set no `null`, needs better treatment null should be valid
- Darkvision is automatically set on the actor, but does not take effect until re-set
- Compendium banner img src path is empty
- PV/PE max values not being taken into account on token

### PONDER ABOUT

- Ability Technique Item/Action keywords not showing in the ability line, do we want it to?
- Move some functions to utils
