import React from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

/**
 * Color helper
 */
const colorFor = (isGhost) => (isGhost ? "red" : "green");

function MapView({ cityConfig, vehicles }) {
  return (
    <div className="gb-map-wrap">
      <MapContainer
        center={cityConfig.center}
        zoom={cityConfig.zoom}
        style={{ height: "66vh", width: "100%" }}
        scrollWheelZoom
        key={cityConfig.label} // ensure reset on city change
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {vehicles.map((v) => (
          <CircleMarker
            key={v.vehicle_id}
            center={[v.lat, v.lng]}
            radius={8}
            pathOptions={{ color: colorFor(v.is_ghost), weight: 2 }}
          >
            <Popup>
              <div>
                <div><b>ID:</b> {v.vehicle_id}</div>
                <div><b>Route:</b> {v.route_id || "-"}</div>
                <div><b>City:</b> {v.city}</div>
                <div>
                  <b>Status:</b>{" "}
                  <span style={{ color: colorFor(v.is_ghost) }}>
                    {v.is_ghost ? "Ghost" : "Active"}
                  </span>
                </div>
                <div><b>Time:</b> {new Date(v.timestamp * 1000).toLocaleTimeString()}</div>
                <div>
                  <b>Pos:</b> {v.lat.toFixed(4)}, {v.lng.toFixed(4)}
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}

export default MapView;
