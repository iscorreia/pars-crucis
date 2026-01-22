const defaultSight = {
  enabled: true,
  range: 0.5,
  angle: 360,
  visionMode: "darkvision",
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
  async _preCreate(data, options, userId) {
    await super._preCreate(data, options, userId);

    const type = data?.type ?? this.type;
    if (!isParsCrucisActorType(type)) return;

    // Apply defaults to the prototype token at creation-time.
    const expectedActorLink = expectedActorLinkForType(type);
    this.updateSource({
      "prototypeToken.actorLink": expectedActorLink,
      "prototypeToken.sight.enabled": defaultSight.enabled,
      "prototypeToken.sight.range": defaultSight.range,
      "prototypeToken.sight.angle": defaultSight.angle,
      "prototypeToken.sight.visionMode": defaultSight.visionMode,
    });
  }

  /** @override */
  async _onCreate(data, options, userId) {
    await super._onCreate(data, options, userId);

    const type = this.type;
    if (!isParsCrucisActorType(type)) return;

    // Eensure the prototype token persisted as expected.
    const expectedActorLink = expectedActorLinkForType(type);
    const sight = this.prototypeToken?.sight ?? {};

    const needsUpdate =
      this.prototypeToken?.actorLink !== expectedActorLink ||
      sight.enabled !== defaultSight.enabled ||
      sight.range !== defaultSight.range ||
      sight.angle !== defaultSight.angle ||
      sight.visionMode !== defaultSight.visionMode;

    if (!needsUpdate) return;

    await this.update({
      "prototypeToken.actorLink": expectedActorLink,
      "prototypeToken.sight.enabled": defaultSight.enabled,
      "prototypeToken.sight.range": defaultSight.range,
      "prototypeToken.sight.angle": defaultSight.angle,
      "prototypeToken.sight.visionMode": defaultSight.visionMode,
    });
  }
}
