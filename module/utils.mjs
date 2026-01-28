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
