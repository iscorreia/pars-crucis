export default function () {
  Hooks.on("preCreateActor", (actor, data, options, userId) => {
    if (actor.type !== "persona" && actor.type !== "pdm") return;

    if (!data.prototypeToken) data.prototypeToken = {};

    // Configure actorLink: true for persona, false for pdm
    data.prototypeToken.actorLink = actor.type === "persona";

    // Configure sight for both persona and pdm
    if (!data.prototypeToken.sight) data.prototypeToken.sight = {};
    data.prototypeToken.sight.enabled = true;
    data.prototypeToken.sight.range = 0.5;
    data.prototypeToken.sight.angle = 360;
    data.prototypeToken.sight.visionMode = "darkvision";
  });

  Hooks.on("createActor", async (actor, options, userId) => {
    if (actor.type !== "persona" && actor.type !== "pdm") return;

    const currentProto = actor.prototypeToken.toObject();
    const expectedActorLink = actor.type === "persona";

    if (
      currentProto.actorLink !== expectedActorLink ||
      currentProto.sight?.visionMode !== "darkvision"
    ) {
      await actor.update({
        "prototypeToken.actorLink": expectedActorLink,
        "prototypeToken.sight.enabled": true,
        "prototypeToken.sight.range": 0.5,
        "prototypeToken.sight.angle": 360,
        "prototypeToken.sight.visionMode": "darkvision",
      });
    }
  });

  // Configure tokens
  Hooks.on("preCreateToken", (tokenDocument, data, options, userId) => {
    const actorId = data.actorId || tokenDocument.actorId;
    if (!actorId) return;

    const actor = game.actors.get(actorId);

    if (!actor || (actor.type !== "persona" && actor.type !== "pdm")) return;

    data.actorLink = actor.type === "persona";

    if (!data.sight) data.sight = {};
    data.sight.enabled = true;
    data.sight.range = actor.prototypeToken?.sight?.range || 0.5;
    data.sight.angle = actor.prototypeToken?.sight?.angle || 360;
    data.sight.visionMode = "darkvision";
  });
}
