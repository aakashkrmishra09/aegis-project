# Aegis: An Interactive Asteroid Defense Simulator

**A project that transforms complex NASA data into an understandable, interactive tool for assessing and mitigating asteroid impact risks.**

---

## 🚀 The Problem

Asteroid impact threats are real, but the data is often too complex for the public and policymakers to grasp. It's hard to visualize the real-world consequences of an impact or understand if mitigation strategies, like kinetic impactors, could actually work. This gap in understanding hinders public awareness and preparedness.

## ✨ Our Solution

**Aegis** is a web-based simulation tool that bridges this gap. It connects to live NASA APIs to fetch data on near-Earth asteroids and uses a physics-based backend to calculate the potential effects of an impact on a real-world location (Toronto, Canada). 

Most importantly, it puts the user in control, allowing them to simulate a deflection mission and see the results, turning abstract threats into an engaging, educational experience.

---

## 🛠️ Key Features

* **Live Data:** Fetches a 7-day forecast of near-Earth asteroids directly from NASA's NeoWs API.
* **Physics Engine:** A Python Flask backend calculates key impact metrics:
    * Kinetic Energy (in Megatons of TNT)
    * Crater Diameter (km)
    * Seismic Magnitude (Richter Scale equivalent)
* **Interactive Map:** Visualizes the simulated impact crater on a Leaflet.js map.
* **"Defend Earth" Mode:** A gamified mitigation scenario where users can apply a "push" with a kinetic impactor to alter the asteroid's trajectory and see if they can save the planet.

---

## 💻 Tech Stack

* **Backend:** Python, Flask, Flask-CORS, Requests
* **Frontend:** HTML, CSS, JavaScript
* **Mapping Library:** Leaflet.js
* **Primary Data Source:** NASA Near Earth Object Web Service (NeoWs)

---

## ⚙️ How to Run Locally

1.  **Backend Setup:**
    * Navigate to the `/backend` directory.
    * Install required packages: `pip install -r requirements.txt`
    * Run the server: `python app.py`
    * The backend will be running at `http://127.0.0.1:5000`.

2.  **Frontend Setup:**
    * Open a **new terminal**.
    * Navigate to the `/frontend` directory.
    * Start the simple web server: `python -m http.server`
    * The frontend will be running at `http://localhost:8000`.

3.  **Run the App:**
    * Open your web browser and go to **`http://localhost:8000`**.