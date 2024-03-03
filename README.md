# AI Weather Chat

The current LLM models are trained on historical data, making it challenging to gain insights about current data.

This project demonstrates how to use an LLM with real-time data. Users can select a location, then the weather forecast data is retrieved (from open-meteo.com in this case), and combined with the user's specific question, it provides AI-driven insights from the LLM model.


This project is a web application where you can ask questions about the daily weather forecast for the coming 14 days for the selected location. It defaults to using the browser's location.

The project is divided into two parts: the frontend and the backend.

For the frontend, the following tech stack is used:

* TypeScript
* React
* Remix.run
* Tailwind CSS
* Leaflet libraries (for the map view)

For the backend:

* Python
* Flask
* OpenAI libraries


## Important files

* ai_weather/app/routes/_index.tsx

  * Defines the main frontend page.
* ai_weather/app/root.tsx

  * Defines the common part of all frontend pages.
* ai_weather/app/components/MapComponent.tsx

  * Manages the map, selects the browser location by default, and retrieves the coordinates when a location is selected.
* ai_weather/app/components/WeatherComponent.tsx

  * Retrieves the weather forecast for the selected location for the next 14 days, sends the user question along with the weather data to the backend, and displays the result.


* ai_weather_backend/main.py

  * Backend API logic to obtain the LLM response based on the specific user question and the weather data.


## Run locally

#### Front end

```
cd ai_weather

npm install
npm run dev
```

#### Backend API

ENV variables defined in ai_weather_backend/.env 

* OPENAI_API_KEY
  * Add here your ChatGPT API key


```
cd ai_weather_backend
pip install -r requirements.txt

py .\main.py
```


#### Test

```
http://localhost:3000/
```



## Deployment on a VPS

* Install Node.js for the remix project
* Install python for the backend API
* Copy backend and frontend files
* Configure and start both applications to run as services
* Install and configure Nginx
* Install Let's Encrypt for SSL/TLS
