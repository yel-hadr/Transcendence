import { router } from "./index.js";

const navigateTo = (url) => {
	history.pushState(null, null, url);
	router();
};

class PongGame {
    constructor() {
        this.socket = null;
        this.canvas = null;
        this.ctx = null;
        this.playerInfo = null;
        this.gameId = null;
        this.playerID = null;
        this.userID = null;
        this.playerSide = null;
        this.opponentID = null;
        this.gameInProgress = false;
		this.observer = null;
		this.TournamentID = null;

        this.PADDLE_WIDTH = 10;
        this.PADDLE_HEIGHT = 100;
        this.BALL_SIZE = 10;

        this.player = {
            x: 0,
            y: 0,
            width: this.PADDLE_WIDTH,
            height: this.PADDLE_HEIGHT,
            score: 0,
            color: 'white'
        };

        this.opponent = {
            x: 0,
            y: 0,
            width: this.PADDLE_WIDTH,
            height: this.PADDLE_HEIGHT,
            score: 0,
            color: 'white'
        };

        this.ball = {
            x: 0,
            y: 0,
            size: this.BALL_SIZE,
            color: 'white'
        };

        this.handleKeyDown = this.handleKeyDown.bind(this);
		this.cleanup = this.cleanup.bind(this);
    }

    async getUserInfo() {
        return new Promise((resolve, reject) => {
            fetch(`https://${window.location.host}/api/self`, {
                method: 'GET',
                credentials: "include",
                headers: {
                    "Authorization": localStorage.getItem("Authorization")
                }
            }).then(res => {
                if (res.status === 200) {
                    res.json().then(resolve);
                } else {
                    resolve(res);
                }
            });
        });
    }

    async initialize() {
        const urlParams = new URLSearchParams(window.location.search);
        this.gameId = urlParams.get("gameID");

		if (urlParams.has('tournament')) {
			this.TournamentID = urlParams.get(this.TournamentID);
		}

        this.playerInfo = await this.getUserInfo();
        this.playerID = this.playerInfo.username;
        this.userID = this.playerInfo.id;

        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');

        this.playerScoreboard = document.getElementById("playerScoreboard");
        this.opponentScoreboard = document.getElementById("opponentScoreboard");
        this.infoBoard = document.getElementById("infoBoard");

        this.ball.x = this.canvas.width / 2;
        this.ball.y = this.canvas.height / 2;

        this.initializeWebSocket();
		this.initializeMutationObserver();

        document.addEventListener('keydown', this.handleKeyDown);

        this.gameLoop();
    }


