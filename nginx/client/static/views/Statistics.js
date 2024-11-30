import AbstractView from "./AbstractView.js";


export default class extends AbstractView {
	constructor() {
		super();
		this.setTitle("statistics")
		this.setDescription("details about a user");
	}

	/*
		games played : NO CHAT JUST A NUMBER => DONE
		global positiom : NO CHAT JUST A NUMBER
		friends position : NO CHAT JUST A NUMBER
		win/loss ratio : A CIRCULAR WITH A WIN PERCENTAGE
		games played per w/l : A LINE GRAPH THAT DISPLAYS THE WINS RATIO
	*/

	async getHtml() {
		return `
			<div class="container">
				<div class="containerVertical">
					<div class="boardContainer">
						<div>
							<h3>Games Played</h3>
							<p id="GamesPlayed">0</p>
						</div>
					</div>
					<div class="boardContainer">
						<div>
							<h3>Games Lost</h3>
							<p id="GamesLost">0</p>
						</div>
					</div>
					<div class="boardContainer">
						<div>
							<h3>Games Won</h3>
							<p id="GamesWon">0</p>
						</div>
					</div>

					<div class="boardContainer">
						<div>
							<h3>Your global position</h3>
							<p id="GlobalPosition">0</p>
						</div>
					</div>
					<div class="boardContainer">
					<div>
						<h3>Your position among your friends</h3>
						<p id="FriendsPosition">0</p>
					</div>
					</div>
					<div id="shiteHolder">
						<canvas id="WinLossRatio" style="width:100%"></canvas>
					</div>
				</div>
			</div>
		`
	}
}
