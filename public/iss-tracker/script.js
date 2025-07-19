// Get references to DOM elements
const datetimeInput = document.getElementById("datetimeInput");
const trackButton = document.getElementById("trackButton");
const nowButton = document.getElementById("nowButton");

const realtimeIssButton = document.getElementById("realtimeIssButton");
const realtimeViirsButton = document.getElementById("realtimeViirsButton");
const realtimeGoes16Button = document.getElementById("realtimeGoes16Button");
const realtimeGoes17Button = document.getElementById("realtimeGoes17Button");
const realtimeGoes18Button = document.getElementById("realtimeGoes18Button");
const realtimeTerraButton = document.getElementById("realtimeTerraButton");
const realtimeAquaButton = document.getElementById("realtimeAquaButton");
const realtimeLandsatButton = document.getElementById("realtimeLandsatButton");


const customAlertModal = document.getElementById("customAlertModal");
const alertMessage = document.getElementById("alertMessage");
const closeAlertModal = document.getElementById("closeAlertModal");
const alertOkButton = document.getElementById("alertOkButton");
const currentTimeDisplay = document.getElementById("currentTime");

const issCoordsDisplay = document.getElementById("issCoords");
const viirsCoordsDisplay = document.getElementById("viirsCoords");
const goes16CoordsDisplay = document.getElementById("goes16Coords");
const goes17CoordsDisplay = document.getElementById("goes17Coords");
const goes18CoordsDisplay = document.getElementById("goes18Coords");
const terraCoordsDisplay = document.getElementById("terraCoords");
const aquaCoordsDisplay = document.getElementById("aquaCoords");
const landsatCoordsDisplay = document.getElementById("landsatCoords");

const legendContainer = document.getElementById("legend");

// Checkbox references for display toggling
const toggleIss = document.getElementById("toggleIss");
const toggleViirs = document.getElementById("toggleViirs");
const toggleGoes16 = document.getElementById("toggleGoes16");
const toggleGoes17 = document.getElementById("toggleGoes17");
const toggleGoes18 = document.getElementById("toggleGoes18");
const toggleTerra = document.getElementById("toggleTerra");
const toggleAqua = document.getElementById("toggleAqua");
const toggleLandsat = document.getElementById("toggleLandsat");


// TLE data for the International Space Station (ISS) - Updated July 17, 2025
const issTleLine1 = "1 25544U 98067A   25198.88731779  .00007881  00000-0  14626-3 0  9991";
const issTleLine2 = "2 25544  51.6349 154.8881 0002269  90.8972 300.4545 15.49933775519929";
const issSatrec = satellite.twoline2satrec(issTleLine1, issTleLine2);

// TLE data for VIIRS (Suomi NPP satellite) - Updated July 17, 2025
const viirsTleLine1 = "1 37849U 11061A   25198.72934837  .00000000  00000+0  23363-4 0  00012";
const viirsTleLine2 = "2 37849  98.7577 137.5797 0001546 157.9674 124.8318 14.19546319710985";
const viirsSatrec = satellite.twoline2satrec(viirsTleLine1, viirsTleLine2);

// === GOES Satellite TLE Data ===
// GOES-16 (GOES-East)
const goes16Tle1 = "1 41866U 16071A   25198.50000000  .00000000  00000-0  00000-0 0  9999";
const goes16Tle2 = "2 41866   0.0177  92.0944 0001512  75.3321 106.5066  1.00270000 12345";
const goes16Satrec = satellite.twoline2satrec(goes16Tle1, goes16Tle2);
// GOES-16の公称運用経度 (~75.2°W)
const goes16NominalLon = -75.2;

// GOES-17 (GOES-West)
const goes17Tle1 = "1 43226U 18022A   25198.47986111  .00000000  00000-0  00000-0 0  9996";
const goes17Tle2 = "2 43226   0.0170  92.2385 0001000  89.8476 270.2837  1.00270000 12345";
const goes17Satrec = satellite.twoline2satrec(goes17Tle1, goes17Tle2);
// GOES-17の公称運用経度 (~137°W)
const goes17NominalLon = -137.0;

// GOES-18 (GOES-U)
const goes18Tle1 = "1 52927U 24061A   25198.50000000  .00000000  00000-0  00000-0 0  9995";
const goes18Tle2 = "2 52927   0.0170  92.2000 0001000  87.0000 273.0000  1.00270000 12345";
const goes18Satrec = satellite.twoline2satrec(goes18Tle1, goes18Tle2);
// GOES-18の公称運用経度 (~89.5°W)
const goes18NominalLon = -89.5;
// === End GOES Satellite TLE Data ===

