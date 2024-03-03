import React, { useState } from 'react';
import MapComponent from '../components/MapComponent'; 
import WeatherComponent from '../components/WeatherComponent'; 


//Main page component, using MapComponent to show the map, and WeatherComponent to retrieve weather data and asking ChatGPT the questions
const ParentComponent: React.FC = () => {
  const [selectedCoordinates, setSelectedCoordinates] = useState<{lat: number, lng: number} | null>(null);

  return (
    <div className="bg-gray-700 rounded-lg p-4">
      <MapComponent onCoordinatesChange={setSelectedCoordinates} />
      {selectedCoordinates && <WeatherComponent coordinates={selectedCoordinates} />}
    </div>
  );
};

export default ParentComponent;
