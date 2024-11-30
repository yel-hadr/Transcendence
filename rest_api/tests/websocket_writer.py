import asyncio
import websockets
import json

async def write_to_chat():
    user_id = int(input("Enter user id: "))
    conversation_id = int(input("Enter conversation id: "))
    uri = f"ws://localhost:8000/ws/chat/{conversation_id}/"

    try:
        print("Connecting to chat...")
        async with websockets.connect(uri) as websocket:
            print("Connected to chat server!")

            for i in range(5):
                message = input("Enter message: ")
                data = json.dumps({
                    "message": message,
                    "sender_id": user_id
                })
                await websocket.send(data)
                print(f"Sent message: {message}")

    except Exception as e:
        print(f"Error: {e}")

asyncio.run(write_to_chat())