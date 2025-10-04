# 🛡️ Aegis: An Interactive Asteroid Defense Simulator

**An interactive web application that transforms complex NASA data into an understandable, hands-on tool for visualizing asteroid impact threats and exploring mitigation strategies.**

---

## 🚀 Live Demo & Links

* **Live Application (Frontend):** `https://benevolent-alfajores-023f0d.netlify.app/`
* **Live API (Backend):** `https://aakashkumarmishra-nasahackathon2025.onrender.com/api/get_asteroids`
* **Source Code:** `https://github.com/aakashkrmishra09/aegis-project`


---

## The Problem

Asteroid impact threats are real, but the raw scientific data is often siloed, abstract, and difficult for the public and policymakers to grasp. It's hard to visualize the real-world consequences of an impact or understand if mitigation strategies, like kinetic impactors, could actually work. This gap in understanding hinders public awareness and effective preparedness.

## ✨ Our Solution

**Aegis** is a web-based simulation tool that bridges this gap. It connects to live NASA APIs to fetch data on near-Earth asteroids and uses a physics-based backend to calculate the potential effects of an impact on a real-world location (Toronto, Canada).

Most importantly, it puts the user in control, allowing them to simulate a deflection mission and see the results, turning an abstract threat into an engaging, educational experience that is accessible to everyone.



---

## 🛠️ Key Features

* **Live Data Integration:** Fetches a 7-day forecast of near-Earth asteroids directly from NASA's NeoWs API.
* **Physics Engine:** A Python Flask backend calculates key impact metrics based on established scientific formulas:
    * Kinetic Energy (in Megatons of TNT)
    * Crater Diameter (km)
    * Seismic Magnitude (Richter Scale equivalent)
* **Interactive Map Visualization:** Dynamically visualizes the simulated impact crater on a Leaflet.js map, providing immediate geographic context.
* **"Defend Earth" Mode:** A gamified mitigation scenario where users can apply a simulated "push" with a kinetic impactor to alter the asteroid's trajectory and receive instant feedback on their mission's success.

---

## 💻 Tech Stack

| Category      | Technology / Service                               |
|---------------|----------------------------------------------------|
| **Backend** | Python, Flask, Flask-CORS, Gunicorn                |
| **Frontend** | HTML, CSS, JavaScript                              |
| **Mapping** | Leaflet.js                                         |
| **Data API** | NASA Near Earth Object Web Service (NeoWs)         |
| **Deployment**| Render (Backend), Netlify (Frontend)               |

---

## ⚙️ How to Run Locally

To run this project on your own machine, follow these steps:

**1. Prerequisites:**
* Python 3.x installed
* A NASA API Key from [api.nasa.gov](https://api.nasa.gov/)

**2. Clone the Repository:**
```bash
git clone [https://github.com/aakashkrmishra09/aegis-project.git](https://github.com/aakashkrmishra09/aegis-project.git)
cd aegis-project
