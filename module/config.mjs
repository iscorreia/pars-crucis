export const PC = {};

PC.origins = {
  human: { label: "PC.origins.human" },
  carne: { label: "PC.origins.carne" },
  capri: { label: "PC.origins.capri" },
  guara: { label: "PC.origins.guara" },
  ligno: { label: "PC.origins.ligno" },
  orcin: { label: "PC.origins.orcin" },
  queza: { label: "PC.origins.queza" },
  stran: { label: "PC.origins.stran" },
};

PC.cultures = {
  adv: { label: "PC.cultures.adv" },
  ana: { label: "PC.cultures.ana" },
  ank: { label: "PC.cultures.ank" },
  art: { label: "PC.cultures.art" },
  ast: { label: "PC.cultures.ast" },
  azi: { label: "PC.cultures.azi" },
  ban: { label: "PC.cultures.ban" },
  cam: { label: "PC.cultures.cam" },
  gua: { label: "PC.cultures.gua" },
  orc: { label: "PC.cultures.orc" },
  reb: { label: "PC.cultures.reb" },
  est: { label: "PC.cultures.est" },
  sab: { label: "PC.cultures.sab" },
  sal: { label: "PC.cultures.sal" },
  vag: { label: "PC.cultures.vag" },
  vel: { label: "PC.cultures.vel" },
};

PC.personas = {
  aven: { label: "PC.personas.aven", favorables: ["atlet", "agili", "sobre"] },
  itin: { label: "PC.personas.itin", favorables: ["condu", "orien", "expre"] },
  esco: { label: "PC.personas.esco", favorables: ["crono", "erudi", "alqui"] },
  sabi: { label: "PC.personas.sabi", favorables: ["erudi", "expre", "ontol"] },
  escu: { label: "PC.personas.escu", favorables: ["armei", "artes", "expre"] },
  visi: { label: "PC.personas.visi", favorables: ["perce", "engen", "seduc"] },
  cura: { label: "PC.personas.cura", favorables: ["artes", "medic", "domar"] },
  prot: { label: "PC.personas.prot", favorables: ["atlet", "resis", "armei"] },
  vang: { label: "PC.personas.vang", favorables: ["esgri", "orien", "impos"] },
  arau: { label: "PC.personas.arau", favorables: ["expre", "seduc", "ontol"] },
  asse: { label: "PC.personas.asse", favorables: ["furti", "erudi", "artim"] },
  domi: { label: "PC.personas.domi", favorables: ["domar", "impos", "seduc"] },
  juiz: { label: "PC.personas.juiz", favorables: ["perce", "balis", "impos"] },
  pers: { label: "PC.personas.pers", favorables: ["perce", "arcan", "ontol"] },
  here: { label: "PC.personas.here", favorables: ["alqui", "engen", "artim"] },
  dest: { label: "PC.personas.dest", favorables: ["briga", "malha", "extra"] },
  mart: { label: "PC.personas.mart", favorables: ["resis", "medic", "amago"] },
  zelo: { label: "PC.personas.zelo", favorables: ["armei", "expre", "amago"] },
  asce: { label: "PC.personas.asce", favorables: ["amago", "aoism", "ontol"] },
  gran: { label: "PC.personas.gran", favorables: ["ladin", "impos", "seduc"] },
  perd: { label: "PC.personas.perd", favorables: ["agili", "ladin", "artim"] },
  ermi: { label: "PC.personas.ermi", favorables: ["furti", "sobre", "artes"] },
  usur: { label: "PC.personas.usur", favorables: ["ladin", "artim", "seduc"] },
  queb: { label: "PC.personas.queb", favorables: ["briga", "extra", "sabak"] },
  ment: { label: "PC.personas.ment", favorables: ["engen", "domar", "eleme"] },
  miri: { label: "PC.personas.miri", favorables: ["agili", "furti", "druid"] },
};