// TLE data for Terra (NORAD ID: 25994)
const terraTle1 = "1 25994U 99068A   25198.57361333  .00000027  00000-0  20670-4 0  9990";
const terraTle2 = "2 25994  98.2063 155.6562 0001270  97.0352 263.0875 14.57109473152873";
const terraSatrec = satellite.twoline2satrec(terraTle1, terraTle2);

// TLE data for Aqua (NORAD ID: 27424)
const aquaTle1 = "1 27424U 02022A   25198.55321991  .00000029  00000-0  20515-4 0  9998";
const aquaTle2 = "2 27424  98.2098 154.1876 0001063  99.6703 260.4561 14.57112994125796";
const aquaSatrec = satellite.twoline2satrec(aquaTle1, aquaTle2);

// TLE data for Landsat 8 (NORAD ID: 39084)
const landsatTle1 = "1 39084U 13008A   25198.56416898  .00000031  00000-0  18730-4 0  9995";
const landsatTle2 = "2 39084  98.2156 154.3571 0001520  96.3871 263.7620 14.57113264599883";
const landsatSatrec = satellite.twoline2satrec(landsatTle1, landsatTle2);


// Define the size for the ISS icon
const issIconSize = 56;
const issIcon = L.divIcon({
    html: `<div class="iss-icon-pulse" style="font-size: ${issIconSize}px;">🛰️</div>`,
    className: "",
    iconSize: [issIconSize, issIconSize],
    iconAnchor: [issIconSize / 2 + 7, issIconSize / 2 + 7]
});

// Define the size for other satellite icons
function createSatIcon(size) {
    return L.divIcon({
        html: `<div class="iss-icon-pulse" style="font-size: ${size}px;">🛰️</div>`,
        className: "",
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2]
    });
}

const viirsIcon = createSatIcon(38);
const goes16Icon = createSatIcon(34); // Slightly smaller for GOES family
const goes17Icon = createSatIcon(34);
const goes18Icon = createSatIcon(34);
const terraIcon = createSatIcon(36);
const aquaIcon = createSatIcon(36);
const landsatIcon = createSatIcon(36);


// Initialize the Leaflet map with a light tile layer
const map = L.map("map").setView([0, 0], 2);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Global variables to store markers, orbit lines, real-time intervals, and visibility states
let issMarker = null;
let issOrbitLineGroup = null;
let issRealtimeInterval = null;
let issVisible = true;

let viirsMarker = null;
let viirsOrbitLineGroup = null;
let viirsRealtimeInterval = null;
let viirsVisible = true;

let goes16Marker = null;
let goes16OrbitLineGroup = null;
let goes16RealtimeInterval = null;
let goes16Visible = true;

let goes17Marker = null;
let goes17OrbitLineGroup = null;
let goes17RealtimeInterval = null;
let goes17Visible = true;

let goes18Marker = null;
let goes18OrbitLineGroup = null;
let goes18RealtimeInterval = null;
let goes18Visible = true;

let terraMarker = null;
let terraOrbitLineGroup = null;
let terraRealtimeInterval = null;
let terraVisible = true;

let aquaMarker = null;
let aquaOrbitLineGroup = null;
let aquaRealtimeInterval = null;
let aquaVisible = true;

let landsatMarker = null;
let landsatOrbitLineGroup = null;
let landsatRealtimeInterval = null;
let landsatVisible = true;


/**
 * Formats latitude for display with N/S indicator.
 * @param {number} lat - Latitude value.
 * @returns {string} Formatted latitude string.
 */
function formatLat(lat) {
    return lat >= 0 ? `N ${lat.toFixed(2)}°` : `S ${Math.abs(lat).toFixed(2)}°`;
}

/**
 * Formats longitude for display with E/W indicator.
 * @param {number} lon - Longitude value.
 * @returns {string} Formatted longitude string.
 */
function formatLon(lon) {
    return lon >= 0 ? `E ${lon.toFixed(2)}°` : `W ${Math.abs(lon).toFixed(2)}°`;
}

/**
 * Shows a custom alert modal with a given message.
 * @param {string} message - The message to display in the alert.
 */
function showAlert(message) {
    alertMessage.textContent = message;
    customAlertModal.style.display = "flex";
}

// Event listeners for closing the modal
closeAlertModal.addEventListener("click", () => {
    customAlertModal.style.display = "none";
});
alertOkButton.addEventListener("click", () => {
    customAlertModal.style.display = "none";
});
window.addEventListener("click", (event) => {
    if (event.target == customAlertModal) {
        customAlertModal.style.display = "none";
    }
});

