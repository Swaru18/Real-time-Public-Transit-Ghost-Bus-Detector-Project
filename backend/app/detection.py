# backend app/detection.py
import redis # type: ignore
import time
import json

REDIS = redis.Redis(host="localhost", port=6379, db=0, decode_responses=True)

def detect_ghost_buses():
    """
    Check for ghost buses (those not updated in last 2 minutes).
    """
    keys = REDIS.keys("vehicle:*")
    ghost_buses = []

    for key in keys:
        vehicle = REDIS.hgetall(key)
        if not vehicle:
            continue

        last_seen = int(vehicle.get("timestamp", 0))
        now = int(time.time())

        if now - last_seen > 120:  # more than 2 minutes without update
            vehicle["is_ghost"] = "True"
            ghost_buses.append(vehicle)

    return ghost_buses


if __name__ == "__main__":
    while True:
        ghosts = detect_ghost_buses()
        if ghosts:
            print("👻 Ghost buses detected:", ghosts)
        time.sleep(10)
