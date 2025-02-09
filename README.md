# Disaster Alert Dashboard

## Purpose
The **Disaster Alert Dashboard** is a web-based application designed to help users stay informed about recent natural disasters, specifically earthquakes, and provides a map of nearby disaster relief centers. The application aims to offer real-time earthquake data and aid in locating emergency response centers, enabling users to take quick actions during a disaster.

Key features include:
- **Real-time Earthquake Monitoring**: Displays recent earthquake data from the USGS Earthquake API, including earthquake magnitudes, locations, and times.
- **Interactive Map**: Users can view and interact with a map that shows both earthquake locations and nearby disaster relief centers.
- **Search Functionality**: Users can search for earthquakes and disaster relief centers by location to get data specific to their region.
- **Alerts & Updates**: Earthquake alerts are displayed on the dashboard, ensuring users are aware of recent events in their region.

The goal of this project is to increase awareness and provide helpful resources in case of earthquakes or other natural disasters, ensuring that individuals and communities can quickly find the nearest help centers.

## Features
- **Real-time Earthquake Data**: Fetches and displays earthquake data for the past week from the USGS Earthquake API.
- **Interactive Map**: Displays a map with markers for disaster relief centers and recent earthquakes.
- **Search by Location**: Users can search for earthquakes within a specified radius of a location.
- **Error Handling**: Displays error messages if the data fetch fails or no earthquakes are found.

## Technologies Used
- **HTML**: Structure of the web page.
- **CSS**: Styling of the webpage with a responsive layout.
- **JavaScript**: Fetches and displays earthquake data, handles map interactions, and implements search functionality.
- **Google Maps API**: For displaying an interactive map with help centers and earthquake locations.
- **USGS Earthquake API**: For fetching earthquake data.

## Installation
To use the Disaster Alert Dashboard locally:

1. Clone this repository:
    ```bash
    git clone https://github.com/yourusername/disaster-alert-dashboard.git
    ```

2. Open the `index.html` file in your browser.

## Files

- **index.html**: The main HTML structure of the dashboard.
- **styles.css**: The styling for the page, including layout and visual effects.
- **script.js**: The JavaScript functionality, including map initialization, earthquake data fetching, and location search.

## How to Use
1. **View Recent Earthquakes**: The dashboard automatically fetches and displays recent earthquake alerts from the USGS API.
2. **Search by Location**: Enter a location in the search box and click the "Search" button to see recent earthquakes within a 500km radius of that location.
3. **Interactive Map**: The map shows disaster relief centers and earthquake locations. Click on a marker to get more details.


## Acknowledgments
- **USGS Earthquake API**: For providing earthquake data.
- **Google Maps API**: For the interactive map and geolocation features.
