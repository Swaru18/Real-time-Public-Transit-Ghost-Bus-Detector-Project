import React, { useState } from "react";

/**
 * onSearch should return a vehicle object (or null) when given a query
 */
function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);

  const handleFind = () => {
    const found = onSearch(query);
    setResult(found || null);
  };

  return (
    <div className="gb-search">
      <input
        type="text"
        placeholder="Search by Bus ID (e.g., MH12_1234)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleFind}>🔎 Find</button>

      {result && (
        <div className="gb-search-result">
          <b>{result.vehicle_id}</b> • {result.city} •{" "}
          {result.is_ghost ? "Ghost" : "Active"} •{" "}
          {result.route_id || "—"} • {result.lat.toFixed(4)}, {result.lng.toFixed(4)}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