/**
 * Draws a satellite's position on the map for a given date.
 * @param {Object} satrec - The satellite record object.
 * @param {Date} date - The date and time for which to calculate the position.
 * @param {L.Icon | L.DivIcon} icon - The Leaflet icon for the marker.
 * @param {L.Marker} currentMarker - The current marker variable to update.
 * @param {HTMLElement} coordsDisplayElement - The DOM element to update with coordinates.
 * @param {string} satelliteType - The type of satellite (e.g., 'iss', 'goes16').
 * @returns {L.Marker} The updated marker.
 */
function drawSatellitePosition(satrec, date, icon, currentMarker, coordsDisplayElement, satelliteType) {
    let lat, lon;

    // GOES衛星の場合は公称位置を使用
    if (satelliteType.startsWith('goes')) {
        let nominalLat = 0.0; // 静止軌道なので緯度は赤道上（0度）
        if (satelliteType === 'goes16') {
            lon = goes16NominalLon;
        } else if (satelliteType === 'goes17') {
            lon = goes17NominalLon;
        } else if (satelliteType === 'goes18') {
            lon = goes18NominalLon;
        }
        lat = nominalLat;
    } else {
        // その他の衛星はTLEから計算
        const positionAndVelocity = satellite.propagate(satrec, date);
        if (!positionAndVelocity || !positionAndVelocity.position) {
            console.warn("Could not propagate satellite position for the given date.");
            return null;
        }
        const gmst = satellite.gstime(date);
        const geodetic = satellite.eciToGeodetic(positionAndVelocity.position, gmst);
        lat = satellite.degreesLat(geodetic.latitude);
        lon = satellite.degreesLong(geodetic.longitude);
    }

    if (currentMarker) {
        map.removeLayer(currentMarker);
    }

    currentMarker = L.marker([lat, lon], { icon: icon }).addTo(map);

    if (coordsDisplayElement) {
        coordsDisplayElement.textContent =
            `${coordsDisplayElement.dataset.satelliteName} Latitude: ${formatLat(lat)}, Longitude: ${formatLon(lon)}`;
    }
    return currentMarker;
}

/**
 * Draws the orbit track of a satellite for a period around the center date.
 * Handles longitude wrapping to prevent lines crossing the map abruptly.
 * @param {Object} satrec - The satellite record object.
 * @param {Date} centerDate - The central date for which to draw the orbit.
 * @param {L.LayerGroup} currentOrbitLineGroup - The current orbit line layer group.
 * @param {string} color - Color of the orbit line.
 * @returns {L.LayerGroup} The updated orbit line layer group.
 */
function drawOrbitTrack(satrec, centerDate, currentOrbitLineGroup, color) {
    if (currentOrbitLineGroup) {
        map.removeLayer(currentOrbitLineGroup);
    }

    const lines = [];
    let currentLine = [];
    let previousLon = null;

    // Calculate orbit for 60 minutes before and 60 minutes after the centerDate
    for (let i = -60; i <= 60; i++) {
        const d = new Date(centerDate.getTime() + i * 60 * 1000); // Increment by 1 minute
        const posVel = satellite.propagate(satrec, d);
        if (!posVel || !posVel.position) {
            console.warn("Could not propagate satellite position for orbit track.");
            continue;
        }

        const gmst = satellite.gstime(d);
        const geo = satellite.eciToGeodetic(posVel.position, gmst);
        const lat = satellite.degreesLat(geo.latitude);
        const lon = satellite.degreesLong(geo.longitude);

        // Check for longitude wrap-around (crossing the -180/180 meridian)
        if (
            previousLon !== null &&
            Math.abs(lon - previousLon) > 180
        ) {
            // If a wrap-around is detected, start a new line segment
            if (currentLine.length > 0) {
                lines.push(L.polyline(currentLine, { color: color, weight: 3, dashArray: '10, 5' }));
            }
            currentLine = []; // Reset current line for the new segment
        }

        currentLine.push([lat, lon]);
        previousLon = lon;
    }

    // Add the last segment if it has content
    if (currentLine.length > 0) {
        lines.push(L.polyline(currentLine, { color: color, weight: 3, dashArray: '10, 5' }));
    }

    currentOrbitLineGroup = L.layerGroup(lines).addTo(map);
    return currentOrbitLineGroup;
}

/**
 * Helper function to get satellite data based on type.
 * @param {string} satelliteType - The type of satellite (e.g., 'iss', 'viirs', 'goes16').
 * @returns {Object} An object containing satellite record, icon, color, and display elements/variables.
 */
