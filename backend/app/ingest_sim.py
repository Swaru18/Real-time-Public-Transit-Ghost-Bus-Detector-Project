# backend app/ingest_sim.py
import redis  # type: ignore
import json
import time
import random

# Connect to Redis
REDIS = redis.Redis(host="localhost", port=6379, db=0, decode_responses=True)

# Pune coordinates
pune_coords = [
    (18.5204, 73.8567),  # Pune City Center
    (18.5308, 73.8475),  # Shivajinagar
    (18.5149, 73.8530),  # Swargate
    (18.5089, 73.9260),  # Hadapsar
    (18.5074, 73.8077),  # Kothrud
    (18.5996, 73.7465),  # Hinjewadi
    (18.5637, 73.9167),  # Viman Nagar
    (18.5403, 73.8933),  # Yerwada
    (18.4637, 73.8673),  # Kondhwa
    (18.5800, 73.8130),  # Aundh
    (18.6140, 73.7250),  # Wakad
    (18.4500, 73.8500),  # Dhankawadi
]

# Ratnagiri coordinates
ratnagiri_coords = [
    (16.9944, 73.3007),  # City Center
    (16.9994, 73.3096),  # Bus Stand
    (17.0047, 73.2930),  # Mandvi Beach
    (16.9901, 73.3120),  # Railway Station
    (16.9767, 73.2915),  # Bhatye Beach
    (16.9850, 73.3050),  # Tilak Ali Museum
    (16.9950, 73.2800),  # Mirya Bandar
    (17.0200, 73.3100),  # Ratnagiri Fort
    (16.9800, 73.3200),  # Shivaji Nagar
    (17.0100, 73.2950),  # Ganpatipule Road
]

CITIES = {
    "pune": pune_coords,
    "ratnagiri": ratnagiri_coords
}

print("🚍 Starting bus simulator... Press Ctrl+C to stop.")

while True:
    for city, coords_list in CITIES.items():
        coords = random.choice(coords_list)

        vehicle = {
            "vehicle_id": f"{'MH12' if city == 'pune' else 'MH08'}_{random.randint(1000, 9999)}",
            "lat": coords[0] + random.uniform(-0.005, 0.005),
            "lng": coords[1] + random.uniform(-0.005, 0.005),
            "route_id": random.choice(["20", "50", "75", "100"]),
            "timestamp": int(time.time()),
            "city": city,
            "is_ghost": random.choice([False, False, False, True])  # 25% chance ghost
        }

        # Publish to Redis
        REDIS.publish("vehicles:updates", json.dumps(vehicle))

        # Store latest state in Redis hash
        vehicle_for_redis = {k: str(v) for k, v in vehicle.items()}
        REDIS.hset(f"vehicle:{vehicle['vehicle_id']}", mapping=vehicle_for_redis)
        REDIS.expire(f"vehicle:{vehicle['vehicle_id']}", 180)

        print(f"✅ Published {vehicle['vehicle_id']} ({vehicle['city']}) at ({vehicle['lat']:.4f}, {vehicle['lng']:.4f}) Ghost={vehicle['is_ghost']}")

    # Wait 2 seconds before next round
    time.sleep(2)
