# from django.test import TestCase
# from django.contrib.auth.hashers import make_password
# from channels.testing import WebsocketCommunicator
# from channels.db import database_sync_to_async
# from channels.routing import URLRouter
# from rest_api.models import Tuser, Conversation, Message, Friendship
# from chat.routing import websocket_urlpatterns
# from chat.consumers import ChatConsumer
# import json
# from datetime import datetime
# from asgiref.sync import sync_to_async
# from ninja_jwt.tokens import RefreshToken
# from django.test import Client

# class ChatTests(TestCase):
#     @classmethod
#     def setUpClass(cls):
#         super().setUpClass()
#         from channels.layers import get_channel_layer
#         cls.channel_layer = get_channel_layer()

#     async def setUp(self):
#         """Set up test data"""
#         await self.channel_layer.flush()
        
#         # Create test users
#         self.user1 = await self.create_user(
#             username="testuser1",
#             email="test1@test.com",
#             password="testpass123",
#             fname="Test",
#             lname="User1"
#         )
        
#         self.user2 = await self.create_user(
#             username="testuser2",
#             email="test2@test.com",
#             password="testpass123",
#             fname="Test",
#             lname="User2"
#         )
        
#         # Make users friends
#         await self.make_friends(self.user1, self.user2)
        
#         # Create a conversation between users
#         self.conversation = await self.create_conversation(self.user1.id, self.user2.id)
#         print("Test data set up")

#     @database_sync_to_async
#     def create_user(self, username, email, password, fname, lname):
#         """Helper method to create a test user"""
#         user = Tuser(
#             username=username,
#             email=email,
#             password_hash=make_password(password),
#             fname=fname,
#             lname=lname,
#             verified=True
#         )
#         user.save()
#         print(f"User created: {user.id}")
#         return user
    
#     @database_sync_to_async
#     def make_friends(self, user1, user2):
#         """Helper method to make two users friends"""
#         friendship = Friendship.objects.create()
#         user1.friends.add(user2)
#         user2.friends.add(user1)
#         user1.friendship_inv.add(friendship)
#         user2.friendship_inv.add(friendship)
#         user1.save()
#         user2.save()
#         print(f"Users {user1.id} and {user2.id} are now friends")
    
#     @database_sync_to_async
#     def create_conversation(self, user1_id, user2_id):
#         """Helper method to create a conversation"""
#         conversation = Conversation.objects.create(
#             user_a=user1_id,
#             user_b=user2_id
#         )
#         print(f"Conversation created: {conversation.id}")
#         return conversation

#     async def test_websocket_connect(self):
#         """Test WebSocket connection"""
#         communicator = WebsocketCommunicator(
#             URLRouter(websocket_urlpatterns),
#             f"/ws/chat/{self.conversation.id}/"
#         )
#         communicator.scope["user"] = self.user1
#         connected, _ = await communicator.connect()
        
#         self.assertTrue(connected)
#         await communicator.disconnect()

#     async def test_message_persistence(self):
#         """Test that messages are saved to database"""
#         communicator = WebsocketCommunicator(
#             URLRouter(websocket_urlpatterns),
#             f"/ws/chat/{self.conversation.id}/"
#         )
#         communicator.scope["user"] = self.user1
#         connected, _ = await communicator.connect()
        
#         test_message = {
#             "message": "Test persistence message",
#             "sender_id": self.user1.id
#         }
#         await communicator.send_json_to(test_message)
        
#         # Wait for message to be processed
#         response = await communicator.receive_json_from()
        
#         # Verify message was saved to database
#         message_exists = await self.message_exists(test_message["message"])
#         self.assertTrue(message_exists)
        
#         await communicator.disconnect()

#     @database_sync_to_async
#     def message_exists(self, message_content):
#         return Message.objects.filter(message=message_content).exists()

# class ChatNinjaAPITests(TestCase):
#     def setUp(self):
#         """Set up test data"""
#         self.client = Client()
        
#         # Create test users
#         self.user1 = Tuser.objects.create(
#             username="testuser1",
#             email="test1@test.com",
#             password_hash="testpass123",
#             fname="Test",
#             lname="User1",
#             verified=True
#         )
        
#         self.user2 = Tuser.objects.create(
#             username="testuser2",
#             email="test2@test.com",
#             password_hash="testpass123",
#             fname="Test",
#             lname="User2",
#             verified=True
#         )
        
