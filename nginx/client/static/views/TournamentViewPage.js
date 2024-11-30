import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor() {
    super();
    this.setTitle("Tournament hub");
	this.setDescription("Tournament hub where you can see what's up")
  }

  async getHtml() {
    return `
    <div id="tournamentHubContainer">
      <div id="adminOptions">
        <button id="adminStartTournament">Start Tournament</button>
        <button id="goNextRoundRequestBtn">Go next round</button>
      </div>
      <div id="notify">
        <p id="notfiyMsg">There is no enoght players</p>
      </div>
      <div id="tournamentHubHolder">
        <div id="meTournament" class="tournamentPlayerHolder">
          <img id="myTournamentImg" src="." />
          <span id="myTournamentUserName"></span>
          <span id="imAdmin" style="display:none">I'm admin</span>
          <button id="relaodBtn">Reload</button>
        </div>
        <span id="vsSpan">VS</span>
        <div id="oponentTournament" class="tournamentPlayerHolder">
          <img id="myEnimeImage" src="." />
          <span id="myEnimeUsername">sait-bah</span>
        </div>
      </div>
     
    </div>
   `;
  }
}
