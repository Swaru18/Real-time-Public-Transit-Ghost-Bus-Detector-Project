import json
import redis # type: ignore
from fastapi import FastAPI, WebSocket # type: ignore
from fastapi.middleware.cors import CORSMiddleware # type: ignore
import uvicorn # type: ignore

app = FastAPI()

# CORS so frontend (React) can connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Redis connection
REDIS = redis.Redis(host="localhost", port=6379, db=0, decode_responses=True)

@app.get("/")
def root():
    return {"message": "🚍 Ghost Bus Detector Backend is running!"}

@app.websocket("/ws/vehicles")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    pubsub = REDIS.pubsub()
    pubsub.subscribe("vehicles:updates")

    print("✅ Frontend connected to WebSocket")

    try:
        for message in pubsub.listen():
            if message["type"] == "message":
                data = json.loads(message["data"])
                await websocket.send_text(json.dumps(data))
    except Exception as e:
        print("❌ WebSocket error:", e)
    finally:
        await websocket.close()


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
