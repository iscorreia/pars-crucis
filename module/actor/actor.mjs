const defaultSight = {
  enabled: true,
  range: 0.5,
  angle: 360,
  visionMode: "darkvision",
  // Advanced options
  attenuation: 0,
  brightness: 0,
  saturation: -1,
  contrast: 0,
  color: null,
};

function isParsCrucisActorType(type) {
  return type === "persona" || type === "pdm";
}

function expectedActorLinkForType(type) {
  // Persona: linked token. PDM: unlinked token.
  return type === "persona";
}

/**
 * System-wide Actor document class.
 * Used to apply default prototype token configuration for actor types.
 * @extends { Actor }
 */
export class PCActor extends foundry.documents.Actor {
  /** @override */
  async _preCreate(data, options, user) {
    const allowed = await super._preCreate(data, options, user);
    if (allowed === false) return false;

    const type = data.type;
    if (!isParsCrucisActorType(type)) return;

    const expectedActorLink = expectedActorLinkForType(type);

    const updates = {
      prototypeToken: {
        actorLink: expectedActorLink,
        sight: { ...defaultSight },
        displayBars: CONST.TOKEN_DISPLAY_MODES.HOVER,
        bar1: {
          attribute: "subattributes.pv",
        },
        bar2: {
          attribute: "subattributes.pe",
        },
      },
    };

    this.updateSource(updates);
  }
}
