import { PC } from "../config.mjs";

// Basic Pars Crucis roll class
export default class PCRoll extends foundry.dice.Roll {
  async _prepareChatRenderContext(options = {}) {
    const context = await super._prepareChatRenderContext(options);
    const diceTerms = this.terms.filter(
      (t) => t instanceof foundry.dice.terms.DiceTerm
    );

    const dices = diceTerms.flatMap((t) =>
      t.results.map((r) => {
        const dX = `d${t.faces}`;
        const dice = PC.dice[dX]?.label ?? "d6";
        const icon = PC.dice[dX]?.icon ?? '<i class="fa-solid fa-dice-d6"></i>';
        const status = r.active ? "active" : "discarded";
        const isMax = r.result === t.faces; // e.g., 10 on d10
        const isMin = r.result === 1; // 1 on any die

        return {
          result: r.result,
          faces: t.faces,
          active: r.active,
          icon,
          classes: [
            "dice",
            dice, // d4, d6, d8, d10, d20
            status, // active or discarded
            isMax ? "max" : null,
            isMin ? "min" : null,
          ]
            .filter(Boolean)
            .join(" "),
        };
      })
    );

    context.dices = dices;

    return context;
  }

  static CHAT_TEMPLATE = "systems/pars-crucis/templates/rolls/basic-roll.hbs";
}