PC.attributes = {
  fis: { label: "PC.attributes.fis.label", abv: "PC.attributes.fis.abv" },
  des: { label: "PC.attributes.des.label", abv: "PC.attributes.des.abv" },
  ego: { label: "PC.attributes.ego.label", abv: "PC.attributes.ego.abv" },
  cog: { label: "PC.attributes.cog.label", abv: "PC.attributes.cog.abv" },
  esp: { label: "PC.attributes.esp.label", abv: "PC.attributes.esp.abv" },
  def: { label: "PC.attributes.def.label", abv: "PC.attributes.def.abv" },
};

PC.movement = { label: "PC.movement" };
PC.def = { label: "PC.def" };

PC.subattributes = {
  pv: { label: "PC.subattributes.pv.label", abv: "PC.subattributes.pv.abv" },
  pe: { label: "PC.subattributes.pe.label", abv: "PC.subattributes.pe.abv" },
};

PC.minors = {
  sau: { label: "PC.minors.sau.label", abv: "PC.minors.sau.abv" },
  ref: { label: "PC.minors.ref.label", abv: "PC.minors.ref.abv" },
  von: { label: "PC.minors.von.label", abv: "PC.minors.von.abv" },
};

PC.categories = {
  corporais: { label: "PC.categories.corporais" },
  subterfugios: { label: "PC.categories.subterfugios" },
  conhecimentos: { label: "PC.categories.conhecimentos" },
  oficios: { label: "PC.categories.oficios" },
  sociais: { label: "PC.categories.sociais" },
  espirituais: { label: "PC.categories.espirituais" },
};

PC.skills = {
  atlet: {
    label: "PC.skills.atlet",
    att: "fis",
    cat: "corporais",
    learning: 1,
    growth: 1,
  },
  briga: {
    label: "PC.skills.briga",
    att: "des",
    cat: "corporais",
    learning: 1,
    growth: 1,
  },
  esgri: {
    label: "PC.skills.esgri",
    att: "des",
    cat: "corporais",
    learning: 1,
    growth: 1,
  },
  hasta: {
    label: "PC.skills.hasta",
    att: "des",
    cat: "corporais",
    learning: 1,
    growth: 1,
  },
  malha: {
    label: "PC.skills.malha",
    att: "fis",
    cat: "corporais",
    learning: 1,
    growth: 1,
  },
  resis: {
    label: "PC.skills.resis",
    att: "fis",
    cat: "corporais",
    learning: 2,
    growth: 2,
  },

  agili: {
    label: "PC.skills.agili",
    att: "des",
    cat: "subterfugios",
    learning: 1,
    growth: 1,
  },
  arque: {
    label: "PC.skills.arque",
    att: "des",
    cat: "subterfugios",
    learning: 1,
    growth: 2,
  },
  balis: {
    label: "PC.skills.balis",
    att: "des",
    cat: "subterfugios",
    learning: 1,
    growth: 2,
  },
  furti: {
    label: "PC.skills.furti",
    att: "des",
    cat: "subterfugios",
    learning: 1,
    growth: 1,
  },
  ladin: {
    label: "PC.skills.ladin",
    att: "des",
    cat: "subterfugios",
    learning: 1,
    growth: 1,
  },
  perce: {
    label: "PC.skills.perce",
    att: "des",
    cat: "subterfugios",
    learning: 1,
    growth: 1,
  },

  arcan: {
    label: "PC.skills.arcan",
    att: "cog",
    cat: "conhecimentos",
    learning: 2,
    growth: 1,
  },
  crono: {
    label: "PC.skills.crono",
    att: "cog",
    cat: "conhecimentos",
    learning: 2,
    growth: 1,
  },
  erudi: {
    label: "PC.skills.erudi",
    att: "cog",
    cat: "conhecimentos",
    learning: 1,
    growth: 1,
  },
  medic: {
    label: "PC.skills.medic",
    att: "cog",
    cat: "conhecimentos",
    learning: 1,
    growth: 1,
  },
  orien: {
    label: "PC.skills.orien",
    att: "cog",
    cat: "conhecimentos",
    learning: 1,
    growth: 1,
  },
  sobre: {
    label: "PC.skills.sobre",
    att: "cog",
    cat: "conhecimentos",
    learning: 1,
    growth: 2,
  },

  alqui: {
    label: "PC.skills.alqui",
    att: "cog",
    cat: "oficios",
    learning: 2,
    growth: 1,
  },
  armei: {
    label: "PC.skills.armei",
    att: "fis",
    cat: "oficios",
    learning: 2,
    growth: 1,
  },
  artes: {
    label: "PC.skills.artes",
    att: "fis",
    cat: "oficios",
    learning: 1,
    growth: 1,
  },
  condu: {
    label: "PC.skills.condu",
    att: "fis",
    cat: "oficios",
    learning: 1,
    growth: 1,
  },
  engen: {
    label: "PC.skills.engen",
    att: "cog",
    cat: "oficios",
    learning: 2,
    growth: 1,
  },
  extra: {
    label: "PC.skills.extra",
    att: "fis",
    cat: "oficios",
    learning: 1,
    growth: 1,
  },

  artim: {
    label: "PC.skills.artim",
    att: "ego",
    cat: "sociais",
    learning: 1,
    growth: 1,
  },
  bardi: {
    label: "PC.skills.bardi",
    att: "ego",
    cat: "sociais",
    learning: 2,
    growth: 1,
  },
  domar: {
    label: "PC.skills.domar",
    att: "ego",
    cat: "sociais",
    learning: 1,
    growth: 1,
  },
  expre: {
    label: "PC.skills.expre",
    att: "ego",
    cat: "sociais",
    learning: 1,
    growth: 1,
  },
  impos: {
    label: "PC.skills.impos",
    att: "ego",
    cat: "sociais",
    learning: 1,
    growth: 1,
  },
  seduc: {
    label: "PC.skills.seduc",
    att: "ego",
    cat: "sociais",
    learning: 1,
    growth: 1,
  },

  amago: {
    label: "PC.skills.amago",
    att: "esp",
    cat: "espirituais",
    learning: 2,
    growth: 2,
  },
  aoism: {
    label: "PC.skills.aoism",
    att: "esp",
    cat: "espirituais",
    learning: 2,
    growth: 1,
  },
  druid: {
    label: "PC.skills.druid",
    att: "esp",
    cat: "espirituais",
    learning: 2,
    growth: 1,
  },
  eleme: {
    label: "PC.skills.eleme",
    att: "esp",
    cat: "espirituais",
    learning: 2,
    growth: 1,
  },
  ontol: {
    label: "PC.skills.ontol",
    att: "esp",
    cat: "espirituais",
    learning: 1,
    growth: 1,
  },
  sabak: {
    label: "PC.skills.sabak",
    att: "esp",
    cat: "espirituais",
    learning: 2,
    growth: 1,
  },
};

