import PCRoll from "./basic-roll.mjs";

export default class TestRoll extends PCRoll {
  async _prepareChatRenderContext(options = {}) {
    const context = await super._prepareChatRenderContext(options);
    const { info, margin, success, itemName, actionName, img, type } =
      this.options;

    Object.assign(context, {
      success: success,
      margin: margin,
      itemName: itemName,
      actionName: actionName,
      img: img,
      info: info,
      type: type,
    });

    // console.log("TestRoll this", this);
    // console.log("TextRoll context", context);

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
