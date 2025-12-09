export const PC = {};

PC.origin = {
  humano: { label: "PC.origin.humano" },
  carneador: { label: "PC.origin.carneador" },
  capriaco: { label: "PC.origin.capriaco" },
  guara: { label: "PC.origin.guara" },
  ligno: { label: "PC.origin.ligno" },
  orcino: { label: "PC.origin.orcino" },
  quezal: { label: "PC.origin.quezal" },
  stranger: { label: "PC.origin.stranger" },
};

PC.culture = {
  adv: { label: "PC.culture.adv" },
  ana: { label: "PC.culture.ana" },
  ank: { label: "PC.culture.ank" },
  art: { label: "PC.culture.art" },
  ast: { label: "PC.culture.ast" },
  azi: { label: "PC.culture.azi" },
  ban: { label: "PC.culture.ban" },
  cam: { label: "PC.culture.cam" },
  gua: { label: "PC.culture.gua" },
  orc: { label: "PC.culture.orc" },
  reb: { label: "PC.culture.reb" },
  est: { label: "PC.culture.est" },
  sab: { label: "PC.culture.sab" },
  sal: { label: "PC.culture.sal" },
  vag: { label: "PC.culture.vag" },
  vel: { label: "PC.culture.vel" },
};

PC.persona = {
  aven: { label: "PC.persona.aven" },
  itin: { label: "PC.persona.itin" },
  esco: { label: "PC.persona.esco" },
  escu: { label: "PC.persona.escu" },
  visi: { label: "PC.persona.visi" },
  cura: { label: "PC.persona.cura" },
  prot: { label: "PC.persona.prot" },
  vang: { label: "PC.persona.vang" },
  arau: { label: "PC.persona.arau" },
  asse: { label: "PC.persona.asse" },
  domi: { label: "PC.persona.domi" },
  juiz: { label: "PC.persona.juiz" },
  pers: { label: "PC.persona.pers" },
  here: { label: "PC.persona.here" },
  dest: { label: "PC.persona.dest" },
  mart: { label: "PC.persona.mart" },
  zelo: { label: "PC.persona.zelo" },
  asce: { label: "PC.persona.asce" },
  gran: { label: "PC.persona.gran" },
  perd: { label: "PC.persona.perd" },
  ermi: { label: "PC.persona.ermi" },
  usur: { label: "PC.persona.usur" },
  queb: { label: "PC.persona.queb" },
  ment: { label: "PC.persona.ment" },
  miri: { label: "PC.persona.miri" },
  sabi: { label: "PC.persona.sabi" },
};

PC.attribute = {
  fis: {
    label: "PC.attribute.fis.label",
    abv: "PC.attribute.fis.abv",
  },
  des: {
    label: "PC.attribute.des.label",
    abv: "PC.attribute.des.abv",
  },
  ego: {
    label: "PC.attribute.ego.label",
    abv: "PC.attribute.ego.abv",
  },
  cog: {
    label: "PC.attribute.cog.label",
    abv: "PC.attribute.cog.abv",
  },
  esp: {
    label: "PC.attribute.esp.label",
    abv: "PC.attribute.esp.abv",
  },
};

PC.mv = { label: "PC.mv" };
PC.def = { label: "PC.def" };

PC.subattribute = {
  pv: {
    label: "PC.subattribute.pv.label",
    abv: "PC.subattribute.pv.abv",
  },
  pe: {
    label: "PC.subattribute.pe.label",
    abv: "PC.subattribute.pe.abv",
  },
};

PC.minor = {
  sau: {
    label: "PC.minor.sau.label",
    abv: "PC.minor.sau.abv",
  },
  ref: {
    label: "PC.minor.ref.label",
    abv: "PC.minor.ref.abv",
  },
  von: {
    label: "PC.minor.von.label",
    abv: "PC.minor.von.abv",
  },
};

PC.category = {
  corporais: { label: "PC.category.corporais" },
  subterfugios: { label: "PC.category.subterfugios" },
  conhecimentos: { label: "PC.category.conhecimentos" },
  oficios: { label: "PC.category.oficios" },
  sociais: { label: "PC.category.sociais" },
  espirituais: { label: "PC.category.espirituais" },
};