PC.corporais = {
  atlet: { label: "PC.skills.atlet" },
  briga: { label: "PC.skills.briga" },
  esgri: { label: "PC.skills.esgri" },
  hasta: { label: "PC.skills.hasta" },
  malha: { label: "PC.skills.malha" },
  resis: { label: "PC.skills.resis" },
};

PC.subterfugios = {
  agili: { label: "PC.skills.agili" },
  arque: { label: "PC.skills.arque" },
  balis: { label: "PC.skills.balis" },
  furti: { label: "PC.skills.furti" },
  ladin: { label: "PC.skills.ladin" },
  perce: { label: "PC.skills.perce" },
};

PC.conhecimentos = {
  arcan: { label: "PC.skills.arcan" },
  crono: { label: "PC.skills.crono" },
  erudi: { label: "PC.skills.erudi" },
  medic: { label: "PC.skills.medic" },
  orien: { label: "PC.skills.orien" },
  sobre: { label: "PC.skills.sobre" },
};

PC.oficios = {
  alqui: { label: "PC.skills.alqui" },
  armei: { label: "PC.skills.armei" },
  artes: { label: "PC.skills.artes" },
  condu: { label: "PC.skills.condu" },
  engen: { label: "PC.skills.engen" },
  extra: { label: "PC.skills.extra" },
};

