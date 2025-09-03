import React, { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import MapView from "./components/MapView";
import Dashboard from "./components/Dashboard";
import SearchBar from "./components/SearchBar";

/**
 * Cities and default map view
 */
const CITIES = {
  pune: { label: "Pune", center: [18.5204, 73.8567], zoom: 12 },
  ratnagiri: { label: "Ratnagiri", center: [16.9944, 73.3007], zoom: 13 },
};

function App() {
  // vehicles: a dictionary keyed by vehicle_id -> latest vehicle object
  const [vehicles, setVehicles] = useState({});
  const [city, setCity] = useState("pune"); // default city
  const wsRef = useRef(null);

  /**
   * Open WS and stream single-vehicle updates.
   * Backend sends one vehicle per message (JSON).
   */
  useEffect(() => {
    // Prevent duplicate sockets on hot reload
    if (wsRef.current && wsRef.current.readyState === 1) return;

    const ws = new WebSocket("ws://127.0.0.1:8000/ws/vehicles");
    wsRef.current = ws;

    ws.onopen = () => {
      // console.log("WS connected");
    };

    ws.onmessage = (event) => {
      try {
        const v = JSON.parse(event.data);

        // Normalize keys and types safely
        const vehicle = {
          vehicle_id: v.vehicle_id || v.id || "UNKNOWN",
          lat: Number(v.lat ?? v.latitude),
          lng: Number(v.lng ?? v.lon ?? v.longitude),
          route_id: v.route_id || v.route || "",
          timestamp: Number(v.timestamp) || Date.now() / 1000,
          city: (v.city || "").toLowerCase() || "pune",
          // backend/sim sometimes sends bool or string -> coerce to boolean
          is_ghost:
            v.is_ghost === true ||
            v.is_ghost === "True" ||
            v.is_ghost === "true",
        };

        if (Number.isFinite(vehicle.lat) && Number.isFinite(vehicle.lng)) {
          setVehicles((prev) => ({
            ...prev,
            [vehicle.vehicle_id]: vehicle,
          }));
        }
      } catch (e) {
        // console.error("Bad WS message", e);
      }
    };

    ws.onerror = () => {
      // console.error("WS error");
    };

    ws.onclose = () => {
      // console.log("WS closed");
    };

    return () => {
      try {
        ws.close();
      } catch {}
    };
  }, []);

  // Convert dict -> array for rendering
  const vehicleList = useMemo(() => Object.values(vehicles), [vehicles]);

  // Filter by selected city
  const filtered = useMemo(
    () => vehicleList.filter((v) => v.city === city),
    [vehicleList, city]
  );

  // Simple search handler (by exact ID)
  const handleSearch = (query) => {
    if (!query) return null;
    return vehicleList.find(
      (v) => v.vehicle_id.toLowerCase() === query.toLowerCase()
    );
  };

  return (
    <div className="gb-app">
      <header className="gb-header">
        <h1>🚍 Ghost Bus Detector</h1>

        <div className="gb-controls">
          <label htmlFor="city">City:&nbsp;</label>
          <select
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            {Object.entries(CITIES).map(([key, cfg]) => (
              <option key={key} value={key}>
                {cfg.label}
              </option>
            ))}
          </select>
        </div>
      </header>

      <Dashboard vehicles={filtered} />

      <SearchBar onSearch={handleSearch} />

      <MapView
        cityConfig={CITIES[city]}
        vehicles={filtered}
      />

      <footer className="gb-footer">
        <small>
          Live demo • {filtered.length} buses in {CITIES[city].label}
        </small>
      </footer>
    </div>
  );
}

export default App;
