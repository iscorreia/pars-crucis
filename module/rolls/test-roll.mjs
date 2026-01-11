import PCRoll from "./basic-roll.mjs";

export default class TestRoll extends PCRoll {
  async _prepareChatRenderContext(options = {}) {
    const context = await super._prepareChatRenderContext(options);
    context.success = this.options.success;
    context.margin = this.options.margin;
    return context;
  }

  async evaluate(options = {}) {
    await super.evaluate(options);

    // Checks difficulty and sets it to 10 if difficulty is null
    const difficulty = this.options.difficulty || 10;
    this.options.success = this.total >= difficulty;
    this.options.margin = Math.min(Math.abs(this.total - difficulty), 10);

    return this;
  }

  static CHAT_TEMPLATE = "systems/pars-crucis/templates/rolls/test-roll.hbs";
}