PC.sociais = {
  artim: { label: "PC.skills.artim" },
  bardi: { label: "PC.skills.bardi" },
  domar: { label: "PC.skills.domar" },
  expre: { label: "PC.skills.expre" },
  impos: { label: "PC.skills.impos" },
  seduc: { label: "PC.skills.seduc" },
};

PC.espirituais = {
  amago: { label: "PC.skills.amago" },
  aoism: { label: "PC.skills.aoism" },
  druid: { label: "PC.skills.druid" },
  eleme: { label: "PC.skills.eleme" },
  ontol: { label: "PC.skills.ontol" },
  sabak: { label: "PC.skills.sabak" },
};

PC.ability = {
  subtypes: {
    technique: { label: "PC.ability.subtypes.technique.label" },
    power: { label: "PC.ability.subtypes.power.label" },
  },
  arts: {
    meleeTech: { label: "PC.ability.arts.meleeTech.label" },
    rangedTech: { label: "PC.ability.arts.rangedTech.label" },
    miscTech: { label: "PC.ability.arts.miscTech.label" },
    aoist: {
      label: "PC.ability.arts.aoist.label",
      categories: {
        unknown: "PC.ability.arts.aoist.categories.unknown",
        favor: "PC.ability.arts.aoist.categories.favor",
        summon: "PC.ability.arts.aoist.categories.summon",
        retribuition: "PC.ability.arts.aoist.categories.retribuition",
        macculate: "PC.ability.arts.aoist.categories.macculate",
      },
    },
    arcane: {
      label: "PC.ability.arts.arcane.label",
      categories: {
        unknown: "PC.ability.arts.arcane.categories.unknown",
        alchemical: "PC.ability.arts.arcane.categories.alchemical",
        psycognitive: "PC.ability.arts.arcane.categories.psycognitive",
        metaessential: "PC.ability.arts.arcane.categories.metaessential",
        scribing: "PC.ability.arts.arcane.categories.scribing",
      },
    },
    bardic: {
      label: "PC.ability.arts.bardic.label",
      categories: {
        unknown: "PC.ability.arts.bardic.categories.unknown",
        fortune: "PC.ability.arts.bardic.categories.fortune",
        instrumental: "PC.ability.arts.bardic.categories.instrumental",
        psycovocal: "PC.ability.arts.bardic.categories.psycovocal",
        theatrical: "PC.ability.arts.bardic.categories.theatrical",
      },
    },
    cronocientific: {
      label: "PC.ability.arts.cronocientific.label",
      categories: {
        unknown: "PC.ability.arts.cronocientific.categories.unknown",
        crono: "PC.ability.arts.cronocientific.categories.crono",
        phase: "PC.ability.arts.cronocientific.categories.phase",
        gravitational:
          "PC.ability.arts.cronocientific.categories.gravitational",
        sidereal: "PC.ability.arts.cronocientific.categories.sidereal",
      },
    },
    druidic: {
      label: "PC.ability.arts.druidic.label",
      categories: {
        unknown: "PC.ability.arts.druidic.categories.unknown",
        animal: "PC.ability.arts.druidic.categories.animal",
        astral: "PC.ability.arts.druidic.categories.astral",
        vegetal: "PC.ability.arts.druidic.categories.vegetal",
      },
    },
    elemental: {
      label: "PC.ability.arts.elemental.label",
      categories: {
        unknown: "PC.ability.arts.elemental.categories.unknown",
        water: "PC.ability.arts.elemental.categories.water",
        fire: "PC.ability.arts.elemental.categories.fire",
        lightning: "PC.ability.arts.elemental.categories.lightning",
        earth: "PC.ability.arts.elemental.categories.earth",
        wind: "PC.ability.arts.elemental.categories.wind",
      },
    },
    sabak: {
      label: "PC.ability.arts.sabak.label",
      categories: {
        unknown: "PC.ability.arts.sabak.categories.unknown",
        death: "PC.ability.arts.sabak.categories.death",
        mind: "PC.ability.arts.sabak.categories.mind",
        plague: "PC.ability.arts.sabak.categories.plague",
        blood: "PC.ability.arts.sabak.categories.blood",
      },
    },
    other: { label: "PC.ability.arts.other.label" },
  },
};

