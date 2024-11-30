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

class TournamentConsumer(AsyncWebsocketConsumer):

	async def connect(self):

		self.TournamentID = self.scope['url_route']['kwargs']['TournamentID']
		self.UserID = self.scope['url_route']['kwargs']['UserID']
		self.UserUsername = self.scope['url_route']['kwargs']['Username']
		self.room_group_name = f'Tournament_{self.TournamentID}'
		self.TournamentInfo = await self.getTournamentInfo()

		if not self.TournamentInfo or 'error' in self.TournamentInfo:
			await self.close(code=4000)
			return

		await self.accept()

		await self.channel_layer.group_add(
			self.room_group_name,
			self.channel_name
		)

	async def disconnect(self, close_code):

		await self.channel_layer.group_discard(
			self.room_group_name,
			self.channel_name
		)

	async def recieve(self, text_data):

		data = json.loads(text_data)

		if 'type' in data:
			if data['type'] == 'roundStarted':
				await self.channel_layer.group_send(
					self.room_group_name,
					{
						'type': 'notifyRoundStarted',
						'message': 'round has started',
						'matches': data['matches']
					}
				)
			elif data['type'] == 'matchEnded':
				await self.channel_layer.group_send(
					self.room_group_name,
					{
						'type': 'notifyMatchEnded',
						'message': 'match has concluded',
						'winnerUsername': data['winnerUsername'],
						'winnderUserID': data['winnerUserID']
					}
				)

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

	async def getTournamentInfo(self):
		try:
			token = await self.login()
			if not token:
				print("Failed to obtain authentication token")
				return

			headers = {"Authorization": f"Bearer {token}"}
			params = {
				'code': self.TournamentID
			}
			ssl_context = ssl.create_default_context()
			ssl_context.check_hostname = False
			ssl_context.verify_mode = ssl.CERT_NONE 
			async with aiohttp.ClientSession() as session:
				async with session.get('https://nginx/api/tournament_infos',
										headers=headers,
										params=params,
										ssl=ssl_context) as response:
					result = await response.json()
					if 'error' in result:
						print(f"Error getting tournament info: {result['error']}")
					return result

		except Exception as e:
			print(f"Error getting tournament info: {str(e)}")
			return None