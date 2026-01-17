export default function () {
  /**
   * @param {ChatMessage} message   The ChatMessage document being rendered
   * @param {jQuery} html           The pending HTMLElement as a jQuery object
   * @param {object} data           The input data provided for template rendering
   */
  Hooks.on("renderChatMessageHTML", (message, html, data) => {
    const actor = game.actors.get(message.speaker.actor);
    if (!actor) return;

    const token = message.speaker.token
      ? canvas?.tokens?.get(message.speaker.token)
      : null;
    const imgSrc = token?.document?.texture?.src || actor.img;
    if (!imgSrc) return;

    // Create image layer div
    const bgDiv = document.createElement("div");
    bgDiv.className = "pc-actor-bg";
    bgDiv.style.backgroundImage = `url("${imgSrc}")`;

    // Inject it as the first child so it sits behind the message content
    html.prepend(bgDiv);
  });
}