PC.action = {
  types: {
    attack: {
      label: "PC.action.types.attack.label",
      subtypes: {
        melee: { label: "PC.action.types.attack.subtype.melee" },
        throw: { label: "PC.action.types.attack.subtype.throw" },
        projectile: { label: "PC.action.types.attack.subtype.projectile" },
        jet: { label: "PC.action.types.attack.subtype.jet" },
        aoe: { label: "PC.action.types.attack.subtype.aoe" },
        affliction: { label: "PC.action.types.attack.subtype.affliction" },
        mind: { label: "PC.action.types.attack.subtype.mind" },
        social: { label: "PC.action.types.attack.subtype.social" },
      },
    },
    direct: { label: "PC.action.types.direct.label" },
    test: { label: "PC.action.types.test.label" },
  },
};

PC.weapon = {
  subtypes: {
    melee: {
      label: "PC.weapon.subtypes.melee.label",
      groups: {
        unarmed: { label: "PC.weapon.subtypes.melee.groups.unarmed" },
        light: { label: "PC.weapon.subtypes.melee.groups.light" },
        throwing: { label: "PC.weapon.subtypes.melee.groups.throwing" },
        sword: { label: "PC.weapon.subtypes.melee.groups.sword" },
        javelin: { label: "PC.weapon.subtypes.melee.groups.javelin" },
        spear: { label: "PC.weapon.subtypes.melee.groups.spear" },
        polearm: { label: "PC.weapon.subtypes.melee.groups.polearm" },
        ax: { label: "PC.weapon.subtypes.melee.groups.ax" },
        hammer: { label: "PC.weapon.subtypes.melee.groups.hammer" },
        mace: { label: "PC.weapon.subtypes.melee.groups.mace" },
        flail: { label: "PC.weapon.subtypes.melee.groups.flail" },
        exotic: { label: "PC.weapon.subtypes.melee.groups.exotic" },
      },
    },
    shield: {
      label: "PC.weapon.subtypes.shield.label",
      groups: {
        buckler: { label: "PC.weapon.subtypes.shield.groups.buckler" },
        shield: { label: "PC.weapon.subtypes.shield.groups.shield" },
        cover: { label: "PC.weapon.subtypes.shield.groups.cover" },
        exotic: { label: "PC.weapon.subtypes.melee.groups.exotic" },
      },
    },
    ranged: {
      label: "PC.weapon.subtypes.ranged.label",
      groups: {
        bow: { label: "PC.weapon.subtypes.ranged.groups.bow" },
        sling: { label: "PC.weapon.subtypes.ranged.groups.sling" },
        crossbow: { label: "PC.weapon.subtypes.ranged.groups.crossbow" },
        pistol: { label: "PC.weapon.subtypes.ranged.groups.pistol" },
        rifle: { label: "PC.weapon.subtypes.ranged.groups.rifle" },
        shotgun: { label: "PC.weapon.subtypes.ranged.groups.shotgun" },
        cannon: { label: "PC.weapon.subtypes.ranged.groups.cannon" },
        exotic: { label: "PC.weapon.subtypes.melee.groups.exotic" },
      },
    },
    ammo: {
      label: "PC.weapon.subtypes.ammo.label",
      groups: {
        pebble: { label: "PC.weapon.subtypes.ammo.groups.pebble" },
        arrow: { label: "PC.weapon.subtypes.ammo.groups.arrow" },
        bolt: { label: "PC.weapon.subtypes.ammo.groups.bolt" },
        gasoil: { label: "PC.weapon.subtypes.ammo.groups.gasoil" },
        harpoon: { label: "PC.weapon.subtypes.ammo.groups.harpoon" },
        lead: { label: "PC.weapon.subtypes.ammo.groups.lead" },
        cartridge: { label: "PC.weapon.subtypes.ammo.groups.cartridge" },
        bullet: { label: "PC.weapon.subtypes.ammo.groups.bullet" },
        cannonball: { label: "PC.weapon.subtypes.ammo.groups.cannonball" },
        exotic: { label: "PC.weapon.subtypes.melee.groups.exotic" },
      },
    },
    exotic: {
      label: "PC.weapon.subtypes.exotic.label",
      groups: {
        exotic: { label: "PC.weapon.subtypes.melee.groups.exotic" },
      },
    },
  },
};

