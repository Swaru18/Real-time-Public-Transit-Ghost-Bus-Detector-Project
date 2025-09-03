## 🚍 Real-time Public Transit "Ghost Bus" Detector 

A real-time system that streams bus locations, compares them against schedule data (GTFS), and flags potential **ghost buses** (scheduled but missing/inactive vehicles). It ships with a live simulator, a FastAPI + WebSocket backend, and a React dashboard with map visualizations.

✨ Highlights

 **Live tracking** across multiple cities (e.g., Pune, Ratnagiri)
 **Ghost-bus detection** (inactive/missing vs schedule)
 **Interactive map** + stats dashboard + ID search
 **WebSockets** end-to-end: instant updates, no refresh
 **GTFS-aware** design: aligns live telemetry with scheduled trips/routes

## 🧭 Healthy vs Ghost Buses

 **Healthy buses** ✅ — vehicles that are active and moving, consistent with schedule (GTFS) and recent telemetry.
 **Ghost buses** ❌ — vehicles that are scheduled but **missing** or **inactive** (no new updates for a threshold window, off-route, or never appear). Rules live in detection logic and can be tuned per agency.


## 🗂️ Project Structure 

GHOSTBUS/
│── .venv/                      # optional virtual environment
│── backend app/
│   ├── __init__.py
│   ├── detection.py            # ghost-bus heuristics
│   ├── ingest_sim.py           # live vehicle simulator (Redis Pub/Sub)
│   └── main.py                 # FastAPI + WebSocket server
│
│── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── components/
│   │       ├── Dashboard.js
│   │       ├── MapView.js
│   │       └── SearchBar.js
│   └── package.json
│
│── logic/                      # (optional) extra rules/helpers
│── websockethandler/           # (optional) ws helpers
│── README.md
│── .gitignore
```

⚙️ Tech Stack

Frontend

 React (Create React App)
 react-leaflet + leaflet (map)
 WebSocket client

Backend

 FastAPI (Python)
 Uvicorn (ASGI server)
 Redis (Pub/Sub + latest-vehicle state)

Data

GTFS (General Transit Feed Specification) schedules for trips/routes/stops
 Live vehicle telemetry (simulated by `ingest_sim.py`)

📥 Prerequisites

Python 3.10+
Node.js 18+ & npm
Redis server running locally (or reachable remotely)

> Windows users: You can run Redis via WSL/Docker/Memurai. If you already have `redis-server` working, you’re good.

🚀 Quick Start (Windows / macOS / Linux)

Open three terminals (plus Redis). Paths shown are from the repo root `GHOSTBUS/`.

0) Start Redis

powershell
If available natively
redis-server

1) Start the vehicle simulator

powershell
cd "backend app"
(Optional) activate venv
.venv\Scripts\activate   # Windows PowerShell
source .venv/bin/activate # macOS/Linux

pip install fastapi uvicorn redis
python ingest_sim.py

You should see lines like: `Published MH12_1234 (pune) ...` every \~2s.

2) Start the backend API/WebSocket server

Option A (recommended, since `main.py` calls uvicorn for you):

powershell
cd "backend app"
python main.py


Option B (run uvicorn module directly):

powershell
cd "backend app"
python -m uvicorn main:app --reload


Backend should report: `Uvicorn running on http://127.0.0.1:8000`.

3) Start the frontend

powershell
cd frontend
npm install
npm install react-leaflet leaflet
npm start


Open [http://localhost:3000](http://localhost:3000)

> The frontend connects to the backend WS at `ws://127.0.0.1:8000/ws/vehicles`. If you change the backend host/port, update it in `src/App.js`.

🔍 How It Works

1. Simulator (`ingest_sim.py`) publishes vehicle updates to Redis channel `vehicles:updates` and caches the latest state per vehicle in hashes (`vehicle:<id>`), with expiry.
2. Backend (`main.py`) subscribes to Redis Pub/Sub and relays each message to browser clients over **WebSocket** (`/ws/vehicles`).
3. Frontend (React) consumes the WS stream, normalizes fields, maintains an in-memory vehicle map, and renders markers on Leaflet. City filters/stats/search update live.
4. Detection (`detection.py`) holds the heuristics to flag ghost buses (e.g., no updates for X seconds