    initializeMutationObserver() {
        this.observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.removedNodes) {
                    if (node.id === 'onlineGameContainer' || 
                        (node.querySelector && node.querySelector('#onlineGameContainer'))) {
                        this.cleanup();
                        return;
                    }
                }
            }
        });

        this.observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    cleanup() {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }

        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }

        document.removeEventListener('keydown', this.handleKeyDown);

        this.gameInProgress = false;

        console.log('Game cleanup completed');
    }

    initializeWebSocket() {
        this.socket = new WebSocket(
            `wss://${window.location.host}/webs/game/${this.gameId}/${this.playerID}/${this.userID}/`
        );

        this.socket.onopen = () => console.log('WebSocket is connected.');
        this.socket.onmessage = (event) => this.handleWebSocketMessage(event);
        this.socket.onclose = (event) => this.handleWebSocketClose(event);
    }

    handleWebSocketMessage(event) {
        const data = JSON.parse(event.data);

        const messageHandlers = {
            playerInfo: () => this.handlePlayerInfo(data),
            PlayerDisconnected: () => this.handlePlayerDisconnected(),
            gameResuming: () => this.handleGameResuming(data),
            GameStarting: () => this.handleGameStarting(data),
            gameStateUpdate: () => this.handleGameStateUpdate(data),
            scoreUpdate: () => this.handleScoreUpdate(data),
            gameOver: () => this.handleGameOver(data)
        };

        if (messageHandlers[data.type]) {
            messageHandlers[data.type]();
        }
    }

    handlePlayerInfo(data) {
        this.playerSide = data.playerSide;
        this.resetPaddlePositions();
        this.updateScoreboards();
        
        if (data.gameStatus === 'waiting') {
            this.updateInfoBoard('Waiting', `Waiting for a player to join, Game ID: ${this.gameId}`);
        }
    }

    handlePlayerDisconnected() {
        this.gameInProgress = false;
        this.updateInfoBoard('Waiting', `Player disconnected, Game ID: ${this.gameId}`);
    }

    handleGameResuming(data) {
        this.playerSide = data.playerSide;
		this.updateGameState(data.gameState);
        this.extractOpponentInfo(data.gameState);
        this.updateScoreboards();
        this.updateInfoBoard('Starting soon', 'Player Rejoined, game resuming in 5 seconds...');
    }

    handleGameStarting(data) {
        this.extractOpponentInfo(data.gameState);
        this.updateScoreboards();
        this.updateInfoBoard('Starting soon', 'Buckle up! Game will start in 5 seconds...');
    }

    handleGameStateUpdate(data) {
        if (!this.gameInProgress) {
            this.gameInProgress = true;
            this.updateInfoBoard('Game in progress', `Hurry up! show ${this.opponentID} who's boss!`);
        }

        this.updateGameState(data.gameState);
    }

	handleScoreUpdate(data) {
		this.updateGameState(data.gameState);
		this.updateScoreboards();
	}

	reportGameConcluded() {
		tourSocket = new WebSocket(`wss://${window.location.host}/webs/tournament/${this.TournamentID}/${this.playerID}/${this.userID}/`);

		tourSocket.onopen = () => console.log('tour WebSocket is connected.');
        tourSocket.onmessage = () => console.log('tour server sent something.');
        tourSocket.onclose = () => console.log('tour websocket closed.');

		const broadcastData = {
			type: 'matchEnded',
			winnerUsername: this.playerID,
			winnerUserID: this.userID
		};

		tourSocket.send(JSON.stringify(broadcastData));
		tourSocket.close();

		navigateTo(`/TournamentHub?TournamentID=${this.TournamentID}`);
	}

    handleGameOver(data) {
        const winner = data.gameState.scores[this.playerID].score === 5 ? this.playerID : this.opponentID;
        this.updateScoreboards();
        
        const title = winner === this.playerID ? 'Congratulations' : 'Sorry';
        const message = winner === this.playerID 
            ? `You've Won! ${this.opponentID} has been totally defeated and we doubt he wants to play again...`
            : `You've Lost... ${this.opponentID} has achieved total victory, lay down your weapons and embrace your defeat.`;
        
        this.updateInfoBoard(title, message);

		if (this.TournamentID !== null && winner === this.playerID) {
			this.reportGameConcluded();
		}
    }

    handleWebSocketClose(event) {
        if (event.code) {
			document.getElementById('scoreboardsDiv').style.display = 'none';
			document.getElementById('canvas').style.display = 'none';
            this.updateInfoBoard('Error', 'Game does not exist or has been already concluded.');
        }
        console.log('WebSocket is closed now.');
        this.cleanup();
    }

    resetPaddlePositions() {
        if (this.playerSide === 'left') {
            this.player.x = 0;
            this.opponent.x = this.canvas.width - this.PADDLE_WIDTH;
        } else {
            this.player.x = this.canvas.width - this.PADDLE_WIDTH;
            this.opponent.x = 0;
        }
        
        this.player.y = (this.canvas.height - this.PADDLE_HEIGHT) / 2;
        this.opponent.y = (this.canvas.height - this.PADDLE_HEIGHT) / 2;
    }

    extractOpponentInfo(gameState) {
        for (const playerDataID in gameState.paddlePosition) {
            const playerData = gameState.paddlePosition[playerDataID];
            if (playerData.playerID !== this.playerID) {
                this.opponentID = playerData.playerID;
                break;
            }
        }
    }

    updateGameState(gameState) {
        for (const playerDataID in gameState.paddlePosition) {
            const playerData = gameState.paddlePosition[playerDataID];
            if (playerData.playerID === this.playerID) {
                this.player.y = playerData.y;
            } else {
                this.opponent.y = playerData.y;
            }
        }

        for (const scoresPlayerID in gameState.scores) {
            const scores = gameState.scores[scoresPlayerID];
            if (scores.playerID === this.playerID) {
                this.player.score = scores.score;
            } else {
                this.opponent.score = scores.score;
            }
        }

        this.ball.x = gameState.ballPosition.x;
        this.ball.y = gameState.ballPosition.y;
    }

    updateScoreboards() {
        this.playerScoreboard.innerHTML = `
            <h3>${this.playerID}</h3>
            <p>Score : ${this.player.score}</p>
        `;
        this.opponentScoreboard.innerHTML = `
            <h3>${this.opponentID}</h3>
            <p>Score : ${this.opponent.score}</p>
        `;
    }

    updateInfoBoard(title, message) {
        this.infoBoard.innerHTML = `
            <h3>${title}</h3>
            <p>${message}</p>
        `;
    }

    movePaddle(direction) {
        if (this.playerID !== 'spectator') {
            const moveData = {
                type: 'paddleMove',
                sender: this.playerID,
                direction: direction
            };
            this.socket.send(JSON.stringify(moveData));
        }
    }

    handleKeyDown(event) {
        if (event.key === 'ArrowUp') {
            this.movePaddle('up');
        } else if (event.key === 'ArrowDown') {
            this.movePaddle('down');
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = `rgba(32, 152, 238, 0.19)`;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = this.player.color;
        this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
        
        this.ctx.fillStyle = this.opponent.color;
        this.ctx.fillRect(this.opponent.x, this.opponent.y, this.opponent.width, this.opponent.height);
        
        this.ctx.fillStyle = this.ball.color;
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.size, 0, Math.PI * 2);
        this.ctx.fill();
    }

    gameLoop() {
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

export default function startGame() {
    const game = new PongGame();
    game.initialize();
    return game;
}