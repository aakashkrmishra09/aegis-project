import requests
import datetime
import math
from flask import Flask, jsonify, request
from flask_cors import CORS

# --- Basic Setup ---
app = Flask(__name__)
# This line is crucial to allow your frontend and backend to talk to each other.
CORS(app)

# --- Configuration ---
# IMPORTANT: Paste your NASA API key here.
NASA_API_KEY = "YygjeoTPhmlyCDXSf4y83H3he6o5zuTqBuEJZW7V"
NASA_API_URL = "https://api.nasa.gov/neo/rest/v1/feed"


# --- API Endpoints ---

@app.route("/api/get_asteroids")
def get_asteroids():
    """Fetches a list of near-Earth asteroids for the next 7 days from NASA."""
    start_date = datetime.date.today()
    end_date = start_date + datetime.timedelta(days=7)
    params = {
        "start_date": start_date.strftime("%Y-%m-%d"),
        "end_date": end_date.strftime("%Y-%m-%d"),
        "api_key": NASA_API_KEY
    }
    
    try:
        response = requests.get(NASA_API_URL, params=params)
        response.raise_for_status()
        data = response.json()
        
        cleaned_asteroids = []
        for date in data["near_earth_objects"]:
            for asteroid_data in data["near_earth_objects"][date]:
                # --- THIS IS THE CORRECTED PART ---
                # We now correctly calculate the average from the min and max values.
                diameter_min = asteroid_data["estimated_diameter"]["meters"]["estimated_diameter_min"]
                diameter_max = asteroid_data["estimated_diameter"]["meters"]["estimated_diameter_max"]
                avg_diameter = (diameter_min + diameter_max) / 2
                
                cleaned_asteroid = {
                    "id": asteroid_data["id"],
                    "name": asteroid_data["name"],
                    "diameter_m": avg_diameter, # Use our calculated average
                    "velocity_km_s": float(asteroid_data["close_approach_data"][0]["relative_velocity"]["kilometers_per_second"]),
                    "miss_distance_km": float(asteroid_data["close_approach_data"][0]["miss_distance"]["kilometers"])
                }
                cleaned_asteroids.append(cleaned_asteroid)
        
        return jsonify(cleaned_asteroids)
    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Could not connect to NASA API: {e}"}), 500


@app.route("/api/calculate_impact", methods=['POST'])
def calculate_impact():
    """Calculates impact effects based on asteroid data from the frontend."""
    data = request.json
    diameter_m = data.get('diameter')
    velocity_km_s = data.get('velocity')

    # Physics Constants
    DENSITY_ROCKY_ASTEROID = 3000  # kg/m^3
    JOULES_PER_MEGATON_TNT = 4.184e15

    # Calculations
    mass_kg = DENSITY_ROCKY_ASTEROID * (4/3) * math.pi * ((diameter_m / 2) ** 3)
    velocity_m_s = velocity_km_s * 1000
    kinetic_energy_joules = 0.5 * mass_kg * (velocity_m_s ** 2)
    energy_megatons = kinetic_energy_joules / JOULES_PER_MEGATON_TNT
    crater_diameter_km = 0.02 * (kinetic_energy_joules ** 0.294)
    seismic_magnitude = (2/3) * math.log10(kinetic_energy_joules) - 2.9
    
    results = {
        "energy_megatons": round(energy_megatons, 2),
        "crater_diameter_km": round(crater_diameter_km, 2),
        "seismic_magnitude": round(seismic_magnitude, 1)
    }
    return jsonify(results)


@app.route("/api/calculate_deflection", methods=['POST'])
def calculate_deflection():
    """Calculates the new miss distance after a kinetic impactor push."""
    data = request.json
    miss_distance_km = data.get('miss_distance')
    velocity_km_s = data.get('velocity')
    delta_v_ms = data.get('delta_v')  # The "push" from the user in m/s

    # Simplified physics: new position = original position + (change in velocity * time)
    time_to_impact_s = (miss_distance_km * 1000) / (velocity_km_s * 1000)
    change_in_position_m = delta_v_ms * time_to_impact_s
    new_miss_distance_km = miss_distance_km + (change_in_position_m / 1000)
    
    return jsonify({"new_miss_distance_km": round(new_miss_distance_km, 2)})


# This starts the server when you run "python app.py"
if __name__ == "__main__":
    app.run(debug=True)