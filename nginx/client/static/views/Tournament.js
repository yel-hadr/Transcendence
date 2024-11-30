import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor() {
    super();
    this.setTitle("Tournament page");
	this.setDescription("This is where you can create or join a tournament")
  }

  async getHtml() {
    return `
    <div id="tournamentContainer">
      <div id="tournamentOptionsContainer">
        <div class="tournamentOptionHolder">
          <h2>Create a trounament</h2>
          <div class="tournamentDiscriptionContainer">
            <p id="createTournamentTxt">Create a tounament and send the tounament link to your friends </br>You can send them the code from chat</p>
            <p class="tournamentTxtHelper"></p>
          </div>
          <div class="tounamentActionsBtnContainer">
            
            <button id="goToMyHostedTournament">
              <div class="tournamentOptionsLoading"></div>
              <span class="tournamentBtnsSpan">Go to my hosted tournament </span>
             </button>
            <button id="abortMyHostedTournament">
              <div class="tournamentOptionsLoading"></div>
              <span class="tournamentBtnsSpan">Abort my hosted tournament</span>
             </button>
            <button id="CreateTournamentButton">
              <div class="tournamentOptionsLoading"></div>
              <span class="tournamentBtnsSpan">Create</span>
             </button>
          </div>
        </div>
        <div class="tournamentOptionHolder">
          <h2>Join a tournament</h2>
          <p>Join a tounament with a tounament code</p>
          <input id="JoinTournamentInput" type="text" placeholder="Tournament ID"/>
          <div class="tounamentActionsBtnContainer">
            <div class="tournamentOptionsLoading"></div>
            <button id="JoinTournamentButton">Join</button>
          </div>
          
        </div>
      </div>
    </div>`;
  }
}
