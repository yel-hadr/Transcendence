import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor() {
    super();
    this.setTitle("Posts");
  }

  async getHtml() {
    return `<h1>Posts page</h1> <a href="/" data-link>Home</a> `;
  }
}
