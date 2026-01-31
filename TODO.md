# DOING

- Weapon/Gear/Abilities ammunition, how to interact? **_logic hbs css qol_**
- DONE Add a boolean `hasAmmo` for Weapons
- If `hasAmmo = true` do the following:

1. DONE Weapon has the schemaFielld `ammo`.
2. DONE the field `ammo` has the follow fields: `ammoType`, `loaded`, `capacity`, `ammoId`
3. DONE Add a boolean for `usesAmmo` in Attack Actions
4. `ammoId` is set by a `pickAmmo` BUTTON that belongs to the weapon
5. `pickAmmo` BUTTON is available through the weapon sheet when item belongs to Actor, or in the inventory when expanding the weapon (1st option)
6. Before the persona inventory weapon expanded inline actions show the picker ammo
7. If an action have `usesAmmo = true` it's `damage` calculations should take into account the AMMO data
8. AMMO data must be able to set a new formular with a few different strategies:

1) ammo increments weapon damage, updates damage property;
2) ammo adds effects;
3) ammo completely overhauls weapon damage, has either it's own damage and scaling, or flat damage that does not depend on weapon
4) Simples initial fix: have a field in ammo that describes all its effect. Once a weapon has an ammo selected, using the weapon attack prints the used ammo and also which are the ammo effects :D

9. have one ammo type called `omni` which is always available
10. have an ammo type valled `exotic` which is only available for the `exotic` ammo typed weapons, this is for weird created weapons
11. for now attack wont automatically deduce ammo, but take this possibility into account
12. make sure that ammo configs are properly taken into account for attack techniques with weapons using ammo

- Work needed on ammo (if item subtype is ammo)
- Have a few option on the configs for ammo
- What will decide the damage formula
- Responsability on ammo! advantages are more control: options such as:

# HIGH PRIORITY

- Improved Weapon **_logic hbs style/css_**
- Improved Gear **_hbs style/css_**
- Improved Ability sheet **_hbs style/css_**

## IMPORTANT

- Further improve Passive sheet **_logic style/css_**
- Further improve Ability Technique data handling and presentation **_logic hbs_**
- Persona Inventory calculations **_logic_**
- Create a prompt for last roll action adjustment on pressing ALT **_feature_**
- PDM sheet having Attributes and Skills grayed out and not rollable when null **_feature hbs style/css_**

## NECESSARY

- Review Overrides **_logic_**
- Final touches on the PDM config app **_hbs/css_**
- Add Inventory sorting **_qol feature_**
- Create a `#bonus` property for items
- Make item `#bonus`, `#effect`, `#penalty` properties have their custom descriptiom that can be set on the item config

## LOW PRIORITY

- Notes on the Persona Ability Tab **_feature update_**
- Weapons Compendium **_pack_**
- Items Compendium **_pack_**
- Abilities Compendium **_pack_**
- Add Abilities (art) sorting **_qol_**
- Persona/PDM image picked from config instead of the sheet **_qol_**

### INTERESTING BUT NOT NECESSARY

- Ability and Item use Limits and Conditions
- Automatic rest on click, with possibility to set an amount of hours to rest, so it recovers PV/PE
- Implement `enrichHTML` in the item descriptions/effect **_feature_**
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

- Compendium banner img src path is empty
- _mitigation_.adjust can be deleted in the persona config, resulting in `NaN`

### PONDER ABOUT

- Ability Technique Item/Action keywords not showing in the ability line, do we want it to?
- Make possible to clear Technique ability selected Item action **_qol_**
- Expanded Actions be Draggable to Macros
- Attributes be Draggable to Macros
- Show Abilities/Items general description on chat **_feature_**
- Click on luck title to use one luck? Would this print possible use option?
