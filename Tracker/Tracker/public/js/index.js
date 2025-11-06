const socket = io();

// Footer elements
const locationSpan = document.getElementById("user-location");
const medicalSpan = document.getElementById("nearest-medical");

// Map & marker
const map = L.map("map").setView([28.6692, 77.4538], 12);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

let userMarker = null;
let lastFetchLocation = null;
let clickMarker = null; // new marker for clicked location
let currentUserLocation = null; // save latest user location

// Reverse geocode function
async function getAddress(lat, lng) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      { headers: { "User-Agent": "TrackerApp/1.0" } }
    );
    const data = await response.json();
    return (
      data.address.road ||
      data.address.suburb ||
      data.address.city ||
      data.display_name ||
      `${lat}, ${lng}`
    );
  } catch {
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  }
}

// Distance function
function distanceInMeters(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Fetch nearest amenities (hospital & police) using Overpass API
async function getNearestFacilities(lat, lng) {
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="hospital"](around:5000,${lat},${lng});
      node["amenity"="police"](around:5000,${lat},${lng});
    );
    out body;
  `;

  try {
    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "data=" + encodeURIComponent(query),
    });

    const data = await response.json();
    return data.elements.map((el) => ({
      name: el.tags.name || el.tags["official_name"] || el.tags.amenity,
      type: el.tags.amenity,
      lat: el.lat,
      lng: el.lon,
      phone: el.tags.phone || "N/A",
    }));
  } catch (err) {
    console.error("Overpass fetch error:", err);
    return [];
  }
}

// Update footer
async function updateFooter(lat, lng) {
  const address = await getAddress(lat, lng);
  locationSpan.textContent = address;

  if (
    !lastFetchLocation ||
    distanceInMeters(lat, lng, lastFetchLocation.lat, lastFetchLocation.lng) > 500
  ) {
    lastFetchLocation = { lat, lng };

    const facilities = await getNearestFacilities(lat, lng);
    if (facilities.length === 0) {
      medicalSpan.textContent =
        "No nearby hospitals or police stations found.";
      return;
    }

    let nearestHospital = null,
      nearestPolice = null;
    let minHospitalDist = Infinity,
      minPoliceDist = Infinity;

    for (const f of facilities) {
      const d = distanceInMeters(lat, lng, f.lat, f.lng);
      if (f.type === "hospital" && d < minHospitalDist) {
        nearestHospital = f;
        minHospitalDist = d;
      }
      if (f.type === "police" && d < minPoliceDist) {
        nearestPolice = f;
        minPoliceDist = d;
      }
    }

    let msg = "";
    if (nearestHospital) {
      msg += `🏥 ${nearestHospital.name} (📞 ${nearestHospital.phone}, ${Math.round(
        minHospitalDist
      )} m away)<br>`;
    }
    if (nearestPolice) {
      msg += `👮 ${nearestPolice.name} (📞 ${nearestPolice.phone}, ${Math.round(
        minPoliceDist
      )} m away)`;
    }

    medicalSpan.innerHTML =
      msg || "No nearby hospital or police station found.";
  }
}

// Receive location from socket
socket.on("receive-location", async (data) => {
  const { latitude, longitude } = data;
  currentUserLocation = { latitude, longitude };

  // Add or move marker
  if (!userMarker) {
    userMarker = L.marker([latitude, longitude], { title: "You" }).addTo(map);
  } else {
    userMarker.setLatLng([latitude, longitude]);
  }

  // Center map on user
  map.setView([latitude, longitude], 16);

  // Update footer
  updateFooter(latitude, longitude);
});

// --- NEW FEATURE: Click anywhere to drop a marker & show distance ---
map.on("click", function (e) {
  const { lat, lng } = e.latlng;

  // If marker already exists, move it; otherwise create
  if (clickMarker) {
    clickMarker.setLatLng([lat, lng]);
  } else {
    clickMarker = L.marker([lat, lng], {
      draggable: true,
      title: "Target Point",
    }).addTo(map);
  }

  // Calculate distance if user location is known
  if (currentUserLocation) {
    const dist = distanceInMeters(
      currentUserLocation.latitude,
      currentUserLocation.longitude,
      lat,
      lng
    );
    clickMarker.bindPopup(
      `📍 Target Point<br>Distance from you: ${Math.round(dist)} meters`
    ).openPopup();
  } else {
    clickMarker.bindPopup("📍 Target Point (user location unknown)").openPopup();
  }
});