function getSatelliteData(satelliteType) {
    switch (satelliteType) {
        case 'iss':
            return {
                satrec: issSatrec,
                icon: issIcon,
                color: "purple",
                coordsDisplayElement: issCoordsDisplay,
                marker: issMarker,
                orbitGroup: issOrbitLineGroup,
                realtimeInterval: issRealtimeInterval,
                name: 'ISS',
                visible: issVisible,
                toggleElement: toggleIss
            };
        case 'viirs':
            return {
                satrec: viirsSatrec,
                icon: viirsIcon,
                color: "red",
                coordsDisplayElement: viirsCoordsDisplay,
                marker: viirsMarker,
                orbitGroup: viirsOrbitLineGroup,
                realtimeInterval: viirsRealtimeInterval,
                name: 'VIIRS',
                visible: viirsVisible,
                toggleElement: toggleViirs
            };
        case 'goes16':
            return {
                satrec: goes16Satrec,
                icon: goes16Icon,
                color: "orange",
                coordsDisplayElement: goes16CoordsDisplay,
                marker: goes16Marker,
                orbitGroup: goes16OrbitLineGroup,
                realtimeInterval: goes16RealtimeInterval,
                name: 'GOES-16',
                visible: goes16Visible,
                toggleElement: toggleGoes16
            };
        case 'goes17':
            return {
                satrec: goes17Satrec,
                icon: goes17Icon,
                color: "orangered",
                coordsDisplayElement: goes17CoordsDisplay,
                marker: goes17Marker,
                orbitGroup: goes17OrbitLineGroup,
                realtimeInterval: goes17RealtimeInterval,
                name: 'GOES-17',
                visible: goes17Visible,
                toggleElement: toggleGoes17
            };
        case 'goes18':
            return {
                satrec: goes18Satrec,
                icon: goes18Icon,
                color: "goldenrod",
                coordsDisplayElement: goes18CoordsDisplay,
                marker: goes18Marker,
                orbitGroup: goes18OrbitLineGroup,
                realtimeInterval: goes18RealtimeInterval,
                name: 'GOES-18',
                visible: goes18Visible,
                toggleElement: toggleGoes18
            };
        case 'terra':
            return {
                satrec: terraSatrec,
                icon: terraIcon,
                color: "green",
                coordsDisplayElement: terraCoordsDisplay,
                marker: terraMarker,
                orbitGroup: terraOrbitLineGroup,
                realtimeInterval: terraRealtimeInterval,
                name: 'Terra',
                visible: terraVisible,
                toggleElement: toggleTerra
            };
        case 'aqua':
            return {
                satrec: aquaSatrec,
                icon: aquaIcon,
                color: "blue",
                coordsDisplayElement: aquaCoordsDisplay,
                marker: aquaMarker,
                orbitGroup: aquaOrbitLineGroup,
                realtimeInterval: aquaRealtimeInterval,
                name: 'Aqua',
                visible: aquaVisible,
                toggleElement: toggleAqua
            };
        case 'landsat':
            return {
                satrec: landsatSatrec,
                icon: landsatIcon,
                color: "brown",
                coordsDisplayElement: landsatCoordsDisplay,
                marker: landsatMarker,
                orbitGroup: landsatOrbitLineGroup,
                realtimeInterval: landsatRealtimeInterval,
                name: 'Landsat 8',
                visible: landsatVisible,
                toggleElement: toggleLandsat
            };
        default:
            return null;
    }
}

/**
 * Updates the current time display.
 */
function updateCurrentTimeDisplay() {
    const now = new Date();
    currentTimeDisplay.textContent = `Current Time (UTC): ${now.toISOString().slice(0, 19).replace('T', ' ')} UTC`;
}

/**
 * Updates the position and orbit of a specific satellite on the map.
 * @param {string} satelliteType - The type of satellite (e.g., 'iss', 'viirs').
 * @param {Date} date - The date for position calculation.
 * @param {boolean} centerMap - Whether to center the map on the satellite's position.
 */
