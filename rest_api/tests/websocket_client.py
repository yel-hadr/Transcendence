import asyncio
import websockets
import json
import ssl

async def listen_to_chat():
    conversation_id = int(input("Enter conversation id: "))
    uri = f"wss://localhost:8000/ws/chat/{conversation_id}/"

    ssl_context = ssl._create_unverified_context()

    try:
        print("Connecting to chat...")
        async with websockets.connect(uri, ssl=ssl_context) as websocket:
            print("Connected to chat server!")

            while True:
                response = await websocket.recv()
                knw = json.loads(response)
                print(f"Received message: {knw}")

    except Exception as e:
        print(f"Error: {e}")

asyncio.run(listen_to_chat())