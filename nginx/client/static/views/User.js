import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor() {
    super();
    const url = new URLSearchParams(window.location.search);
    const username = url.get("name");
    this.setTitle(`${username} profile`);
  }
  async getHtml() {
    return `
    <div id="userProfileContainer">
        <div id="userTopNavContainer">
            <div id="userTopNavSearchContainer">${this.getSearchBar()}</div>
            <div id="userTopNavOptionsContainer"></div>
        </div>
        <div id="userCardContainer">
          <div id="userCardInfosContainer">
            <img id="userProfileImage" src=https://${window.location.host}/images/6.png" />
            <h2 id="userFullName"></h2>
            <span>AKA <span id="userNickName"></span></span>
            <button id="requestConvBtn" style="display:none">Send friend request</button>
          </div>
        </div>
    <h2 id="userMatchHistoryTitle">Match history</h2>
    <div class="userProfileMatchHistory">
      
    </div>
    </div>`;
  }
}
