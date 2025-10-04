// --- Global Variables ---
let map;
let allAsteroids = [];
let impactCraterLayer = null; // To keep track of the drawn crater

// --- Initialization ---
window.addEventListener('load', () => {
    initializeMap();
    fetchAsteroids();
    setupEventListeners();
});

function initializeMap() {
    const torontoCoords = [43.6532, -79.3832];
    map = L.map('map').setView(torontoCoords, 9); // Centered on Toronto

    // Add the map background tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add a marker for the target city
    L.marker(torontoCoords).addTo(map).bindPopup('Target: Toronto').openPopup();
}

function setupEventListeners() {
    document.getElementById('simulate-button').addEventListener('click', runSimulation);
    document.getElementById('defend-button').addEventListener('click', runDeflection);
    
    // Update the slider value display in real-time
    const slider = document.getElementById('delta-v-slider');
    const sliderValueDisplay = document.getElementById('delta-v-value');
    slider.addEventListener('input', () => {
        sliderValueDisplay.textContent = parseFloat(slider.value).toFixed(1);
    });
}

// --- Data Fetching ---
function fetchAsteroids() {
    fetch('http://127.0.0.1:5000/api/get_asteroids')
        .then(response => response.json())
        .then(data => {
            allAsteroids = data;
            populateDropdown(data);
        })
        .catch(error => {
            console.error("Error fetching asteroids:", error);
            const select = document.getElementById('asteroid-select');
            select.innerHTML = '<option>Error: Could not load data</option>';
        });
}

function populateDropdown(asteroids) {
    const select = document.getElementById('asteroid-select');
    select.innerHTML = ''; // Clear "Loading..."

    if (asteroids.length === 0) {
        select.innerHTML = '<option>No asteroids found in next 7 days</option>';
        return;
    }

    asteroids.forEach(asteroid => {
        const option = document.createElement('option');
        option.value = asteroid.id;
        option.textContent = asteroid.name;
        select.appendChild(option);
    });
}

// --- Simulation and Deflection Logic ---

function getSelectedAsteroid() {
    const selectedId = document.getElementById('asteroid-select').value;
    return allAsteroids.find(ast => ast.id === selectedId);
}

function runSimulation() {
    const asteroid = getSelectedAsteroid();
    if (!asteroid) {
        alert("Please select an asteroid.");
        return;
    }

    // Call the backend to do the physics calculations
    fetch('http://127.0.0.1:5000/api/calculate_impact', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            diameter: asteroid.diameter_m,
            velocity: asteroid.velocity_km_s
        }),
    })
    .then(response => response.json())
    .then(results => {
        updateMapAndInfo(results, asteroid);
    })
    .catch(error => console.error('Error in simulation:', error));
}

function runDeflection() {
    const asteroid = getSelectedAsteroid();
    if (!asteroid) {
        alert("Please select an asteroid first.");
        return;
    }

    const deltaV = document.getElementById('delta-v-slider').value;
    
    // Call the backend to calculate the new trajectory
    fetch('http://127.0.0.1:5000/api/calculate_deflection', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            miss_distance: asteroid.miss_distance_km,
            velocity: asteroid.velocity_km_s,
            delta_v: parseFloat(deltaV)
        }),
    })
    .then(response => response.json())
    .then(results => {
        const defendInfoBox = document.getElementById('defend-info');
        const newMissKm = results.new_miss_distance_km;
        const earthRadiusKm = 6371; // Average radius of Earth
        
        let message = `New Miss Distance: <strong>${newMissKm.toLocaleString()} km</strong>.`;
        if (newMissKm > earthRadiusKm) {
            message += ` <span style="color: green;">SUCCESS! The asteroid will miss Earth.</span>`;
        } else {
            message += ` <span style="color: red;">FAILURE! The asteroid remains a threat.</span>`;
        }
        defendInfoBox.innerHTML = message;
    });
}

function updateMapAndInfo(results, asteroid) {
    // Remove the old crater before drawing a new one
    if (impactCraterLayer) {
        map.removeLayer(impactCraterLayer);
    }
    
    // Draw the new crater on the map
    const craterRadiusMeters = (results.crater_diameter_km * 1000) / 2;
    impactCraterLayer = L.circle([43.6532, -79.3832], {
        color: 'red', fillColor: '#f03', fillOpacity: 0.5, radius: craterRadiusMeters
    }).addTo(map);

    // Zoom the map to fit the crater for a better view
    map.fitBounds(impactCraterLayer.getBounds());
    
    // Display the detailed impact results
    const infoBox = document.getElementById('impact-info');
    infoBox.innerHTML = `
        <strong>Impact Results for ${asteroid.name}:</strong><br>
        Initial Miss Distance: ${asteroid.miss_distance_km.toLocaleString()} km<br>
        Impact Energy: ${results.energy_megatons} Megatons of TNT<br>
        Est. Crater Diameter: ${results.crater_diameter_km} km<br>
        Est. Seismic Magnitude: ${results.seismic_magnitude} (Richter Scale)
    `;
    
    // Clear any previous deflection results
    document.getElementById('defend-info').innerHTML = '';
}