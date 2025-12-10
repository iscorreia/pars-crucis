export const PC = {};

PC.origins = {
  humano: { label: "PC.origins.humano" },
  carneador: { label: "PC.origins.carneador" },
  capriaco: { label: "PC.origins.capriaco" },
  guara: { label: "PC.origins.guara" },
  ligno: { label: "PC.origins.ligno" },
  orcino: { label: "PC.origins.orcino" },
  quezal: { label: "PC.origins.quezal" },
  stranger: { label: "PC.origins.stranger" },
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
  aven: { label: "PC.personas.aven" },
  itin: { label: "PC.personas.itin" },
  esco: { label: "PC.personas.esco" },
  escu: { label: "PC.personas.escu" },
  visi: { label: "PC.personas.visi" },
  cura: { label: "PC.personas.cura" },
  prot: { label: "PC.personas.prot" },
  vang: { label: "PC.personas.vang" },
  arau: { label: "PC.personas.arau" },
  asse: { label: "PC.personas.asse" },
  domi: { label: "PC.personas.domi" },
  juiz: { label: "PC.personas.juiz" },
  pers: { label: "PC.personas.pers" },
  here: { label: "PC.personas.here" },
  dest: { label: "PC.personas.dest" },
  mart: { label: "PC.personas.mart" },
  zelo: { label: "PC.personas.zelo" },
  asce: { label: "PC.personas.asce" },
  gran: { label: "PC.personas.gran" },
  perd: { label: "PC.personas.perd" },
  ermi: { label: "PC.personas.ermi" },
  usur: { label: "PC.personas.usur" },
  queb: { label: "PC.personas.queb" },
  ment: { label: "PC.personas.ment" },
  miri: { label: "PC.personas.miri" },
  sabi: { label: "PC.personas.sabi" },
};

PC.attributes = {
  fis: {
    label: "PC.attributes.fis.label",
    abv: "PC.attributes.fis.abv",
  },
  des: {
    label: "PC.attributes.des.label",
    abv: "PC.attributes.des.abv",
  },
  ego: {
    label: "PC.attributes.ego.label",
    abv: "PC.attributes.ego.abv",
  },
  cog: {
    label: "PC.attributes.cog.label",
    abv: "PC.attributes.cog.abv",
  },
  esp: {
    label: "PC.attributes.esp.label",
    abv: "PC.attributes.esp.abv",
  },
};

PC.mv = { label: "PC.mv" };
PC.def = { label: "PC.def" };

PC.subattributes = {
  pv: {
    label: "PC.subattributes.pv.label",
    abv: "PC.subattributes.pv.abv",
  },
  pe: {
    label: "PC.subattributes.pe.label",
    abv: "PC.subattributes.pe.abv",
  },
};

PC.minors = {
  sau: {
    label: "PC.minors.sau.label",
    abv: "PC.minors.sau.abv",
  },
  ref: {
    label: "PC.minors.ref.label",
    abv: "PC.minors.ref.abv",
  },
  von: {
    label: "PC.minors.von.label",
    abv: "PC.minors.von.abv",
  },
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
  atlet: { label: "PC.skills.atlet", att: "fis", learning: 1, growth: 1 },
  briga: { label: "PC.skills.briga", att: "des", learning: 1, growth: 1 },
  esgri: { label: "PC.skills.esgri", att: "des", learning: 1, growth: 1 },
  hasta: { label: "PC.skills.hasta", att: "des", learning: 1, growth: 1 },
  malha: { label: "PC.skills.malha", att: "fis", learning: 1, growth: 1 },
  resis: { label: "PC.skills.resis", att: "fis", learning: 2, growth: 2 },

  agili: { label: "PC.skills.agili", att: "des", learning: 1, growth: 1 },
  arque: { label: "PC.skills.arque", att: "des", learning: 1, growth: 2 },
  balis: { label: "PC.skills.balis", att: "des", learning: 1, growth: 2 },
  furti: { label: "PC.skills.furti", att: "des", learning: 1, growth: 1 },
  ladin: { label: "PC.skills.ladin", att: "des", learning: 1, growth: 1 },
  perce: { label: "PC.skills.perce", att: "des", learning: 1, growth: 1 },

  arcan: { label: "PC.skills.arcan", att: "cog", learning: 2, growth: 1 },
  crono: { label: "PC.skills.crono", att: "cog", learning: 2, growth: 1 },
  erudi: { label: "PC.skills.erudi", att: "cog", learning: 1, growth: 1 },
  medic: { label: "PC.skills.medic", att: "cog", learning: 1, growth: 1 },
  orien: { label: "PC.skills.orien", att: "cog", learning: 1, growth: 1 },
  sobre: { label: "PC.skills.sobre", att: "cog", learning: 1, growth: 2 },

  alqui: { label: "PC.skills.alqui", att: "cog", learning: 2, growth: 1 },
  armei: { label: "PC.skills.armei", att: "fis", learning: 2, growth: 1 },
  artes: { label: "PC.skills.artes", att: "fis", learning: 1, growth: 1 },
  condu: { label: "PC.skills.condu", att: "fis", learning: 1, growth: 1 },
  engen: { label: "PC.skills.engen", att: "cog", learning: 2, growth: 1 },
  extra: { label: "PC.skills.extra", att: "fis", learning: 1, growth: 1 },

  artim: { label: "PC.skills.artim", att: "ego", learning: 1, growth: 1 },
  bardi: { label: "PC.skills.bardi", att: "ego", learning: 2, growth: 1 },
  domar: { label: "PC.skills.domar", att: "ego", learning: 1, growth: 1 },
  expre: { label: "PC.skills.expre", att: "ego", learning: 1, growth: 1 },
  impos: { label: "PC.skills.impos", att: "ego", learning: 1, growth: 1 },
  seduc: { label: "PC.skills.seduc", att: "ego", learning: 1, growth: 1 },

  amago: { label: "PC.skills.amago", att: "esp", learning: 2, growth: 2 },
  aoism: { label: "PC.skills.aoism", att: "esp", learning: 2, growth: 1 },
  druid: { label: "PC.skills.druid", att: "esp", learning: 2, growth: 1 },
  eleme: { label: "PC.skills.eleme", att: "esp", learning: 2, growth: 1 },
  ontol: { label: "PC.skills.ontol", att: "esp", learning: 1, growth: 1 },
  sabak: { label: "PC.skills.sabak", att: "esp", learning: 2, growth: 1 },
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