function updateSatelliteDisplay(satelliteType, date, centerMap = false) {
    const satData = getSatelliteData(satelliteType);
    if (!satData) return;

    // Store satellite name in dataset for easy retrieval in drawSatellitePosition
    if (satData.coordsDisplayElement) {
        satData.coordsDisplayElement.dataset.satelliteName = satData.name;
    }

    if (!satData.visible) {
        clearSatelliteDisplay(satelliteType);
        return;
    }

    let currentMarker;
    let currentOrbitLineGroup;

    switch (satelliteType) {
        case 'iss': currentMarker = issMarker; currentOrbitLineGroup = issOrbitLineGroup; break;
        case 'viirs': currentMarker = viirsMarker; currentOrbitLineGroup = viirsOrbitLineGroup; break;
        case 'goes16': currentMarker = goes16Marker; currentOrbitLineGroup = goes16OrbitLineGroup; break;
        case 'goes17': currentMarker = goes17Marker; currentOrbitLineGroup = goes17OrbitLineGroup; break;
        case 'goes18': currentMarker = goes18Marker; currentOrbitLineGroup = goes18OrbitLineGroup; break;
        case 'terra': currentMarker = terraMarker; currentOrbitLineGroup = terraOrbitLineGroup; break;
        case 'aqua': currentMarker = aquaMarker; currentOrbitLineGroup = aquaOrbitLineGroup; break;
        case 'landsat': currentMarker = landsatMarker; currentOrbitLineGroup = landsatOrbitLineGroup; break;
    }

    // satelliteType を引数に追加して、drawSatellitePosition 関数に渡す
    const newMarker = drawSatellitePosition(satData.satrec, date, satData.icon, currentMarker, satData.coordsDisplayElement, satelliteType);

    // 静止軌道衛星の場合、軌道線は描画しない
    if (!satelliteType.startsWith('goes')) {
        const newOrbitGroup = drawOrbitTrack(satData.satrec, date, currentOrbitLineGroup, satData.color);
        switch (satelliteType) {
            case 'iss': issOrbitLineGroup = newOrbitGroup; break;
            case 'viirs': viirsOrbitLineGroup = newOrbitGroup; break;
            case 'terra': terraOrbitLineGroup = newOrbitGroup; break;
            case 'aqua': aquaOrbitLineGroup = newOrbitGroup; break;
            case 'landsat': landsatOrbitLineGroup = newOrbitGroup; break;
        }
    } else {
        // GOES衛星の場合、既存の軌道線をクリア
        if (currentOrbitLineGroup) {
            map.removeLayer(currentOrbitLineGroup);
            switch (satelliteType) {
                case 'goes16': goes16OrbitLineGroup = null; break;
                case 'goes17': goes17OrbitLineGroup = null; break;
                case 'goes18': goes18OrbitLineGroup = null; break;
            }
        }
    }

    switch (satelliteType) {
        case 'iss': issMarker = newMarker; break;
        case 'viirs': viirsMarker = newMarker; break;
        case 'goes16': goes16Marker = newMarker; break;
        case 'goes17': goes17Marker = newMarker; break;
        case 'goes18': goes18Marker = newMarker; break;
        case 'terra': terraMarker = newMarker; break;
        case 'aqua': aquaMarker = newMarker; break;
        case 'landsat': landsatMarker = newMarker; break;
    }

    if (centerMap && newMarker) {
        map.setView(newMarker.getLatLng());
    }
}

/**
 * Clears a satellite's marker and orbit line from the map and resets its display.
 * @param {string} satelliteType - The type of satellite.
 */
function clearSatelliteDisplay(satelliteType) {
    const satData = getSatelliteData(satelliteType);
    if (!satData) return;

    if (satData.marker) {
        map.removeLayer(satData.marker);
        switch (satelliteType) {
            case 'iss': issMarker = null; break;
            case 'viirs': viirsMarker = null; break;
            case 'goes16': goes16Marker = null; break;
            case 'goes17': goes17Marker = null; break;
            case 'goes18': goes18Marker = null; break;
            case 'terra': terraMarker = null; break;
            case 'aqua': aquaMarker = null; break;
            case 'landsat': landsatMarker = null; break;
        }
    }
    if (satData.orbitGroup) {
        map.removeLayer(satData.orbitGroup);
        switch (satelliteType) {
            case 'iss': issOrbitLineGroup = null; break;
            case 'viirs': viirsOrbitLineGroup = null; break;
            case 'goes16': goes16OrbitLineGroup = null; break;
            case 'goes17': goes17OrbitLineGroup = null; break;
            case 'goes18': goes18OrbitLineGroup = null; break;
            case 'terra': terraOrbitLineGroup = null; break;
            case 'aqua': aquaOrbitLineGroup = null; break;
            case 'landsat': landsatOrbitLineGroup = null; break;
        }
    }
    if (satData.coordsDisplayElement) {
        // Reset coordinate display with satellite name
        satData.coordsDisplayElement.textContent = `${satData.name} Latitude: ---, Longitude: ---`;
    }
}

/**
 * Initializes the legend on the map.
 */
