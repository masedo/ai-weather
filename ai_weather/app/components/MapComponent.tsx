import React, { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';

interface Coordinates {
  lat: number;
  lng: number;
}

interface MapComponentProps {
  onCoordinatesChange: (coords: Coordinates) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ onCoordinatesChange }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);

    const initializeMap = (coords: Coordinates) => {
      const L = require('leaflet');
      if (mapRef.current) {
        const map = L.map(mapRef.current).setView([coords.lat, coords.lng], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);

        const customIcon = L.icon({
          iconUrl: 'images/marker-icon.png',
          iconRetinaUrl: 'images/marker-icon-2x.png',
          shadowUrl: 'images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });

        const marker = L.marker([coords.lat, coords.lng], {
          draggable: true,
          icon: customIcon,
        }).addTo(map);

        marker.on('dragend', function () {
          const position = marker.getLatLng();
          onCoordinatesChange({ lat: position.lat, lng: position.lng });
        });

        map.on('click', function (e) {
          marker.setLatLng(e.latlng);
          onCoordinatesChange({ lat: e.latlng.lat, lng: e.latlng.lng });
        });
      }
    };

    //We try to get the location from the client, if not accepted, we use a default one
    if (isClient && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          const userCoordinates = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          onCoordinatesChange(userCoordinates);
          initializeMap(userCoordinates);
        },
        function () {
          const defaultCoords = { lat: 51.505, lng: -0.09 };
          onCoordinatesChange(defaultCoords);
          initializeMap(defaultCoords);
        }
      );
    }
  }, [isClient, onCoordinatesChange]);

  return (
    <div >
      <h2 className="px-3 text-2xl font-bold mb-4 text-violet-500">Select a location for AI-driven weather insights</h2>
      <div className="max-w-full overflow-hidden rounded-lg">
        <div id="map" ref={mapRef} className="h-96 w-full"></div>
      </div>
    </div>
  );
};

export default MapComponent;
