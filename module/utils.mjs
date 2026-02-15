function sumKwVal(a, b) {
  const na = Number(a);
  const nb = Number(b);
  const aIsNum = Number.isFinite(na);
  const bIsNum = Number.isFinite(nb);
  if (aIsNum && bIsNum) return `+${na + nb}`;
  return a;
}

function lowestKwVal(a, b) {
  const na = Number(a);
  const nb = Number(b);
  const aIsNum = Number.isFinite(na);
  const bIsNum = Number.isFinite(nb);
  if (aIsNum && bIsNum) return Math.min(na, nb);
  return a;
}

// Should be called only when a keyword is present in both set A and set B
function keywordMerger(a, b, key) {
  switch (key) {
    case "lethality":
      const aIsDiv = a === "/2";
      const bIsDiv = b === "/2";
      const na = Number(a);
      const nb = Number(b);
      const aIsNum = Number.isFinite(na);
      const bIsNum = Number.isFinite(nb);
      if (aIsDiv && bIsDiv) return "/2";
      if (aIsNum && bIsNum) return `+${na + nb}`;
      if ((aIsNum && bIsDiv) || (aIsDiv && bIsNum)) {
        const n = aIsNum ? na : nb;
        const result = (1 + n) / 2 - 1;
        return result > 0 ? `+${result}` : undefined;
      }
      return a;
    case "handling":
    case "modifier":
    case "plague":
      return sumKwVal(a, b);
    case "fragile":
    case "freezing":
    case "impact":
      return lowestKwVal(a, b);
    default:
      return a;
  }
}

export function keywordResolver(kwSetA, kwSetB) {
  const keywords = {};
  const keys = new Set([...Object.keys(kwSetA), ...Object.keys(kwSetB)]);

  for (const key of keys) {
    const a = kwSetA[key];
    const b = kwSetB[key];
    if (a !== undefined && b === undefined) {
      keywords[key] = a;
      continue;
    }
    if (a === undefined && b !== undefined) {
      keywords[key] = b;
      continue;
    }
    // Exists in both sets, verify merge rules
    keywords[key] = keywordMerger(a, b, key);
  }

  // Remove undefined keywords, they should always have a value or be null
  for (const key of Object.keys(keywords)) {
    if (keywords[key] === undefined) {
      delete keywords[key];
    }
  }

  return keywords;
}

export function getBestSkillData(system, skills) {
  if (!skills || Object.keys(skills).length === 0) {
    return {
      skillId: null,
      level: 0,
      modifiers: 0,
      total: 0,
    };
  }
  let best = null;
  for (const skillId of Object.keys(skills)) {
    const skill = system.skills[skillId];
    if (!skill) continue;
    const { category, modGroup, level, mod } = skill;
    const categoryMod = system.categoryModifiers?.[category] ?? 0;
    const groupMod = modGroup
      ? (system.groupModifiers?.[modGroup]?.mod ?? 0)
      : 0;
    const modifiers = categoryMod + groupMod + mod;
    const total = level + modifiers;
    if (!best || total > best.total)
      best = { skillId, level, modifiers, total };
  }
  return (
    best ?? {
      skillId: null,
      level: 0,
      modifiers: 0,
      total: 0,
    }
  );
}

export function skillsMerger(skillsObjA = {}, skillsObjB = {}) {
  const result = {};
  for (const [key, value] of Object.entries(skillsObjA)) {
    if (key === "inherit") continue;
    result[key] = value ?? 0;
  }
  for (const [key, value] of Object.entries(skillsObjB)) {
    if (key === "inherit") continue;
    result[key] = (result[key] ?? 0) + value ?? 0;
  }
  return result;
}