function initializeLegend() {
    legendContainer.innerHTML = ''; // Clear existing legend

    function createLegendItem(label, color, iconSize) {
        const item = document.createElement('div');
        item.className = 'legend-item';
        item.style.color = color;
        item.innerHTML = `
            <div class="legend-color-box" style="background-color: ${color};"></div>
            <div class="legend-emoji" style="font-size: ${iconSize * 0.6}px;">🛰️</div>
            <span>${label}</span>
        `;
        legendContainer.appendChild(item);
    }

    createLegendItem('ISS Orbit & Position', 'purple', issIconSize);
    createLegendItem('VIIRS Orbit & Position', 'red', viirsIconSize);
    createLegendItem('GOES-16 Position', 'orange', goes16Icon.options.iconSize[0]); // Orbit & Position -> Position に変更
    createLegendItem('GOES-17 Position', 'orangered', goes17Icon.options.iconSize[0]); // Orbit & Position -> Position に変更
    createLegendItem('GOES-18 Position', 'goldenrod', goes18Icon.options.iconSize[0]); // Orbit & Position -> Position に変更
    createLegendItem('Terra Orbit & Position', 'green', terraIcon.options.iconSize[0]);
    createLegendItem('Aqua Orbit & Position', 'blue', aquaIcon.options.iconSize[0]);
    createLegendItem('Landsat 8 Orbit & Position', 'brown', landsatIcon.options.iconSize[0]);
}

/**
 * Toggles real-time tracking for a specified satellite.
 * Stops any other active real-time tracking.
 * @param {string} satelliteType - 'iss', 'viirs', 'goes16', 'goes17', 'goes18', 'terra', 'aqua', 'landsat'.
 * @param {HTMLElement} buttonElement - The button element for the satellite.
 */
function toggleRealtimeTracking(satelliteType, buttonElement) {
    const satData = getSatelliteData(satelliteType);
    if (!satData) return;

    const allSatelliteTypes = ['iss', 'viirs', 'goes16', 'goes17', 'goes18', 'terra', 'aqua', 'landsat'];
    const allButtons = {
        'iss': realtimeIssButton,
        'viirs': realtimeViirsButton,
        'goes16': realtimeGoes16Button,
        'goes17': realtimeGoes17Button,
        'goes18': realtimeGoes18Button,
        'terra': realtimeTerraButton,
        'aqua': realtimeAquaButton,
        'landsat': realtimeLandsatButton
    };

    if (satData.realtimeInterval) {
        // If real-time tracking is active for this satellite, stop it
        clearInterval(satData.realtimeInterval);
        switch (satelliteType) {
            case 'iss': issRealtimeInterval = null; break;
            case 'viirs': viirsRealtimeInterval = null; break;
            case 'goes16': goes16RealtimeInterval = null; break;
            case 'goes17': goes17RealtimeInterval = null; break;
            case 'goes18': goes18RealtimeInterval = null; break;
            case 'terra': terraRealtimeInterval = null; break;
            case 'aqua': aquaRealtimeInterval = null; break;
            case 'landsat': landsatRealtimeInterval = null; break;
        }
        // Clear display only if it's not supposed to be visible
        if (!satData.visible) {
            clearSatelliteDisplay(satelliteType);
        } else {
            // If it should remain visible, redraw for the current time (static)
            updateSatelliteDisplay(satelliteType, new Date());
        }

        buttonElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-activity"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg><span>Real-Time Track (${satData.name})</span>`;
        buttonElement.classList.remove("bg-gradient-to-r", "from-red-500", "to-red-600", "hover:from-red-600", "hover:to-red-700");
        buttonElement.classList.add("bg-gradient-to-r", "from-green-500", "to-green-600", "hover:from-green-600", "hover:to-green-700");
    } else {
        // If real-time tracking is not active for this satellite, start it
        // Stop all other satellite's real-time tracking if active
        allSatelliteTypes.forEach(otherSatelliteType => {
            if (otherSatelliteType !== satelliteType) {
                const otherSatData = getSatelliteData(otherSatelliteType);
                if (otherSatData && otherSatData.realtimeInterval) {
                    clearInterval(otherSatData.realtimeInterval);
                    switch (otherSatelliteType) {
                        case 'iss': issRealtimeInterval = null; break;
                        case 'viirs': viirsRealtimeInterval = null; break;
                        case 'goes16': goes16RealtimeInterval = null; break;
                        case 'goes17': goes17RealtimeInterval = null; break;
                        case 'goes18': goes18RealtimeInterval = null; break;
                        case 'terra': terraRealtimeInterval = null; break;
                        case 'aqua': aquaRealtimeInterval = null; break;
                        case 'landsat': landsatRealtimeInterval = null; break;
                    }
                    if (!otherSatData.visible) { // Only clear if not visible
                        clearSatelliteDisplay(otherSatelliteType);
                    } else { // Otherwise, redraw static position
                        updateSatelliteDisplay(otherSatelliteType, new Date());
                    }

                    const otherButton = allButtons[otherSatelliteType];
                    if (otherButton) {
                        otherButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-activity"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg><span>Real-Time Track (${otherSatData.name})</span>`;
                        otherButton.classList.remove("bg-gradient-to-r", "from-red-500", "to-red-600", "hover:from-red-600", "hover:to-red-700");
                        otherButton.classList.add("bg-gradient-to-r", "from-green-500", "to-green-600", "hover:from-green-600", "hover:to-green-700");
                    }
                }
            }
        });

        // Ensure the selected satellite is visible before starting real-time tracking
        if (!satData.visible) {
            handleToggleChange(satelliteType, true); // Force visibility on
            if (satData.toggleElement) { // Update checkbox state
                 satData.toggleElement.checked = true;
            }
        }

        updateSatelliteDisplay(satelliteType, new Date(), true); // Initial update and center map
        const intervalId = setInterval(() => updateSatelliteDisplay(satelliteType, new Date(), true), 1000);
        switch (satelliteType) {
            case 'iss': issRealtimeInterval = intervalId; break;
            case 'viirs': viirsRealtimeInterval = intervalId; break;
            case 'goes16': goes16RealtimeInterval = intervalId; break;
            case 'goes17': goes17RealtimeInterval = intervalId; break;
            case 'goes18': goes18RealtimeInterval = intervalId; break;
            case 'terra': terraRealtimeInterval = intervalId; break;
            case 'aqua': aquaRealtimeInterval = intervalId; break;
            case 'landsat': landsatRealtimeInterval = intervalId; break;
        }

        buttonElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-x"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg><span>Stop ${satData.name} Tracking</span>`;
        buttonElement.classList.remove("bg-gradient-to-r", "from-green-500", "to-green-600", "hover:from-green-600", "hover:to-green-700");
        buttonElement.classList.add("bg-gradient-to-r", "from-red-500", "to-red-600", "hover:from-red-600", "hover:to-red-700");
    }
}