PC.gear = {
  subtypes: {
    wear: {
      label: "PC.gear.subtypes.wear.label",
      groups: {
        vest: { label: "PC.gear.subtypes.wear.groups.vest" },
        accessory: { label: "PC.gear.subtypes.wear.groups.accessory" },
        gadget: { label: "PC.gear.subtypes.wear.groups.gadget" },
      },
    },
    item: {
      label: "PC.gear.subtypes.item.label",
      groups: {
        alchemical: { label: "PC.gear.subtypes.item.groups.alchemical" },
        trap: { label: "PC.gear.subtypes.item.groups.trap" },
        artifact: { label: "PC.gear.subtypes.item.groups.artifact" },
        matrix: { label: "PC.gear.subtypes.item.groups.matrix" },
        herbal: { label: "PC.gear.subtypes.item.groups.herbal" },
        instrument: { label: "PC.gear.subtypes.item.groups.instrument" },
        utility: { label: "PC.gear.subtypes.item.groups.utility" },
      },
      subgroups: {
        potion: { label: "PC.gear.subtypes.item.subgroups.potion" },
        elixir: { label: "PC.gear.subtypes.item.subgroups.elixir" },
        poison: { label: "PC.gear.subtypes.item.subgroups.poison" },
        agent: { label: "PC.gear.subtypes.item.subgroups.agent" },
        grenade: { label: "PC.gear.subtypes.item.subgroups.grenade" },
      },
    },
  },
};

PC.currency = {
  silver: { label: "PC.currency.silver.label", abv: "PC.currency.silver.abv" },
  copper: { label: "PC.currency.copper.label", abv: "PC.currency.copper.abv" },
  unknown: {
    label: "PC.currency.unknown.label",
    abv: "PC.currency.unknown.abv",
  },
  priceless: {
    label: "PC.currency.priceless.label",
    abv: "PC.currency.priceless.abv",
  },
};

PC.passive = {
  subtypes: {
    benefit: { label: "PC.passive.subtypes.benefit" },
    drawback: { label: "PC.passive.subtypes.drawback" },
  },
  acquirement: {
    original: { label: "PC.passive.acquirement.original" },
    natural: { label: "PC.passive.acquirement.natural" },
    learned: { label: "PC.passive.acquirement.learned" },
    suffered: { label: "PC.passive.acquirement.suffered" },
  },
};

PC.keyword = {
  melee: { label: "PC.keyword.melee" },
  bonus: { label: "PC.keyword.bonus" },
  throw: { label: "PC.keyword.throw" },
  reaction: { label: "PC.keyword.reaction" },
  esoteric: { label: "PC.keyword.esoteric" },
  quick: { label: "PC.keyword.quick" },
  power: { label: "PC.keyword.power" },
  style: { label: "PC.keyword.style" },
  passive: { label: "PC.keyword.passive" },
  aim: { label: "PC.keyword.aim" },
  projectile: { label: "PC.keyword.projectile" },
  social: { label: "PC.keyword.social" },
  starter: { label: "PC.keyword.starter" },
  affliction: { label: "PC.keyword.affliction" },
  sigil: { label: "PC.keyword.sigil" },
  summon: { label: "PC.keyword.summon" },
  jet: { label: "PC.keyword.jet" },
  aoe: { label: "PC.keyword.aoe" },
  mental: { label: "PC.keyword.mental" },
  mutation: { label: "PC.keyword.mutation" },

  custom: { label: "PC.keyword.custom" },
  potion: { label: "PC.keyword.potion" },
  elixir: { label: "PC.keyword.elixir" },
  poison: { label: "PC.keyword.poison" },
  agent: { label: "PC.keyword.agent" },
  recipe: { label: "PC.keyword.recipe" },
  grenade: { label: "PC.keyword.grenade" },
  instrument: { label: "PC.keyword.instrument" },
};