#         # Make users friends
#         friendship = Friendship.objects.create()
#         self.user1.friends.add(self.user2)
#         self.user2.friends.add(self.user1)
#         self.user1.friendship_inv.add(friendship)
#         self.user2.friendship_inv.add(friendship)
        
#         # Generate tokens for authentication
#         self.user1_token = RefreshToken(self.user1)
        
#         # Create admin token for register_message endpoint
#         self.admin_token = "your_admin_token"  # Replace with your actual admin token

#     def test_create_conversation(self):
#         """Test conversation creation endpoint"""
#         response = self.client.post(
#             '/api/create_conv',
#             {'user': self.user2.id},
#             HTTP_AUTHORIZATION=f'Bearer {self.user1_token}',
#             content_type='application/x-www-form-urlencoded'
#         )
        
#         self.assertEqual(response.status_code, 200)
#         data = json.loads(response.content)
#         self.assertIn('success', data)
        
#         # Verify conversation was created
#         conv_id = data.get('conv_id')
#         self.assertTrue(Conversation.objects.filter(id=conv_id).exists())

#     def test_get_conversations(self):
#         """Test getting conversations list"""
#         # Create a test conversation
#         conv = Conversation.objects.create(
#             user_a=self.user1.id,
#             user_b=self.user2.id
#         )
#         self.user1.conversations.add(conv)
#         self.user2.conversations.add(conv)
        
#         response = self.client.get(
#             '/api/convos',
#             HTTP_AUTHORIZATION=f'Bearer {self.user1_token}'
#         )
        
#         self.assertEqual(response.status_code, 200)
#         data = json.loads(response.content)
#         self.assertIn('success', data)
#         self.assertTrue(len(data['success']) > 0)

#     def test_get_messages(self):
#         """Test getting conversation messages"""
#         # Create conversation and message
#         conv = Conversation.objects.create(
#             user_a=self.user1.id,
#             user_b=self.user2.id
#         )
#         message = Message.objects.create(
#             sender=self.user1.id,
#             message="Test message"
#         )
#         conv.messages.add(message)
        
#         response = self.client.get(
#             f'/api/messages?conv_id={conv.id}',
#             HTTP_AUTHORIZATION=f'Bearer {self.user1_token}'
#         )
        
#         self.assertEqual(response.status_code, 200)
#         data = json.loads(response.content)
#         self.assertIn('success', data)
#         self.assertEqual(len(data['success']), 1)
#         self.assertEqual(data['success'][0]['message'], "Test message")

#     def test_register_message(self):
#         """Test message registration endpoint"""
#         conv = Conversation.objects.create(
#             user_a=self.user1.id,
#             user_b=self.user2.id
#         )
        
#         response = self.client.post(
#             '/api/register_message',
#             {
#                 'conv_id': conv.id,
#                 'message': "Test message",
#                 'sender': self.user1.id
#             },
#             HTTP_AUTHORIZATION=f'Bearer {self.admin_token}',
#             content_type='application/x-www-form-urlencoded'
#         )
        
#         self.assertEqual(response.status_code, 200)
#         data = json.loads(response.content)
#         self.assertIn('success', data)
        
#         # Verify message was saved
#         self.assertTrue(Message.objects.filter(message="Test message").exists())

#     def test_create_conversation_with_non_friend(self):
#         """Test creating conversation with non-friend user"""
#         # Create a non-friend user
#         non_friend = Tuser.objects.create(
#             username="nonfriend",
#             email="nonfriend@test.com",
#             password_hash="testpass123",
#             fname="Non",
#             lname="Friend",
#             verified=True
#         )
        
#         response = self.client.post(
#             '/api/create_conv',
#             {'user': non_friend.id},
#             HTTP_AUTHORIZATION=f'Bearer {self.user1_token}',
#             content_type='application/x-www-form-urlencoded'
#         )
        
#         self.assertEqual(response.status_code, 200)
#         data = json.loads(response.content)
#         self.assertIn('error', data)
#         self.assertEqual(data['error'], "users are not friends")

#     def tearDown(self):
#         """Clean up after tests"""
#         Conversation.objects.all().delete()
#         Message.objects.all().delete()
#         Tuser.objects.all().delete()
#         Friendship.objects.all().delete()