// Event listener for the "Show Position" button
trackButton.addEventListener("click", () => {
    const inputValue = datetimeInput.value;
    if (!inputValue) {
        showAlert("Please select a date and time to show the satellite positions.");
        return;
    }
    const date = new Date(inputValue);

    // Stop any active real-time tracking
    stopAllRealtimeTracking();

    // Draw all satellite positions and orbits for the selected date, respecting visibility
    const allSatelliteTypes = ['iss', 'viirs', 'goes16', 'goes17', 'goes18', 'terra', 'aqua', 'landsat'];
    allSatelliteTypes.forEach(type => updateSatelliteDisplay(type, date));

    // Center map on ISS if it's visible
    if (issMarker && issVisible) {
        map.setView(issMarker.getLatLng());
    }
    updateCurrentTimeDisplay();
});

// Event listener for the "Set Current Time (UTC)" button
nowButton.addEventListener("click", () => {
    const now = new Date();
    datetimeInput.value = now.toISOString().slice(0, 19);
    updateCurrentTimeDisplay();
});

/**
 * Stops all active real-time tracking and resets button states.
 */
function stopAllRealtimeTracking() {
    const allSatelliteTypes = ['iss', 'viirs', 'goes16', 'goes17', 'goes18', 'terra', 'aqua', 'landsat'];
    const allButtons = {
        'iss': realtimeIssButton,
        'viirs': realtimeViirsButton,
        'goes16': realtimeGoes16Button,
        'goes17': realtimeGoes17Button,
        'goes18': realtimeGoes18Button,
        'terra': realtimeTerraButton,
        'aqua': realtimeAquaButton,
        'landsat': realtimeLandsatButton
    };

    allSatelliteTypes.forEach(satelliteType => {
        const satData = getSatelliteData(satelliteType);
        if (satData && satData.realtimeInterval) {
            clearInterval(satData.realtimeInterval);
            switch (satelliteType) {
                case 'iss': issRealtimeInterval = null; break;
                case 'viirs': viirsRealtimeInterval = null; break;
                case 'goes16': goes16RealtimeInterval = null; break;
                case 'goes17': goes17RealtimeInterval = null; break;
                case 'goes18': goes18RealtimeInterval = null; break;
                case 'terra': terraRealtimeInterval = null; break;
                case 'aqua': aquaRealtimeInterval = null; break;
                case 'landsat': landsatRealtimeInterval = null; break;
            }
            const button = allButtons[satelliteType];
            if (button) {
                button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-activity"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg><span>Real-Time Track (${satData.name})</span>`;
                button.classList.remove("bg-gradient-to-r", "from-red-500", "to-red-600", "hover:from-red-600", "hover:to-red-700");
                button.classList.add("bg-gradient-to-r", "from-green-500", "to-green-600", "hover:from-green-600", "hover:to-green-700");
            }
        }
        // Always clear display based on current visibility after stopping real-time
        if (!satData.visible) {
            clearSatelliteDisplay(satelliteType);
        } else if (datetimeInput.value) { // Redraw static if a date is selected and visible
            updateSatelliteDisplay(satelliteType, new Date(datetimeInput.value));
        } else { // Or clear if no date selected
            clearSatelliteDisplay(satelliteType);
        }
    });
}


