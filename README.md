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
│── backend app/
│ ├── detection.py # ghost-bus heuristics
│ ├── ingest_sim.py # live vehicle simulator (Redis Pub/Sub)
│ └── main.py # FastAPI + WebSocket server
│
│── frontend/
│ ├── src/
│ │ ├── App.js
│ │ ├── App.css
│ │ ├── index.js
│ │ └── components/
│ │ ├── Dashboard.js
│ │ ├── MapView.js
│ │ └── SearchBar.js
│ └── package.json
│
│── README.md
│── .gitignore


---

## ⚙️ Tech Stack
**Frontend**  
- React.js  
- Leaflet (via react-leaflet)  
- WebSocket client  

**Backend**  
- FastAPI (Python)  
- Uvicorn (ASGI server)  
- Redis (Pub/Sub + vehicle state)  

**Data**  
- **GTFS** (General Transit Feed Specification) schedules  
- Simulated live GPS feeds (`ingest_sim.py`)  

---

## 📥 Prerequisites
- **Python 3.10+**  
- **Node.js 18+** & **npm**  
- **Redis** server  

---

## 🚀 Getting Started

Open **three terminals** (plus Redis). Paths shown are from the repo root `GHOSTBUS/`.

0) Start Redis
```bash
redis-server

1) Run the vehicle simulator
cd "backend app"
pip install fastapi uvicorn redis
python ingest_sim.py

2) Start the backend

Option A (if main.py starts uvicorn itself):

cd "backend app"
python main.py


Option B (direct uvicorn run):

cd "backend app"
python -m uvicorn main:app --reload

3) Start the frontend
cd frontend
npm install
npm install react-leaflet leaflet
npm start


Open 👉 http://localhost:3000


🔍 How It Works

Simulator (ingest_sim.py) publishes vehicle updates to Redis (vehicles:updates) and stores latest state in hashes.
Backend (main.py) listens on Redis and forwards updates to browsers over WebSockets (/ws/vehicles).
Frontend (React) consumes WS messages, filters per city, and renders markers with Leaflet.
Detection (detection.py) applies heuristics to identify ghost buses (missing, stale, off-route).

🧠 GTFS Integration

Place GTFS files (stops.txt, routes.txt, etc.) in ./gtfs/<agency>/.
Parse schedules at startup → map routes, trips, and stop times.
Runtime logic compares live buses with GTFS to detect:
Missing vehicles → scheduled but absent
Stale vehicles → no update for > X seconds
Off-route → deviates from scheduled path
