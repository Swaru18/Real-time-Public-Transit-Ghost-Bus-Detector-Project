import React, { useMemo } from "react";

function Dashboard({ vehicles }) {
  const { total, ghosts, active } = useMemo(() => {
    const total = vehicles.length;
    const ghosts = vehicles.filter((v) => v.is_ghost).length;
    const active = total - ghosts;
    return { total, ghosts, active };
  }, [vehicles]);

  return (
    <div className="gb-stats">
      <div className="gb-pill gb-pill--all">Total: {total}</div>
      <div className="gb-pill gb-pill--active">Active: {active}</div>
      <div className="gb-pill gb-pill--ghost">Ghost: {ghosts}</div>
    </div>
  );
}

export default Dashboard;