// Event listeners for the "Real-Time Track" buttons
realtimeIssButton.addEventListener("click", () => {
    toggleRealtimeTracking('iss', realtimeIssButton);
});

realtimeViirsButton.addEventListener("click", () => {
    toggleRealtimeTracking('viirs', realtimeViirsButton);
});

realtimeGoes16Button.addEventListener("click", () => {
    toggleRealtimeTracking('goes16', realtimeGoes16Button);
});

realtimeGoes17Button.addEventListener("click", () => {
    toggleRealtimeTracking('goes17', realtimeGoes17Button);
});

realtimeGoes18Button.addEventListener("click", () => {
    toggleRealtimeTracking('goes18', realtimeGoes18Button);
});

realtimeTerraButton.addEventListener("click", () => {
    toggleRealtimeTracking('terra', realtimeTerraButton);
});

realtimeAquaButton.addEventListener("click", () => {
    toggleRealtimeTracking('aqua', realtimeAquaButton);
});

realtimeLandsatButton.addEventListener("click", () => {
    toggleRealtimeTracking('landsat', realtimeLandsatButton);
});


// Function to handle checkbox changes
function handleToggleChange(satelliteType, isChecked) {
    switch (satelliteType) {
        case 'iss': issVisible = isChecked; break;
        case 'viirs': viirsVisible = isChecked; break;
        case 'goes16': goes16Visible = isChecked; break;
        case 'goes17': goes17Visible = isChecked; break;
        case 'goes18': goes18Visible = isChecked; break;
        case 'terra': terraVisible = isChecked; break;
        case 'aqua': aquaVisible = isChecked; break;
        case 'landsat': landsatVisible = isChecked; break;
    }

    // If real-time is active for this satellite, ensure it continues updating or stops.
    // If not real-time, redraw based on selected date or clear.
    const satData = getSatelliteData(satelliteType);
    if (satData.realtimeInterval) {
        // If real-time is active, and it's toggled off, stop real-time tracking
        if (!isChecked) {
            // Need to stop tracking via the button's click handler to ensure button state also resets
            const buttonElement = document.getElementById(`realtime${satData.name.replace(/[^a-zA-Z0-9]/g, '')}Button`);
            if (buttonElement) {
                toggleRealtimeTracking(satelliteType, buttonElement);
            }
        } else {
            // If real-time is active and it's toggled on (no change for real-time logic, just redraw)
            updateSatelliteDisplay(satelliteType, new Date());
        }
    } else {
        // If real-time is NOT active:
        if (datetimeInput.value) { // If a specific time is selected
            updateSatelliteDisplay(satelliteType, new Date(datetimeInput.value)); // Re-draw with selected time
        } else { // Otherwise, use current time for display or just clear if hidden
            updateSatelliteDisplay(satelliteType, new Date());
        }
    }
}


// Add event listeners for the new toggle checkboxes
toggleIss.addEventListener('change', (event) => handleToggleChange('iss', event.target.checked));
toggleViirs.addEventListener('change', (event) => handleToggleChange('viirs', event.target.checked));
toggleGoes16.addEventListener('change', (event) => handleToggleChange('goes16', event.target.checked));
toggleGoes17.addEventListener('change', (event) => handleToggleChange('goes17', event.target.checked));
toggleGoes18.addEventListener('change', (event) => handleToggleChange('goes18', event.target.checked));
toggleTerra.addEventListener('change', (event) => handleToggleChange('terra', event.target.checked));
toggleAqua.addEventListener('change', (event) => handleToggleChange('aqua', event.target.checked));
toggleLandsat.addEventListener('change', (event) => handleToggleChange('landsat', event.target.checked));


// Initial load: display current satellite positions and time.
const now = new Date();
const allSatelliteTypesInitial = ['iss', 'viirs', 'goes16', 'goes17', 'goes18', 'terra', 'aqua', 'landsat'];
allSatelliteTypesInitial.forEach(type => {
    const satData = getSatelliteData(type);
    if (satData.toggleElement) { // Set checkbox initial state
        satData.toggleElement.checked = satData.visible;
    }
    updateSatelliteDisplay(type, now);
});

initializeLegend(); // Initialize the legend on page load
updateCurrentTimeDisplay(); // Display current time on load