class PongGame {
	constructor(canvasId) {
		this.canvas = document.getElementById(canvasId);
		this.ctx = this.canvas.getContext('2d');
		this.playerOneScore = 0;
		this.playerTwoScore = 0;
		this.keyPressed = {};
		
		window.addEventListener('keydown', e => {
		this.keyPressed[e.keyCode] = true;
		});
		window.addEventListener('keyup', e => {
		this.keyPressed[e.keyCode] = false;
		});

		this.ball = new this.Ball(
		new this.Vector(this.canvas.width / 2, this.canvas.height / 2),
		10,
		new this.Vector(6, 2)
		);
		
		this.paddleOne = new this.Paddle(
		new this.Vector(0, this.canvas.height / 2),
		new this.Vector(0, 20),
		10,
		100,
		this
		);
		
		this.paddleTwo = new this.Paddle(
		new this.Vector(this.canvas.width - 10, this.canvas.height / 2),
		new this.Vector(0, 20),
		10,
		100,
		this
		);
	}

	Vector = class {
		constructor(x, y) {
		this.x = x;
		this.y = y;
		}
	}

	Ball = class {
		constructor(position, radius, velocity) {
		this.position = position;
		this.radius = radius;
		this.velocity = velocity;
		}

		update(canvas) {
		const nextX = this.position.x + this.velocity.x;
		const nextY = this.position.y + this.velocity.y;

		if (nextY - this.radius <= 0) {
			this.position.y = this.radius;
			this.velocity.y = Math.abs(this.velocity.y);
		} else if (nextY + this.radius >= canvas.height) {
			this.position.y = canvas.height - this.radius;
			this.velocity.y = -Math.abs(this.velocity.y);
		} else {
			this.position.y = nextY;
		}

		this.position.x = nextX;
		}

		draw(ctx) {
		ctx.fillStyle = 'white';
		ctx.beginPath();
		ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
		ctx.fill();
		}
	}

	Paddle = class {
		constructor(position, velocity, width, height, game) {
		this.position = position;
		this.velocity = velocity;
		this.width = width;
		this.height = height;
		this.game = game;
		}

		update(keyPressed, canvas) {
		if (keyPressed[87] && this.position.y > 0)
			this.position.y -= this.velocity.y;
		if (keyPressed[83] && this.position.y + this.height < canvas.height)
			this.position.y += this.velocity.y;
		}

		draw(ctx) {
		ctx.fillStyle = 'white';
		ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
		}

		getCenter() {
		return new this.game.Vector(
			this.position.x + this.width / 2,
			this.position.y + this.height / 2
		);
		}
	}

	intersectBox(ball, paddle) {
		const paddleLeft = paddle.position.x;
		const paddleRight = paddle.position.x + paddle.width;
		const paddleTop = paddle.position.y;
		const paddleBottom = paddle.position.y + paddle.height;
		
		const ballLeft = ball.position.x - ball.radius;
		const ballRight = ball.position.x + ball.radius;
		const ballTop = ball.position.y - ball.radius;
		const ballBottom = ball.position.y + ball.radius;

		if (ballRight >= paddleLeft && ballLeft <= paddleRight &&
			ballBottom >= paddleTop && ballTop <= paddleBottom) {
			
			const hitPoint = (ball.position.y - paddle.getCenter().y) / (paddle.height / 2);
			const angle = hitPoint * (Math.PI / 4);
			const speed = Math.sqrt(ball.velocity.x * ball.velocity.x + ball.velocity.y * ball.velocity.y);
			
			if (ball.position.x < paddle.getCenter().x) {
				ball.position.x = paddleLeft - ball.radius;
				ball.velocity.x = -Math.abs(speed * Math.cos(angle));
			} else {
				ball.position.x = paddleRight + ball.radius;
				ball.velocity.x = Math.abs(speed * Math.cos(angle));
			}
			
			ball.velocity.y = speed * Math.sin(angle);
		}
	}

	restartBall() {
		this.ball.position = new this.Vector(this.canvas.width / 2, this.canvas.height / 2);
		const speed = 10;
		const angle = (Math.random() - 0.5) * Math.PI / 4;
		this.ball.velocity = new this.Vector(
			(Math.random() < 0.5 ? -1 : 1) * speed * Math.cos(angle),
			speed * Math.sin(angle)
		);
	}

	scoreIncrement() {
		if (this.ball.position.x - this.ball.radius < 0) {
		this.playerTwoScore++;
		document.getElementById('playerTwoScore').innerHTML = `
			<h3>Player 2</h3>
			<p>Score : ${this.playerTwoScore}</p>
		`;
		this.restartBall();
		}
		if (this.ball.position.x + this.ball.radius > this.canvas.width) {
		this.playerOneScore++;
		document.getElementById('playerOneScore').innerHTML = `
			<h3>Player 1</h3>
			<p>Score : ${this.playerOneScore}</p>
		`;
		this.restartBall();
		}
	}

	drawTable() {
		this.ctx.fillStyle = `rgba(32, 152, 238, 0.19)`;
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
	}

	update() {
		this.ball.update(this.canvas);
		this.paddleOne.update(this.keyPressed, this.canvas);
		this.scoreIncrement();
		
		if (this.keyPressed[38] && this.paddleTwo.position.y > 0)
		this.paddleTwo.position.y -= this.paddleTwo.velocity.y;
		if (this.keyPressed[40] && this.paddleTwo.position.y + this.paddleTwo.height < this.canvas.height)
		this.paddleTwo.position.y += this.paddleTwo.velocity.y;
		
		this.intersectBox(this.ball, this.paddleOne);
		this.intersectBox(this.ball, this.paddleTwo);
	}

	render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.drawTable();
		this.paddleOne.draw(this.ctx);
		this.paddleTwo.draw(this.ctx);
		this.ball.draw(this.ctx);
	}

	gameLoop = () => {
		this.update();
		this.render();
		if (this.playerOneScore == 10 || this.playerTwoScore == 10) {
			if (this.playerOneScore > this.playerTwoScore) {
				document.getElementById('infoBoard').innerHTML = `
					<h3>Game Over.</h3>
					<p>Player 1 won, Congrats!</p>
				`
			}
			else {
				document.getElementById('infoBoard').innerHTML = `
					<h3>Game Over.</h3>
					<p>Player 2 won, Congrats!</p>
				`
			}
			return;
		}
		requestAnimationFrame(this.gameLoop);
	}

	start() {
		document.getElementById('infoBoard').innerHTML = `
			<h3>Game Ongoing.</h3>
			<p>Use [W, S] or [UP, DOWN] arrows to move.</br>May the strongest live!</p>
		`
		this.gameLoop();
	}
}
  
export default function startOfflineGame() {
	const game = new PongGame('canvas');
	game.start();
	return game;
}