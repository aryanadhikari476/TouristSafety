
const socket = io();

// Start geolocation stream
if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      socket.emit("send-location", { latitude, longitude });
    },
    (error) => {
      console.error("Geolocation error:", error);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }
  );
}

// Initialize map
const map = L.map("map").setView([28.6692, 77.4538], 12);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "ABESIT",
}).addTo(map);

const markers = {};

// --- RED DANGER ZONE (circle example)
const dangerCenter = [28.63404298059361, 77.44724775342465];
const dangerRadius = 5000; // 5 km

const dangerCircle = L.circle(dangerCenter, {
  color: "red",
  fillColor: "#f03",
  fillOpacity: 0.3,
  radius: dangerRadius,
}).addTo(map);

// --- GREEN SAFE ZONE (trapezoid)
const safeTrapezoidCoords = [
  [28.745, 77.60],   // top-left
  [28.745, 77.633],  // top-right
  [28.675, 77.625],  // bottom-right
  [28.675, 77.605],  // bottom-left
];

const safeTrapezoid = L.polygon(safeTrapezoidCoords, {
  color: "green",
  fillColor: "#0f3",
  fillOpacity: 0.3,
}).addTo(map);

// Fit map to show both zones
const group = new L.featureGroup([dangerCircle, safeTrapezoid]);
map.fitBounds(group.getBounds());

let isInDanger = false;
let isInSafeZone = false;

// Helper function: check if point is inside trapezoid
function isPointInPolygon(point, polygon) {
  const x = point[0], y = point[1];
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1];
    const xj = polygon[j][0], yj = polygon[j][1];
    const intersect = ((yi > y) !== (yj > y)) &&
      (x < ((xj - xi) * (y - yi)) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

// Listen for location updates
socket.on("receive-location", (data) => {
  const { id, latitude, longitude } = data;
  const userLatLng = L.latLng(latitude, longitude);

  // Center map on user
  map.setView([latitude, longitude], 16);

  // Update or create marker
  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
  } else {
    markers[id] = L.marker([latitude, longitude]).addTo(map);
  }

  // Check RED danger zone
  const distanceToDanger = userLatLng.distanceTo(L.latLng(dangerCenter));
  if (distanceToDanger <= dangerRadius) {
    if (!isInDanger) {
      isInDanger = true;
      alert(
        "⚠️ You have entered a RED ALERT zone (5 km radius). This area is dangerous. Please move out immediately."
      );
      markers[id].bindPopup("🚨 Red Alert Zone!").openPopup();
    }
  } else if (isInDanger) {
    isInDanger = false;
    markers[id].bindPopup("✅ You left the danger zone.").openPopup();
  }

  // Check GREEN safe trapezoid
  if (isPointInPolygon([latitude, longitude], safeTrapezoidCoords)) {
    if (!isInSafeZone) {
      isInSafeZone = true;
      markers[id].bindPopup("✅ You are in a SAFE trapezoid zone now.").openPopup();
    }
  } else if (isInSafeZone) {
    isInSafeZone = false;
    markers[id].bindPopup("⚠️ You left the safe zone!").openPopup();
  }
});

// disconnected users
socket.on("user-disconnect", (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});










// const socket = io();

// // --- Initialize map ---
// const map = L.map("map").setView([28.6692, 77.4538], 12);
// L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//   attribution: "ABESIT",
// }).addTo(map);

// const markers = {};
// const path = L.polyline([], { color: "blue" }).addTo(map);

// // --- Sound for notifications ---
// const alertSound = new Audio("https://www.soundjay.com/button/beep-07.wav");

// // --- Multiple Zones ---
// // Red Danger Zones (circles and polygons)
// const redZones = [
//   {
//     name: "Danger Zone 1",
//     type: "circle",
//     center: [28.63404298059361, 77.44724775342465],
//     radius: 5000, // meters
//     layer: null
//   },
//   {
//     name: "Danger Zone 2",
//     type: "polygon",
//     coords: [
//       [28.70, 77.55],
//       [28.72, 77.57],
//       [28.68, 77.59]
//     ],
//     layer: null
//   }
// ];

// // Green Safe Zones (trapezoid/polygon)
// const greenZones = [
//   {
//     name: "Safe Zone 1",
//     type: "polygon",
//     coords: [
//       [28.745, 77.60],
//       [28.745, 77.633],
//       [28.675, 77.625],
//       [28.675, 77.605]
//     ],
//     layer: null
//   }
// ];

