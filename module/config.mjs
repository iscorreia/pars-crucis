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

PC.mv = { label: "PC.mv" };
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
