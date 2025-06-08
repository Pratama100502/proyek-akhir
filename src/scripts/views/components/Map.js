import L from 'leaflet';
import 'leaflet/dist/leaflet.css';


let currentMarker = null;


const redIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const Map = {
  init() {
    const map = L.map('map').setView([-2.5489, 118.0149], 5);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

   
    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      const latInput = document.getElementById('latitude');
      const lonInput = document.getElementById('longitude');

      if (latInput && lonInput) {
        latInput.value = lat;
        lonInput.value = lng;
      }

      if (currentMarker) {
        map.removeLayer(currentMarker);
      }

      currentMarker = L.marker([lat, lng], { icon: redIcon }).addTo(map)
        .bindPopup(`Lat: ${lat}, Lon: ${lng}`)
        .openPopup();
    });
  }
};


export default Map;
