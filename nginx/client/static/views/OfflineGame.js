import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
	constructor() {
		super();
		this.setTitle("pong game")
		this.setDescription("offline 1v1 pong game");
	}
	async getHtml() {
		return `
		<div id="onlineGameContainer" class="container">
			<div class="containerVertical">
				<div id="scoreboardsDiv" class="containerHorizontal">
					<div class="boardContainer">
						<div id="playerOneScore" class="board">
							<h3>Player 1</h3>
							<p>Score : 0</p>
						</div>
					</div>
					<div class="boardContainer">
						<div id="playerTwoScore" class="board">
							<h3>Player 2</h3>
							<p>Score : 0</p>
						</div>
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