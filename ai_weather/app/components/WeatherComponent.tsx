import React, { useEffect, useState } from 'react';
import { fetchWeatherApi } from 'openmeteo';

interface Coordinates {
  lat: number;
  lng: number;
}

interface WeatherComponentProps {
  coordinates: Coordinates;
}

const WeatherComponent: React.FC<WeatherComponentProps> = ({ coordinates }) => {
  const [dailyWeatherData, setDailyWeatherData] = useState<any>(null);

  const [question, setQuestion] = useState<string>('');
  const [chatGptResponse, setChatGptResponse] = useState<string>('');

  //We get daily weather forecast data from open-meteo
  useEffect(() => {
    const fetchData = async () => {
      const params = {
        "latitude": coordinates.lat,
        "longitude": coordinates.lng,
        "daily": ["temperature_2m_max", "temperature_2m_min", "apparent_temperature_max", "apparent_temperature_min", "daylight_duration", "sunshine_duration", "uv_index_max", "uv_index_clear_sky_max", "precipitation_sum", "rain_sum", "showers_sum", "snowfall_sum", "precipitation_hours", "precipitation_probability_max", "wind_speed_10m_max", "wind_gusts_10m_max", "wind_direction_10m_dominant", "shortwave_radiation_sum", "et0_fao_evapotranspiration"],
	    "timezone": "auto",
        "forecast_days": 14
      };
      const url = "https://api.open-meteo.com/v1/forecast";
      
      try {
        const responses = await fetchWeatherApi(url, params);
        const response = responses[0];

        const utcOffsetSeconds = response.utcOffsetSeconds();
        const daily = response.daily()!;

        const weatherData = {

            daily: {
                time: range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map(
                    (t) => new Date((t + utcOffsetSeconds) * 1000)
                ),
                temperature2mMax: daily.variables(0)!.valuesArray()!,
                temperature2mMin: daily.variables(1)!.valuesArray()!,
                apparentTemperatureMax: daily.variables(2)!.valuesArray()!,
                apparentTemperatureMin: daily.variables(3)!.valuesArray()!,
                daylightDuration: daily.variables(4)!.valuesArray()!,
                sunshineDuration: daily.variables(5)!.valuesArray()!,
                uvIndexMax: daily.variables(6)!.valuesArray()!,
                uvIndexClearSkyMax: daily.variables(7)!.valuesArray()!,
                precipitationSum: daily.variables(8)!.valuesArray()!,
                rainSum: daily.variables(9)!.valuesArray()!,
                showersSum: daily.variables(10)!.valuesArray()!,
                snowfallSum: daily.variables(11)!.valuesArray()!,
                precipitationHours: daily.variables(12)!.valuesArray()!,
                precipitationProbabilityMax: daily.variables(13)!.valuesArray()!,
                windSpeed10mMax: daily.variables(14)!.valuesArray()!,
                windGusts10mMax: daily.variables(15)!.valuesArray()!,
                windDirection10mDominant: daily.variables(16)!.valuesArray()!,
                shortwaveRadiationSum: daily.variables(17)!.valuesArray()!,
                et0FaoEvapotranspiration: daily.variables(18)!.valuesArray()!,
            },
        
        };


        const organizedData = {};
        const timestamps = weatherData.daily.time;

        //we sort the data by timestamp, so each value is under their respective timestamp  
        timestamps.forEach((timestamp, index) => {
            organizedData[timestamp] = {
                temperature2mMax: weatherData.daily.temperature2mMax[index],
                temperature2mMin: weatherData.daily.temperature2mMin[index],
                apparentTemperatureMax: weatherData.daily.apparentTemperatureMax[index],
                apparentTemperatureMin: weatherData.daily.apparentTemperatureMin[index],
                daylightDuration: weatherData.daily.daylightDuration[index],
                sunshineDuration: weatherData.daily.sunshineDuration[index],
                uvIndexMax: weatherData.daily.uvIndexMax[index],
                uvIndexClearSkyMax: weatherData.daily.uvIndexClearSkyMax[index],
                precipitationSum: weatherData.daily.precipitationSum[index],
                rainSum: weatherData.daily.rainSum[index],
                showersSum: weatherData.daily.showersSum[index],
                snowfallSum: weatherData.daily.snowfallSum[index],
                precipitationHours: weatherData.daily.precipitationHours[index],
                precipitationProbabilityMax: weatherData.daily.precipitationProbabilityMax[index],
                windSpeed10mMax: weatherData.daily.windSpeed10mMax[index],
                windGusts10mMax: weatherData.daily.windGusts10mMax[index],
                windDirection10mDominant: weatherData.daily.windDirection10mDominant[index],
                shortwaveRadiationSum: weatherData.daily.shortwaveRadiationSum[index],
                et0FaoEvapotranspiration: weatherData.daily.et0FaoEvapotranspiration[index],
            };
        });

        setDailyWeatherData(organizedData);
        console.info(organizedData)

      } catch (error) {
        console.error("Failed to fetch weather data:", error);
      }
    };

    fetchData();
  }, [coordinates]);

  //We call ChatGPT using our backend API
  const range = (start: number, stop: number, step: number) =>
    Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

    const handleQuestionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setQuestion(event.target.value);
      };

      const [isFetching, setIsFetching] = useState<boolean>(false);
    
      const submitQuestion = async () => {

        
        if (!question.trim()) return; 
        setIsFetching(true);
        try {
          const response = await fetch('http://localhost:5000/api/chatgpt-query', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            //we send to the backend API the user specific question and the weather data retrieved for the selected location
            body: JSON.stringify({
              question,
              weatherData: dailyWeatherData,
            }),
          });
    
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
    
          const data = await response.json();
          setChatGptResponse(data.response);
          console.info(data.response)
        } catch (error) {
          console.error("Failed to fetch ChatGPT response:", error);
          setChatGptResponse('Failed to fetch response, please try again.');
        }
        setIsFetching(false);
      };
    
      return (
        <div className="flex flex-col space-y-4 mt-4">
          {dailyWeatherData ? (
            <>              
              <textarea
                className="w-full h-24 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-gray-700"
                value={question}
                onChange={handleQuestionChange}
                placeholder="Ask a weather-specific question, e.g., 'What's the temperature today?', 'Will it rain tomorrow?', or 'Do I need an umbrella the day after tomorrow?'"
                disabled={isFetching}
              ></textarea>
              <button 
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                onClick={submitQuestion}
                disabled={isFetching}
              >
                {isFetching ? 'Please wait...' : 'Ask ChatGPT'}
              </button>
              {chatGptResponse && (
                <div className="mt-4 p-4 border border-gray-200 rounded-md">
                  <h3 className="text-lg font-semibold">ChatGPT Response</h3>
                  <p className="mt-2">{chatGptResponse}</p>
                </div>
              )}
            </>
          ) : (
            <p className="text-center">Loading daily weather data...</p>
          )}
        </div>
      );
      
      
    };
    
    export default WeatherComponent;
