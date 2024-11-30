import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor() {
    super();
    this.setTitle("Home");
  }

  async getHtml() {
    return `
     <div id="homePageContainer">
      <div id="homePageHolder">
        <div id="topTinyBarContainer">
          ${this.getSearchBar()}
          <div id="actionBtns">
           

          </div>
        </div>
        <section id="welcomContainer" class="">
          <div id="welcomingTxt">
            <span id="homeWelcomeUser">Hello sait-bah.</span>

            <p>
              9adara alaho wa macha2a fa3al
            </p>
          </div>
          <div id="palyBtnContainer">
            <button>
              PLAY
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M21.409 9.353a2.998 2.998 0 0 1 0 5.294L8.597 21.614C6.534 22.737 4 21.277 4 18.968V5.033c0-2.31 2.534-3.769 4.597-2.648z"
                />
              </svg>
            </button>
          </div>
        </section>
        <section id="gameModesContainer">
          <div class="gameModeHolder">
            <div class="gameModeDescContainer">
              <h3>Online</h3>
              <p>Play a match online against your friend.</p>
              <button id="homeOnlinePlayButton">Play game</button>
            </div>
            <div class="gameModeImgContainer">
              <img
                src="https://${window.location.host}/images/jojo.png"
                style="width: 100%; height: 100%"
                draggable="false"
              />
              <img
                id="offlineSecondStick"
                src="https://${window.location.host}/images/jojo.png"
                style="width: 100%; height: 200px"
                draggable="false"
              />
            </div>
          </div>
          <div class="gameModeHolder">
            <div class="gameModeDescContainer">
              <h3>Offline</h3>
              <p>Play a local 1v1 match.</p>
              <button id="homeOfflinePlayButton">Play game</button>
            </div>
            <div class="gameModeImgContainer">
              <img
                src="https://${window.location.host}/images/jojo.png"
                style="width: 100%; height: 100%"
                draggable="false"
              />
            </div>
          </div>
          <div class="gameModeHolder">
            <div class="gameModeDescContainer">
              <h3>Tournament</h3>
              <p>Play tournaments agains random palyers.</p>
              <button id="homePlayTournament">Play game</button>
            </div>
            <div class="gameModeImgContainer">
              <img
                src="https://${window.location.host}/images/cup.png"
                style="width: 100%; height: 100%"
                draggable="false"
              />
            </div>
          </div>
          <div class="gameModeHolder">
            <div class="gameModeDescContainer">
              <h3>Perfomance</h3>
              <p>Check progress in game modes.</p>
              <button id="PerformanceButton">Check</button>
            </div>
            <div class="gameModeImgContainer">
              <img
                src="https://${window.location.host}/images/war3.png"
                style="width: 100%; height: 100%"
                draggable="false"
              />
            </div>
          </div>
        </section>

        <section id="leaderboardContainer">
          <div id="leaderboardHolder">
            <div class="leaderboardTypeContainer">
              <h3>Global leaderbaord</h3>
              <div class="leaderboardHeader">
                <ul>
                  <li>Players</li>
                  <li>Score</li>
                </ul>
              </div>
              
            
            </div>
            <div class="leaderboardTypeContainer">
              <h3>Friends leaderboard</h3>
              <div class="leaderboardHeader">
                <ul>
                  <li>Players</li>
                  <li>Score</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div id="homePageSideBarContainer">
        <div id="homePageSideBarWrapper">
          <div id="homePageSideBarHolder">
            <h3>My profile</h3>
            <div id="homePageProfileContainer">
              <div id="homePageProfileHolder">
                <img src="https://${window.location.host}/images/6.png" />
                <div id="homePageProfileNameContainer">
                  <div id="homePageProfileNameWrapper">
                    <span id="homePageUserName">Salah-eddine</span>
                    <span>Level: 5.50</span>
                  </div>
                </div>
              </div>

              <div id="homePageRankHolder">
                <img src="https://${window.location.host}/images/rankso.png" />
              </div>
            </div>
            <span class="sideBarVertical"></span>
            <div id="profileActivitiesContainer">
              <div class="profileActivityHolder">
                <span>Last Game</span>
                <span>Won</span>
              </div>
              <div class="profileActivityHolder">
                <span>Status</span>
                <button class="homePageOnlineState">Online</button>
              </div>
              <div class="profileActivityHolder">
                <span>Progress</span>
                <span>+125</span>
              </div>
            </div>
          </div>
        </div>
        <div id="recentActivityContainer">
          <div id="recentActivityWrapper">
            
            <h3>Recent activities</h3>
            <div id="recentActivityHolder">
              <div id="recentActivitiesOptionsContainer">
                <div id="recentActivitiesOptionsHolder">
                  <button>Me</button>
                  <button>Friends</button>
                </div>
              </div>
              <ol>
                <li>
                  <span class="activityTime">12:00</span>
                  <img src="https://${window.location.host}/images/6.png" />
                  <span> sait-bah won a game against bobolala </span>
                </li>
              </ol>
              </div>
            </div>
        </div>
      </div>
    </div>
    `;
  }
}
