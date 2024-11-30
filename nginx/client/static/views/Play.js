import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor() {
    super();
    this.setTitle("Play");
  }

  async getHtml() {
    return `  <h1>Play page</h1> <div id="homeImageContainer"></div>`;
  }
}
