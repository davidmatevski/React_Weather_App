import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [weather, setWeather] = useState(null);
  const [input, setInput] = useState("");
  const [forecast, setForecast] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  async function fetchWeather(e) {
    e.preventDefault();
    setErrorMessage("");
    try {
      const response = await axios.get(
        `http://api.openweathermap.org/data/2.5/weather?q=${input}&appid=${"c87985b002bcb6c05ba5a63b75e6b421"}&units=metric`
      );
      setWeather(response.data);

      const forecastResponse = await axios.get(
        `http://api.openweathermap.org/data/2.5/forecast?q=${input}&appid=${"c87985b002bcb6c05ba5a63b75e6b421"}&units=metric`
      );
      setForecast(forecastResponse.data.list);
      setInput("");
    } catch (error) {
      setErrorMessage("Unable to find city. Please check your input.");
    }
  }

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${
    today.getMonth() + 1
  }-${today.getDate()}`;

  return (
    <div className="App">
      <div className="container">
        <div className="row justify-content-center">
          <h1>Weather App</h1>
          <form className="col-12 col-md-6" onSubmit={fetchWeather}>
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Enter city name"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button className="btn btn-primary" type="submit">
                Search
              </button>
            </div>
          </form>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
        {weather && (
          <div className="row justify-content-center text-center weather-data">
            <div className="col-12 col-md-6">
              <h2>{weather.name}</h2>
              <h3>Now</h3>
              <div className="weather-details">
                <h2>{Math.round(weather.main.temp)}°C</h2>
                <img
                  src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                  alt={weather.weather[0].description}
                />
              </div>
            </div>
          </div>
        )}
        <div className="row justify-content-center text-center">
          {forecast &&
            forecast
              .filter((data) => {
                const forecastDate = new Date(data.dt * 1000);
                const forecastDateStr = `${forecastDate.getFullYear()}-${
                  forecastDate.getMonth() + 1
                }-${forecastDate.getDate()}`;
                return forecastDateStr === todayStr;
              })
              .map((forecastData, index) => {
                const date = new Date(forecastData.dt * 1000);
                let hours = date.getHours();
                let period = hours >= 12 ? "PM" : "AM";

                hours = hours % 12;
                hours = hours ? hours : 12; // the hour '0' should be '12'

                return (
                  <div key={index} className="forecast-data">
                    <h3>{`${hours}${period}`}</h3>
                    <div className="forecast-time-temp">
                      <h2>{Math.round(forecastData.main.temp)}°C</h2>
                      <img
                        className="forecast-icon"
                        src={`http://openweathermap.org/img/wn/${forecastData.weather[0].icon}.png`}
                        alt={forecastData.weather[0].description}
                      />
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
    </div>
  );
}

export default App;
