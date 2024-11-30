import AbstractView from "./AbstractView.js";


export default class extends AbstractView {
	constructor() {
		super();
		this.setTitle("Game modes")
		this.setDescription("Choose game modes");
	}

	async getHtml() {
		return `
		<div class="gameModesSuperContainer">
			<div class="gameModesContainer">
				<div class="gameModeDivContainer">
					<div class="gameModeDivContContainer">
						<h3>Create game</h3>
						<p>Create a new game an share your game ID with your friend to play together</p>
						<button id="CreateGameButton" class="gameModesBtns">Create</button>
					</div>
				</div>
				<div class="gameModeDivContainer">
					<div class="gameModeDivContContainer">
						<h3>Join game</h3>
						<p>Join an existing game using a game ID</p>
						<input id="joinGameInput" type="text" placeholder=" Game ID">
						<button id="joinGameButton" class="gameModesBtns">Join</button>
					</div>
				</div>
			</div>
		</div>
		`
	}
}