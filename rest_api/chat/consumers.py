import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from urllib.parse import parse_qs, unquote
from ninja_jwt.authentication import JWTBaseAuthentication
from rest_api.models import Tuser, Conversation, Message

class ChatConsumer(AsyncWebsocketConsumer):
    connected = 0
    offline_messages = {}

    async def connect(self):
        # Initialize attributes
        self.room_group_name = None
        self.user = None
        
        try:
            # Parse query parameters
            query_params = parse_qs(self.scope['query_string'].decode('utf-8'))
            self.token = query_params.get('token', [None])[0]
            self.id = int(query_params.get('id', [None])[0])
            
            if not self.token or not self.id:
                raise ValueError("Missing required parameters: token or id")

            # Get room name and set group name
            self.room_name = self.scope['url_route']['kwargs']['roomName']
            self.room_group_name = f"{self.room_name}_{self.id}"
            
            print(f"Room group name: ({self.room_group_name})")
            print(f"User ID: {self.id}")

            # Verify user and proceed with connection
            self.user = await self.verify_user()
            print(f'Logged in user: {self.user.username}')

            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            await self.accept()
            ChatConsumer.connected += 1
            if self.user:
                # await self.ModifyOnlineStatus(True)
                await self.notify_friends_online_status(True)

        except ValueError as ve:
            print(f"Validation error: {str(ve)}")
            await self.close()
        except Exception as e:
            print(f"Connection error: {str(e)}")
            await self.close()


    async def notify_friends_online_status(self, is_online):
        try:
            await self.save_online_status(1, self.user.id)
            friends = await self.get_user_friends()
            for friend in friends:
                conv_id = await self.get_conversation_id(self.user, friend)
                await self.channel_layer.group_send(
                    f"{self.room_name}_{friend.id}",
                    {
                        'type': 'online_status',
                        'message': 'online' if is_online else 'offline',
                        'sender_id': self.user.id,
                        'conv_id': conv_id
                    }
                )
        except Exception as e:
            print(f"Error notifying friends of online status: {str(e)}")


    @database_sync_to_async
    def get_conversation_id(self, user_a, user_b):
        try:
            from rest_api.models import Conversation
            conversation = Conversation.objects.filter(user_a=user_a.id, user_b=user_b.id).first()
            if conversation:
                print(f"Conversation found: {conversation.id}")
                return conversation.id
            conversation = Conversation.objects.filter(user_a=user_b.id, user_b=user_a.id).first()
            if conversation:
                print(f"Conversation found: {conversation.id}")
                return conversation.id
            return None
        except Exception as e:
            print(f"Error getting conversation ID: {str(e)}")
            return
    @database_sync_to_async
    def save_online_status(self, status, user_id):
        try:
            from rest_api.models import Tuser
            # Fetch the user instance first
            userSTATSU = Tuser.objects.get(id=user_id)
            print(f"form the save_online_status {"online" if status == 1 else "offline"}")
            userSTATSU.uonline = status
            userSTATSU.save()
            
        except Tuser.DoesNotExist:
            print(f"User with id {user_id} does not exist.")
        except Exception as e:
            print(f"Error saving online status: {str(e)}")

    async def online_status(self, event):
        try:
            message = event['message']
            Conv_id = event['conv_id']
            sender_id = event['sender_id']
            await self.send(text_data=json.dumps({
                'type': 'online_status',
                'message': message,
                'sender_id': sender_id,
                'conv_id':  Conv_id
            }))
        except Exception as e:
            print(f"Error sending online status: {str(e)}")

    @database_sync_to_async
    def verify_user(self):
        try:
            clean_token = unquote(self.token).replace("Bearer ", "")
            jwt_auth = JWTBaseAuthentication()
            validated_token = jwt_auth.get_validated_token(clean_token)
            auth_user = jwt_auth.get_user(validated_token)
            
            user = Tuser.objects.filter(id=self.id).first()
            if not user:
                raise ValueError(f"User with ID {self.id} not found")
            
            if auth_user.id != user.id:
                raise ValueError("Token user does not match requested user ID")
                
            return user
        except Exception as e:
            raise ValueError(f"User verification failed: {str(e)}")

    @database_sync_to_async
    def get_conversation(self, conv_id):
        return Conversation.objects.filter(id=conv_id).first()
    
    @database_sync_to_async
    def get_user(self, sender_id, conv_id):
        from rest_api.models import Tuser, Conversation
        conversation = Conversation.objects.filter(id=conv_id).first()
        if conversation.user_a != sender_id:
            user = Tuser.objects.filter(id=conversation.user_a).first()
            return user
        elif conversation.user_b != sender_id:
            user = Tuser.objects.filter(id=conversation.user_b).first()
            return user
        else:
            return None

    async def disconnect(self, close_code):
        try:
            if hasattr(self, 'room_group_name') and self.room_group_name:
                # send notification to friends
                print(f"Disconnected from {self.room_group_name}")
                await self.save_online_status(2, self.user.id)
                await self.broadcast_offline_status()
                ChatConsumer.connected -= 1
                print(f"Connected users: {ChatConsumer.connected}")

                await self.channel_layer.group_discard(
                    self.room_group_name,
                    self.channel_name
                )
        except Exception as e:
            print(f"Disconnect error: {str(e)}")
    

    async def broadcast_offline_status(self):
        try:
            
            friends = await self.get_user_friends()
            for friend in friends:
                conv_id = await self.get_conversation_id(self.user, friend)

                await self.channel_layer.group_send(
                    f"{self.room_name}_{friend.id}",
                    {
                        'type': 'offline_status',
                        'message': 'offline',
                        'sender_id': self.user.id,
                        'conv_id': conv_id
                    }
                )
        except Exception as e:
            print(f"Error broadcasting offline status: {str(e)}")

    async def offline_status(self, event):
        try:
            sender_id = event['sender_id']
            conv_id = event['conv_id']
    
            await self.send(text_data=json.dumps({
                'type': 'offline_status',
                'message': 'offline',
                'sender_id': sender_id,
                'conv_id': conv_id
            }))
        except Exception as e:
            print(f"Error handling offline status: {str(e)}")

    async def receive(self, text_data):
        try:
            print(f"Received message: {text_data}")
            text_data_json = json.loads(text_data)
            message_type = text_data_json.get('type')


            if message_type == 'chat':
                print("Handling chat message")
                await self.handle_message(text_data_json)
            elif message_type == 'notification':
                print("Handling notification message")
                await self.handle_notification(text_data_json)
            elif message_type == 'logout':
                print("Handling logout message")
                await self.broadcast_offline_status()
            else:
                print(f"Invalid message type: {message_type}")
        except json.JSONDecodeError:
            print("Invalid JSON format received")
        except KeyError as e:
            print(f"Missing required field: {str(e)}")
        except Exception as e:
            print(f"Error processing message: {str(e)}")


    async def handle_notification(self, event):
        try:
            print("Handling notification")
            message = event['message']
            sender_id = event['sender_id']

            await self.channel_layer.group_send(
                f"{self.room_name}_{sender_id}",
                {
                    'type': 'notification',
                    'message': message,
                    'sender_id': self.user.id,
                    'username': self.user.username
                }
            )            
        except Exception as e:
            print(f"Error handling notification: {str(e)}")

    async def notification(self, event):
        try:
            message = event['message']
            sender_id = event['sender_id']
            username = event['username']
            await self.send(text_data=json.dumps({
                'type': 'notification',
                'message': message,
                'sender_id': sender_id,
                'username': username
            }))
        except Exception as e:
            print(f"Error sending notification: {str(e)}")
    @database_sync_to_async
    def ModifyOnlineStatus(self, status):
        try:
            user = Tuser.objects.get(id=self.id)
            user.online = status
            user.save()
        except Exception as e:
            print(f"Error modifying online status: {str(e)}")
    
    @database_sync_to_async
    def get_user_friends(self):
        return list(self.user.friends.all())


    async def handle_online_status(self, event):
        try:
            friends = await self.get_user_friends()
            for friend in friends:
                await self.channel_layer.group_send(
                    f"{self.room_name}_{friend.id}",
                    {
                        'type': 'online_status',
                        'message': str(event['message']),
                        'sender_id': self.user.id,
                    }
                )
        except Exception as e:
            print(f"Error handling online status: {str(e)}")

    async def handle_message(self, text_data_json):
        try:
            message_content = text_data_json.get('message', '').strip()
            if not message_content:
                raise ValueError("Empty message")
            print(f"Message content: {message_content}")
            sender_id = text_data_json.get('sender_id')
            conv_id = text_data_json.get('conv_id')
            print(f"Sender ID: {sender_id}, Conv ID: {conv_id}")
            print(f"User ID: {self.user.id}")
            if not sender_id or not conv_id:
                raise ValueError("Missing sender_id or conv_id")

            conversation = await self.get_conversation(conv_id)
            print(f"Conversation: {conversation}")
            receiver = await self.get_user(sender_id, conv_id)
            
            if not conversation or not receiver:
                raise ValueError("Invalid conversation or receiver")

            message = await self.save_message(conversation, self.user.id, message_content)
            if not message:
                raise ValueError("Failed to save message")
            
            print (f"to channel ({self.room_name}_{sender_id})")
            await self.channel_layer.group_send(
                f"{self.room_name}_{sender_id}",
                {
                    'type': 'chat_message',
                    'from': 'chat',
                    'message': str(message_content),
                    'sender_id': str(self.user.id),
                    'profile_image': str(self.user.image),
                    'conv_id': str(conv_id)
                }
            )
        except ValueError as ve:
            print(f"Validation error in handle_message: {str(ve)}")
        except Exception as e:
            print(f"Error handling message: {str(e)}")

    async def chat_message(self, event):
        try:
            message = event['message']
            sender_id = event['sender_id']
            profile_image = event['profile_image']
            conv_id = event['conv_id']
            await self.send(text_data=json.dumps({
                'type': 'chat_message',
                'message': message,
                'sender_id': sender_id,
                'profile_image': profile_image,
                'conv_id': conv_id
            }))
        except Exception as e:
            print(f"Error sending chat message: {str(e)}")

    @database_sync_to_async
    def save_message(self, conversation, sender_id, message_content):
        try:
            message = Message.objects.create(
                sender=sender_id,
                message=message_content.replace(">", "").replace("<", "").replace("'", "").replace("\"", "").replace("`", "").replace("=", "")
            )
            message.save()
            conversation.messages.add(message)
            return message
        except Exception as e:
            print(f"Error saving message: {str(e)}")
            return None
