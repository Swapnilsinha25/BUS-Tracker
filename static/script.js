let map = L.map("map").setView([28.6139, 77.209], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

let busIcon = L.icon({
  iconUrl: "/static/bus.png",
  iconSize: [40, 40],
});

let busMarker = L.marker([28.6139, 77.209], { icon: busIcon }).addTo(map);

let destMarker = null;
let routeLine = null;

let lastLat = null;
let lastLng = null;
let lastTime = null;

function useMyLocation() {
  navigator.geolocation.getCurrentPosition(function (pos) {
    let lat = pos.coords.latitude;
    let lng = pos.coords.longitude;

    if (destMarker) map.removeLayer(destMarker);

    destMarker = L.marker([lat, lng]).addTo(map);
  });
}

function getDistance(lat1, lon1, lat2, lon2) {
  let R = 6371;

  let dLat = ((lat2 - lat1) * Math.PI) / 180;
  let dLon = ((lon2 - lon1) * Math.PI) / 180;

  let a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function updateLocation() {
  fetch("/get_location")
    .then((res) => res.json())
    .then((data) => {
      let lat = data.lat;
      let lng = data.lng;

      busMarker.setLatLng([lat, lng]);

      map.setView([lat, lng]);

      let now = Date.now();

      if (now - data.timestamp * 1000 < 10000) {
        document.getElementById("status").innerHTML = "LIVE";
        document.getElementById("status").className = "status-live";
      } else {
        document.getElementById("status").innerHTML = "OFFLINE";
        document.getElementById("status").className = "status-offline";
      }

      if (lastLat) {
        let dist = getDistance(lastLat, lastLng, lat, lng);
        let timeDiff = (now - lastTime) / 1000 / 3600;

        let speed = dist / timeDiff;

        document.getElementById("speed").innerHTML = speed.toFixed(1) + " km/h";
      }

      lastLat = lat;
      lastLng = lng;
      lastTime = now;

      if (destMarker) {
        let dest = destMarker.getLatLng();

        if (routeLine) map.removeLayer(routeLine);

        routeLine = L.polyline(
          [
            [lat, lng],
            [dest.lat, dest.lng],
          ],
          { color: "cyan" },
        ).addTo(map);

        let dist = getDistance(lat, lng, dest.lat, dest.lng);

        let eta = (dist / 30) * 60;

        document.getElementById("eta").innerHTML = eta.toFixed(1) + " min";
      }
    });
}

setInterval(updateLocation, 2000);

function toggleMode() {
  document.body.classList.toggle("light-mode");
}