PC.skill = {
  atlet: { label: "PC.skill.atlet", att: "fis", learning: 1, growth: 1 },
  briga: { label: "PC.skill.briga", att: "des", learning: 1, growth: 1 },
  esgri: { label: "PC.skill.esgri", att: "des", learning: 1, growth: 1 },
  hasta: { label: "PC.skill.hasta", att: "des", learning: 1, growth: 1 },
  malha: { label: "PC.skill.malha", att: "fis", learning: 1, growth: 1 },
  resis: { label: "PC.skill.resis", att: "fis", learning: 2, growth: 2 },

  agili: { label: "PC.skill.agili", att: "des", learning: 1, growth: 1 },
  arque: { label: "PC.skill.arque", att: "des", learning: 1, growth: 2 },
  balis: { label: "PC.skill.balis", att: "des", learning: 1, growth: 2 },
  furti: { label: "PC.skill.furti", att: "des", learning: 1, growth: 1 },
  ladin: { label: "PC.skill.ladin", att: "des", learning: 1, growth: 1 },
  perce: { label: "PC.skill.perce", att: "des", learning: 1, growth: 1 },

  arcan: { label: "PC.skill.arcan", att: "cog", learning: 2, growth: 1 },
  crono: { label: "PC.skill.crono", att: "cog", learning: 2, growth: 1 },
  erudi: { label: "PC.skill.erudi", att: "cog", learning: 1, growth: 1 },
  medic: { label: "PC.skill.medic", att: "cog", learning: 1, growth: 1 },
  orien: { label: "PC.skill.orien", att: "cog", learning: 1, growth: 1 },
  sobre: { label: "PC.skill.sobre", att: "cog", learning: 1, growth: 2 },

  alqui: { label: "PC.skill.alqui", att: "cog", learning: 2, growth: 1 },
  armei: { label: "PC.skill.armei", att: "fis", learning: 2, growth: 1 },
  artes: { label: "PC.skill.artes", att: "fis", learning: 1, growth: 1 },
  condu: { label: "PC.skill.condu", att: "fis", learning: 1, growth: 1 },
  engen: { label: "PC.skill.engen", att: "cog", learning: 2, growth: 1 },
  extra: { label: "PC.skill.extra", att: "fis", learning: 1, growth: 1 },

  artim: { label: "PC.skill.artim", att: "ego", learning: 1, growth: 1 },
  bardi: { label: "PC.skill.bardi", att: "ego", learning: 2, growth: 1 },
  domar: { label: "PC.skill.domar", att: "ego", learning: 1, growth: 1 },
  expre: { label: "PC.skill.expre", att: "ego", learning: 1, growth: 1 },
  impos: { label: "PC.skill.impos", att: "ego", learning: 1, growth: 1 },
  seduc: { label: "PC.skill.seduc", att: "ego", learning: 1, growth: 1 },

  amago: { label: "PC.skill.amago", att: "esp", learning: 2, growth: 2 },
  aoism: { label: "PC.skill.aoism", att: "esp", learning: 2, growth: 1 },
  druid: { label: "PC.skill.druid", att: "esp", learning: 2, growth: 1 },
  eleme: { label: "PC.skill.eleme", att: "esp", learning: 2, growth: 1 },
  ontol: { label: "PC.skill.ontol", att: "esp", learning: 1, growth: 1 },
  sabak: { label: "PC.skill.sabak", att: "esp", learning: 2, growth: 1 },
};

PC.corporais = {
  atlet: { label: "PC.skill.atlet" },
  briga: { label: "PC.skill.briga" },
  esgri: { label: "PC.skill.esgri" },
  hasta: { label: "PC.skill.hasta" },
  malha: { label: "PC.skill.malha" },
  resis: { label: "PC.skill.resis" },
};

PC.subterfugios = {
  agili: { label: "PC.skill.agili" },
  arque: { label: "PC.skill.arque" },
  balis: { label: "PC.skill.balis" },
  furti: { label: "PC.skill.furti" },
  ladin: { label: "PC.skill.ladin" },
  perce: { label: "PC.skill.perce" },
};

PC.conhecimentos = {
  arcan: { label: "PC.skill.arcan" },
  crono: { label: "PC.skill.crono" },
  erudi: { label: "PC.skill.erudi" },
  medic: { label: "PC.skill.medic" },
  orien: { label: "PC.skill.orien" },
  sobre: { label: "PC.skill.sobre" },
};

PC.oficios = {
  alqui: { label: "PC.skill.alqui" },
  armei: { label: "PC.skill.armei" },
  artes: { label: "PC.skill.artes" },
  condu: { label: "PC.skill.condu" },
  engen: { label: "PC.skill.engen" },
  extra: { label: "PC.skill.extra" },
};

PC.sociais = {
  artim: { label: "PC.skill.artim" },
  bardi: { label: "PC.skill.bardi" },
  domar: { label: "PC.skill.domar" },
  expre: { label: "PC.skill.expre" },
  impos: { label: "PC.skill.impos" },
  seduc: { label: "PC.skill.seduc" },
};

PC.espirituais = {
  amago: { label: "PC.skill.amago" },
  aoism: { label: "PC.skill.aoism" },
  druid: { label: "PC.skill.druid" },
  eleme: { label: "PC.skill.eleme" },
  ontol: { label: "PC.skill.ontol" },
  sabak: { label: "PC.skill.sabak" },
};
