from channels.generic.websocket import AsyncWebsocketConsumer
import asyncio
import json
import random
import aiohttp
import os
import logging
import ssl
import requests

logger = logging.getLogger(__name__)


VAULT_HOST="vault:8200"

def get_secret(secret_name):
    try :
        headers = {
                "X-Vault-Token" : os.environ["VAULT_TOKEN"]
                }
        r = requests.get(f"http://{VAULT_HOST}/v1/secret/data/{secret_name}", headers=headers)
        j = r.json()["data"]["data"][secret_name]
        return (j)
    except:
        print(f"zeb dial {secret_name}")
        return ("null")
admin_user = get_secret("API_ADMIN")
admin_pass = get_secret("API_PASS")

class GameConsumer(AsyncWebsocketConsumer):
	gameStates = {}
	gameTasks = {}
	SCREEN_WIDTH = 800
	SCREEN_HEIGHT = 400
	PADDLE_WIDTH = 10
	PADDLE_HEIGHT = 100
	PADDLE_SPEED = 10
	BALL_SPEED = 6

	async def connect(self):
		self.gameID = self.scope['url_route']['kwargs']['game_id']
		self.playerID = self.scope['url_route']['kwargs']['username']
		self.userID = self.scope['url_route']['kwargs']['userid']
		self.room_group_name = f'game_{self.gameID}'
		self.gameInfo = await self.getGameStatus()

		if not self.gameInfo:
			await self.close(code=4000)
			return
		
		if 'error' in self.gameInfo or self.gameInfo.get('game_status') == 'done':
			await self.close(code=4001)
			return

		await self.accept()

		await self.channel_layer.group_add(
			self.room_group_name,
			self.channel_name
		)

		if self.gameID not in self.gameStates:
			direction_x = random.choice([-self.BALL_SPEED, self.BALL_SPEED])
			direction_y = random.choice([-self.BALL_SPEED, self.BALL_SPEED])
			total = (direction_x**2 + direction_y**2)**0.5
			self.gameStates[self.gameID] = {
				'paddlePosition': {},
				'scores': {},
				'ballPosition': {
					'x': self.SCREEN_WIDTH / 2,
					'y': self.SCREEN_HEIGHT / 2
				},
				'ballDirection': {
					'x': (direction_x / total) * self.BALL_SPEED,
					'y': (direction_y / total) * self.BALL_SPEED
				},
				'gameStarted': False,
				'gamePaused': False,
				'gameOver': False,
				'rejoinStatus': False,
				'playersConnected': {}
			}

		if self.playerID not in self.gameStates[self.gameID]['paddlePosition']:
			self.playerSide = 'left' if len(self.gameStates[self.gameID]['paddlePosition']) == 0 else 'right'
			self.gameStates[self.gameID]['paddlePosition'][self.playerID] =  {
				'y' : (self.SCREEN_HEIGHT - self.PADDLE_HEIGHT) / 2,
				'playerID' : self.playerID,
				'side' : self.playerSide,
				'userID': self.userID
			}
			self.gameStates[self.gameID]['scores'][self.playerID] = {
				'score' : 0,
				'playerID' : self.playerID,
				'side' : self.playerSide,
				'userID': self.userID
			}
		else:
			self.playerSide = self.gameStates[self.gameID]['paddlePosition'][self.playerID]['side']

		if self.playerID not in self.gameStates[self.gameID]['playersConnected']:
			self.gameStates[self.gameID]['playersConnected'][self.playerID] = {
				'connections': 1
			}
		else:
			self.gameStates[self.gameID]['playersConnected'][self.playerID]['connections'] += 1

		await self.send(text_data=json.dumps({
			'type': 'playerInfo',
			'playerID' : self.playerID,
			'playerSide': self.playerSide,
			'gameStatus': 'gameStarted' if self.gameStates[self.gameID]['gameStarted'] == True else 'waiting'
		}))

		if self.gameStates[self.gameID]['gameStarted'] == False and len(self.gameStates[self.gameID]['playersConnected']) == 2:
			self.gameTasks[self.gameID] = asyncio.create_task(self.gameLoop(self.gameID))
			self.gameStates[self.gameID]['gameStarted'] = True

		if len(self.gameStates[self.gameID]['playersConnected']) == 2:
			if self.gameStates[self.gameID]['gamePaused'] == True:
				self.gameStates[self.gameID]['rejoinStatus'] = True

	async def receive(self, text_data):
		data = json.loads(text_data)
		if data['type'] == 'paddleMove':
			if data['direction'] == 'up':
				position = self.gameStates[self.gameID]['paddlePosition'][self.playerID]['y'] - self.PADDLE_SPEED
				if position < 0:
					position = 0
			else:
				position = self.gameStates[self.gameID]['paddlePosition'][self.playerID]['y'] + self.PADDLE_SPEED
				if position > self.SCREEN_HEIGHT - self.PADDLE_HEIGHT:
					position = self.SCREEN_HEIGHT - self.PADDLE_HEIGHT
			self.gameStates[self.gameID]['paddlePosition'][self.playerID]['y'] = position

	async def disconnect(self, close_code):
		if self.gameID in self.gameStates:
			if  self.gameID in self.gameStates and len(self.gameStates[self.gameID]['playersConnected']) == 1 and self.gameStates[self.gameID]['playersConnected'][self.playerID]['connections'] == 1:
				self.gameStates[self.gameID]['paddlePosition'].clear()
				self.gameStates[self.gameID]['scores'].clear()

			if self.gameID in self.gameStates and self.gameStates[self.gameID]['playersConnected'][self.playerID]['connections'] == 1:
				del self.gameStates[self.gameID]['playersConnected'][self.playerID]
			elif self.gameID in self.gameStates:
				self.gameStates[self.gameID]['playersConnected'][self.playerID]['connections'] -= 1

			if self.gameID in self.gameStates and not self.gameStates[self.gameID]['paddlePosition'] and not self.gameStates[self.gameID]['gameOver']:
				del self.gameStates[self.gameID]
				await self.abortGame()
				if self.gameID in self.gameTasks:
					self.gameTasks[self.gameID].cancel()
					del self.gameTasks[self.gameID]
			elif self.gameID in self.gameStates and not self.gameStates[self.gameID]['gameOver']:
				await self.channel_layer.group_send(
					self.room_group_name,
					{
						'type': 'notifyPlayers',
						'status': 'PlayerDisconnected',
						'gameState': self.gameStates[self.gameID]
					}
				)

		await self.channel_layer.group_discard(
			self.room_group_name,
			self.channel_name
		)

		if self.gameID in self.gameStates:
			if len(self.gameStates[self.gameID]['playersConnected']) == 1 and not self.gameStates[self.gameID]['gameOver']:
				self.gameStates[self.gameID]['gamePaused'] = True

	async def gameLoop(self, gameID):
		await self.channel_layer.group_send(
			self.room_group_name,
			{
				'type' : 'notifyPlayers',
				'status' : 'GameStarting',
				'gameState' : self.gameStates[self.gameID]
			}
		)

		await asyncio.sleep(5)

		try:
			multiplier = 1
			bounceCounter = 0
			while self.gameStates[gameID]['gameOver'] == False:
				if self.gameStates[gameID]['gamePaused'] == False:

					if self.gameStates[gameID]['ballPosition']['y'] < 0:
						self.gameStates[gameID]['ballPosition']['y'] = 0
						self.gameStates[gameID]['ballDirection']['y'] *= -1
						bounceCounter += 1
					elif self.gameStates[gameID]['ballPosition']['y'] > self.SCREEN_HEIGHT:
						self.gameStates[gameID]['ballPosition']['y'] = self.SCREEN_HEIGHT
						self.gameStates[gameID]['ballDirection']['y'] *= -1
						bounceCounter += 1

					for playerID in self.gameStates[gameID]['paddlePosition']:
						paddle_pos = self.gameStates[gameID]['paddlePosition'][playerID]
						ball_pos = self.gameStates[gameID]['ballPosition']
						
						relative_intersect_y = (paddle_pos['y'] + (self.PADDLE_HEIGHT / 2)) - ball_pos['y']
						normalized_intersect = relative_intersect_y / (self.PADDLE_HEIGHT / 2)
						bounce_angle = normalized_intersect * 0.95
						
						if paddle_pos['side'] == 'left':
							if (0 <= ball_pos['x'] <= self.PADDLE_WIDTH and 
								paddle_pos['y'] - 2 <= ball_pos['y'] <= paddle_pos['y'] + self.PADDLE_HEIGHT + 2):
								
								ball_pos['x'] = self.PADDLE_WIDTH
								
								self.gameStates[gameID]['ballDirection']['x'] = abs(self.gameStates[gameID]['ballDirection']['x'])
								self.gameStates[gameID]['ballDirection']['y'] = -bounce_angle
								
								total = (self.gameStates[gameID]['ballDirection']['x']**2 + 
										self.gameStates[gameID]['ballDirection']['y']**2)**0.5
								self.gameStates[gameID]['ballDirection']['x'] /= total
								self.gameStates[gameID]['ballDirection']['y'] /= total
								
								self.gameStates[gameID]['ballDirection']['x'] *= (self.BALL_SPEED * multiplier)
								self.gameStates[gameID]['ballDirection']['y'] *= (self.BALL_SPEED * multiplier)

								bounceCounter += 1
						else:
							if (self.SCREEN_WIDTH - self.PADDLE_WIDTH <= ball_pos['x'] <= self.SCREEN_WIDTH and 
								paddle_pos['y'] - 2 <= ball_pos['y'] <= paddle_pos['y'] + self.PADDLE_HEIGHT + 2):
								
								ball_pos['x'] = self.SCREEN_WIDTH - self.PADDLE_WIDTH
								
								self.gameStates[gameID]['ballDirection']['x'] = -abs(self.gameStates[gameID]['ballDirection']['x'])
								self.gameStates[gameID]['ballDirection']['y'] = -bounce_angle
								
								total = (self.gameStates[gameID]['ballDirection']['x']**2 + 
										self.gameStates[gameID]['ballDirection']['y']**2)**0.5
								self.gameStates[gameID]['ballDirection']['x'] /= total
								self.gameStates[gameID]['ballDirection']['y'] /= total
								
								self.gameStates[gameID]['ballDirection']['x'] *= (self.BALL_SPEED * multiplier)
								self.gameStates[gameID]['ballDirection']['y'] *= (self.BALL_SPEED * multiplier)

								bounceCounter += 1

					if self.gameStates[gameID]['ballPosition']['x'] < 0 or self.gameStates[gameID]['ballPosition']['x'] > self.SCREEN_WIDTH:
						scorerID = 0
						if self.gameStates[gameID]['ballPosition']['x'] < 0:
							for playerID in self.gameStates[gameID]['paddlePosition']:
								if self.gameStates[gameID]['paddlePosition'][playerID]['side'] == 'right':
									self.gameStates[gameID]['scores'][playerID]['score'] += 1
									scorerID = self.gameStates[gameID]['paddlePosition'][playerID]['userID']
									await self.reportGoalScored(scorerID)
									break
						elif self.gameStates[gameID]['ballPosition']['x'] > self.SCREEN_WIDTH:
							for playerID in self.gameStates[gameID]['paddlePosition']:
								if self.gameStates[gameID]['paddlePosition'][playerID]['side'] == 'left':
									self.gameStates[gameID]['scores'][playerID]['score'] += 1
									scorerID = self.gameStates[gameID]['paddlePosition'][playerID]['userID']
									await self.reportGoalScored(scorerID)
									break

						await self.channel_layer.group_send(
							self.room_group_name,
							{
								'type' : 'notifyScore',
								'status' : 'scoreUpdate',
								'scorer': scorerID,
								'gameState' : self.gameStates[self.gameID]
							}
						)
						
						self.gameStates[gameID]['ballPosition']['x'] = self.SCREEN_WIDTH / 2
						self.gameStates[gameID]['ballPosition']['y'] = self.SCREEN_HEIGHT / 2
						
						direction_x = random.choice([-self.BALL_SPEED, self.BALL_SPEED])
						direction_y = random.choice([-self.BALL_SPEED, self.BALL_SPEED])

						total = (direction_x**2 + direction_y**2)**0.5
						self.gameStates[gameID]['ballDirection']['x'] = (direction_x / total) * self.BALL_SPEED
						self.gameStates[gameID]['ballDirection']['y'] = (direction_y / total) * self.BALL_SPEED
						
						bounceCounter = 0
						multiplier = 1

					self.gameStates[gameID]['ballPosition']['x'] += self.gameStates[gameID]['ballDirection']['x']
					self.gameStates[gameID]['ballPosition']['y'] += self.gameStates[gameID]['ballDirection']['y']

					if bounceCounter == 5:
						bounceCounter = 0
						multiplier += 0.1

					await self.channel_layer.group_send(
						self.room_group_name,
						{
							'type': 'gameStateUpdate',
							'gameState': self.gameStates[gameID],
							'playerID': self.playerID,
							'side': self.playerSide
						}
					)
				elif self.gameStates[self.gameID]['rejoinStatus'] == True:
					await self.channel_layer.group_send(
						self.room_group_name,
						{
							'type': 'notifyPlayers',
							'status': 'gameResuming',
							'gameState': self.gameStates[self.gameID]
						}
					)
					await asyncio.sleep(5)
					self.gameStates[self.gameID]['rejoinStatus'] = False
					self.gameStates[self.gameID]['gamePaused'] = False

				await asyncio.sleep(0.02)

				for playerID in self.gameStates[gameID]['scores']:
					if self.gameStates[gameID]['scores'][playerID]['score'] == 5:
						self.gameStates[gameID]['gameOver'] = True
						await self.channel_layer.group_send(
							self.room_group_name,
							{
								'type': 'notifyPlayers',
								'status': 'gameOver',
								'gameState': self.gameStates[gameID]
							}
						)
						await self.reportGameConcluded()
						asyncio.current_task().cancel()

		except asyncio.CancelledError:
			self.cleanup()

	async def cleanup(self):
		if self.gameID in self.gameStates:
			self.gameStates[self.gameID]['paddlePositions'].clear()
			self.gameStates[self.gameID]['scores'].clear()
			self.gameStates[self.gameID]['playersConnected'].clear()
			del self.gameStates[self.gameID]
		if self.gameID in self.gameTasks:
			del self.gameTasks[self.gameID]
		self.close()

	async def gameStateUpdate(self, event):
		await self.send(text_data=json.dumps({
			'type': 'gameStateUpdate',
			'gameState': event['gameState']
		}))

	async def notifyPlayers(self, event):
		await self.send(text_data=json.dumps({
			'type': event['status'],
			'playerID' : self.playerID,
			'playerSide': self.playerSide,
			'gameState': event['gameState']
		}))
	
	async def notifyScore(self, event):
		await self.send(text_data=json.dumps({
			'type': event['status'],
			'scorerID': event['scorer'],
			'gameState': self.gameStates[self.gameID]
		}))

	async def login(self):
		data = {
			"username": admin_user,
			"password": admin_pass,
		}
		ssl_context = ssl.create_default_context()
		ssl_context.check_hostname = False
		ssl_context.verify_mode = ssl.CERT_NONE 
		async with aiohttp.ClientSession() as session:
			async with session.post('https://nginx/api/login', 
									data=data, 
									ssl=ssl_context) as response:
				result = await response.json()
				return result.get('token')

	async def reportGoalScored(self, scorerID):
		try:
			token = await self.login()
			if not token:
				print("Failed to obtain authentication token")
				return

			headers = {"Authorization": f"Bearer {token}"}
			data = {
				'game_id': self.gameID,
				'scorer_id': scorerID
			}
			ssl_context = ssl.create_default_context()
			ssl_context.check_hostname = False
			ssl_context.verify_mode = ssl.CERT_NONE 
			async with aiohttp.ClientSession() as session:
				async with session.post('https://nginx/api/register_goal',
										headers=headers,
										data=data,
										ssl=ssl_context) as response:
					result = await response.json()
					if 'error' in result:
						print(f"Error reporting goal: {result['error']}")

		except Exception as e:
			print(f"Error reporting goal: {str(e)}")

	async def reportGameConcluded(self):
		try:
			token = await self.login()
			if not token:
				print("Failed to obtain authentication token")
				return

			headers = {"Authorization": f"Bearer {token}"}
			data = {
				'gid': self.gameID,
			}
			ssl_context = ssl.create_default_context()
			ssl_context.check_hostname = False
			ssl_context.verify_mode = ssl.CERT_NONE 
			async with aiohttp.ClientSession() as session:
				async with session.post('https://nginx/api/register_results',
										headers=headers,
										data=data,
										ssl=ssl_context) as response:
					result = await response.json()
					if 'error' in result:
						print(f"Error reporting game conclusion: {result['error']}")

		except Exception as e:
			print(f"Error reporting game conclusion: {str(e)}")

	async def getGameStatus(self):
		try:
			token = await self.login()
			if not token:
				print("Failed to obtain authentication token")
				return

			headers = {"Authorization": f"Bearer {token}"}
			params = {
				'gid': self.gameID
			}
			ssl_context = ssl.create_default_context()
			ssl_context.check_hostname = False
			ssl_context.verify_mode = ssl.CERT_NONE 
			async with aiohttp.ClientSession() as session:
				async with session.get('https://nginx/api/game_infos',
										headers=headers,
										params=params,
										ssl=ssl_context) as response:
					result = await response.json()
					if 'error' in result:
						print(f"Error getting game status: {result['error']}")
					return result

		except Exception as e:
			print(f"Error getting game status: {str(e)}")
			return None

	async def abortGame(self):
		try:
			token = await self.login()
			if not token:
				print("Failed to obtain authentication token")
				return

			headers = {"Authorization": f"Bearer {token}"}
			data = {
				'game_id': self.gameID,
			}
			ssl_context = ssl.create_default_context()
			ssl_context.check_hostname = False
			ssl_context.verify_mode = ssl.CERT_NONE 
			async with aiohttp.ClientSession() as session:
				async with session.post('https://nginx/api/abort_game',
										headers=headers,
										data=data,
										ssl=ssl_context) as response:
					result = await response.json()
					if 'error' in result:
						print(f"Error reporting game conclusion: {result['error']}")

		except Exception as e:
			print(f"Error reporting game conclusion: {str(e)}")