// // Draw zones on map
// redZones.forEach((zone) => {
//   if (zone.type === "circle") {
//     zone.layer = L.circle(zone.center, {
//       color: "red",
//       fillColor: "#f03",
//       fillOpacity: 0.3,
//       radius: zone.radius
//     }).addTo(map);
//   } else if (zone.type === "polygon") {
//     zone.layer = L.polygon(zone.coords, {
//       color: "red",
//       fillColor: "#f03",
//       fillOpacity: 0.3
//     }).addTo(map);
//   }
// });

// greenZones.forEach((zone) => {
//   zone.layer = L.polygon(zone.coords, {
//     color: "green",
//     fillColor: "#0f3",
//     fillOpacity: 0.3
//   }).addTo(map);
// });

// // Fit map to show all zones
// const allLayers = redZones.map(z => z.layer).concat(greenZones.map(z => z.layer));
// map.fitBounds(L.featureGroup(allLayers).getBounds());

// // --- Geolocation ---
// if (navigator.geolocation) {
//   navigator.geolocation.watchPosition(
//     (position) => {
//       const { latitude, longitude } = position.coords;
//       socket.emit("send-location", { latitude, longitude });
//     },
//     (error) => console.error("Geolocation error:", error),
//     { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
//   );
// }

// // --- Helper: Point in polygon ---
// function isPointInPolygon(point, polygonCoords) {
//   const x = point[0], y = point[1];
//   let inside = false;
//   for (let i = 0, j = polygonCoords.length - 1; i < polygonCoords.length; j = i++) {
//     const xi = polygonCoords[i][0], yi = polygonCoords[i][1];
//     const xj = polygonCoords[j][0], yj = polygonCoords[j][1];
//     const intersect = ((yi > y) !== (yj > y)) &&
//       (x < ((xj - xi) * (y - yi)) / (yj - yi) + xi);
//     if (intersect) inside = !inside;
//   }
//   return inside;
// }

// // --- Dynamic Popup Panel ---
// const popupDiv = document.createElement("div");
// popupDiv.style.position = "absolute";
// popupDiv.style.top = "10px";
// popupDiv.style.right = "10px";
// popupDiv.style.backgroundColor = "white";
// popupDiv.style.padding = "10px";
// popupDiv.style.border = "2px solid black";
// popupDiv.style.zIndex = 1000;
// popupDiv.innerHTML = "Current Status: ";
// document.body.appendChild(popupDiv);

// // --- Listen for location updates ---
// socket.on("receive-location", (data) => {
//   const { id, latitude, longitude } = data;
//   const userLatLng = L.latLng(latitude, longitude);

//   // Update path
//   path.addLatLng([latitude, longitude]);

//   // Center map
//   map.setView([latitude, longitude], 16);

//   // Update marker
//   if (markers[id]) {
//     markers[id].setLatLng([latitude, longitude]);
//   } else {
//     markers[id] = L.marker([latitude, longitude]).addTo(map);
//   }

//   // Check Red Danger Zones
//   let inDanger = null;
//   redZones.forEach((zone) => {
//     if (zone.type === "circle") {
//       const dist = userLatLng.distanceTo(L.latLng(zone.center));
//       if (dist <= zone.radius) inDanger = zone.name;
//     } else if (zone.type === "polygon") {
//       if (isPointInPolygon([latitude, longitude], zone.coords)) inDanger = zone.name;
//     }
//   });

//   // Check Green Safe Zones
//   let inSafe = null;
//   greenZones.forEach((zone) => {
//     if (isPointInPolygon([latitude, longitude], zone.coords)) inSafe = zone.name;
//   });

//   // Update popup & sound
//   if (inDanger) {
//     popupDiv.innerHTML = `⚠️ Danger Zone: ${inDanger}`;
//     alertSound.play();
//   } else if (inSafe) {
//     popupDiv.innerHTML = `✅ Safe Zone: ${inSafe}`;
//   } else {
//     popupDiv.innerHTML = "You are in a normal area.";
//   }

//   // Distance to nearest danger zone
//   let nearestDistance = Infinity;
//   redZones.forEach((zone) => {
//     let d = Infinity;
//     if (zone.type === "circle") {
//       d = userLatLng.distanceTo(L.latLng(zone.center)) - zone.radius;
//     } else if (zone.type === "polygon") {
//       // approximate by distance to first point
//       d = userLatLng.distanceTo(L.latLng(zone.coords[0]));
//     }
//     if (d < nearestDistance) nearestDistance = d;
//   });
//   popupDiv.innerHTML += `<br>Distance to nearest danger zone: ${Math.max(0, Math.round(nearestDistance))} meters`;
// });

// // --- Cleanup disconnected users ---
// socket.on("user-disconnect", (id) => {
//   if (markers[id]) {
//     map.removeLayer(markers[id]);
//     delete markers[id];
//   }
// });
