import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor() {
    super();
    this.setTitle("Practice");
  }

  async getHtml() {
    return `<h1>Practice page</h1>`;
  }
}
