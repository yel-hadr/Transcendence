import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
	constructor() {
		super();
		this.setTitle("pong game")
		this.setDescription("online 1v1 pong game");
	}
	async getHtml() {
		return `
		<div id="onlineGameContainer" class="container">
			<div class="containerVertical">
				<div id="scoreboardsDiv" class="containerHorizontal">
					<div class="boardContainer">
						<div id="playerScoreboard" class="board"></div>
					</div>
					<div class="boardContainer">
						<div id="opponentScoreboard" class="board"></div>
					</div>
				</div>
				<canvas id="canvas" height="400" width="800"></canvas>
				<div class="boardContainer">
					<div id="infoBoard" class="board"></div>
				</div>
			</div>
		</div>
		`
	}
}