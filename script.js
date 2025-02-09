// Global variables
let map;
let markers = [];
let earthquakeMarkers = [];
let geocoder;
const helpCenters = [
    { lat: 34.0522, lng: -118.2437, name: "LA Emergency Center" },
    { lat: 40.7128, lng: -74.0060, name: "NYC Relief Center" },
    { lat: 51.5074, lng: -0.1278, name: "London Aid Center" },
    { lat: 35.6762, lng: 139.6503, name: "Tokyo Emergency Hub" },
];

// Calculate distance between two points in km
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Initialize the map
function initMap() {
    geocoder = new google.maps.Geocoder();
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 2,
        center: { lat: 0, lng: 0 },
        styles: [
            {
                featureType: "all",
                elementType: "labels",
                stylers: [{ visibility: "on" }]
            }
        ]
    });

    // Add help centers to the map
    helpCenters.forEach(center => {
        addMarker(center);
    });
}

// Add a marker to the map
function addMarker(location) {
    const marker = new google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map: map,
        title: location.name,
        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' // Blue for help centers
    });

    const infoWindow = new google.maps.InfoWindow({
        content: `<h3>${location.name}</h3>`
    });

    marker.addListener('click', () => {
        infoWindow.open(map, marker);
    });

    markers.push(marker);
}

// Add earthquake marker to the map
function addEarthquakeMarker(earthquake) {
    const coords = earthquake.geometry.coordinates;
    const magnitude = earthquake.properties.mag;
    const location = earthquake.properties.place;
    const time = new Date(earthquake.properties.time).toLocaleString();

    const marker = new google.maps.Marker({
        position: { lat: coords[1], lng: coords[0] },
        map: map,
        title: `M${magnitude} - ${location}`,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: Math.pow(2, magnitude) / 2,
            fillColor: '#FF0000',
            fillOpacity: 0.7,
            strokeWeight: 0.5
        }
    });

    const infoWindow = new google.maps.InfoWindow({
        content: `
            <h3>Magnitude ${magnitude}</h3>
            <p>Location: ${location}</p>
            <p>Time: ${time}</p>
        `
    });

    marker.addListener('click', () => {
        infoWindow.open(map, marker);
    });

    earthquakeMarkers.push(marker);
}

// Clear earthquake markers from the map
function clearEarthquakeMarkers() {
    earthquakeMarkers.forEach(marker => marker.setMap(null));
    earthquakeMarkers = [];
}

// Fetch earthquake data from USGS API
async function fetchEarthquakeData(searchLocation = null, radius = 1000) {
    try {
        const response = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson');
        if (!response.ok) {
            throw new Error('Failed to fetch earthquake data');
        }
        const data = await response.json();
        
        if (!data.features || data.features.length === 0) {
            showError('No earthquake data available');
            return;
        }

        // Clear existing earthquake markers
        clearEarthquakeMarkers();

        let filteredFeatures = data.features;
        
        // Filter earthquakes by location if search location is provided
        if (searchLocation) {
            filteredFeatures = data.features.filter(quake => {
                const quakeLat = quake.geometry.coordinates[1];
                const quakeLng = quake.geometry.coordinates[0];
                const distance = calculateDistance(
                    searchLocation.lat(),
                    searchLocation.lng(),
                    quakeLat,
                    quakeLng
                );
                return distance <= radius; // Show earthquakes within radius km
            });
        }

        // Sort by time (most recent first)
        filteredFeatures.sort((a, b) => b.properties.time - a.properties.time);
        
        // Display new earthquakes
        displayAlerts(filteredFeatures);
        
        // Add markers for new earthquakes
        filteredFeatures.forEach(earthquake => {
            addEarthquakeMarker(earthquake);
        });

        if (filteredFeatures.length === 0) {
            showError('No recent earthquakes found in this area');
        }
    } catch (error) {
        console.error('Error fetching earthquake data:', error);
        showError('Error fetching earthquake data: ' + error.message);
    }
}

// Display earthquake alerts
function displayAlerts(alerts) {
    const alertsContainer = document.getElementById('alerts-container');
    alertsContainer.innerHTML = '';

    if (!alerts || alerts.length === 0) {
        alertsContainer.innerHTML = '<p class="no-alerts">No recent earthquakes found.</p>';
        return;
    }

    alerts.forEach(alert => {
        const magnitude = alert.properties.mag;
        const location = alert.properties.place;
        const time = new Date(alert.properties.time).toLocaleString();

        const alertCard = document.createElement('div');
        alertCard.className = 'alert-card';
        alertCard.innerHTML = `
            <h3>Magnitude ${magnitude.toFixed(1)}</h3>
            <p>Location: ${location}</p>
            <p>Time: ${time}</p>
        `;

        alertCard.addEventListener('click', () => {
            const coords = alert.geometry.coordinates;
            map.setCenter({ lat: coords[1], lng: coords[0] });
            map.setZoom(6);
        });

        alertsContainer.appendChild(alertCard);
    });
}

// Search functionality
function searchRegion() {
    const searchInput = document.getElementById('search-input').value;
    
    if (!searchInput) {
        showError('Please enter a location to search');
        return;
    }

    // Use Geocoding service to find the location
    geocoder.geocode({ address: searchInput }, (results, status) => {
        if (status === 'OK') {
            const location = results[0].geometry.location;
            
            // Center map on the found location
            map.setCenter(location);
            map.setZoom(8);

            // Fetch earthquakes around this location
            fetchEarthquakeData(location, 500); // Search within 500km radius
        } else {
            showError('Location not found. Please try a different search term.');
        }
    });
}

// Error handling
function showError(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

// Initialize the application
window.onload = () => {
    initMap();
    fetchEarthquakeData(); // Initial fetch without location filter
    // Fetch new earthquake data every 5 minutes
    setInterval(() => fetchEarthquakeData(), 300000);
};