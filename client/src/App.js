import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './App.css';

const weatherIcons = {
  '01d': '☀️', '01n': '🌙', '02d': '⛅', '02n': '☁️',
  '03d': '☁️', '03n': '☁️', '04d': '☁️', '04n': '☁️',
  '09d': '🌧️', '09n': '🌧️', '10d': '🌦️', '10n': '🌧️',
  '11d': '⛈️', '11n': '⛈️', '13d': '❄️', '13n': '❄️',
  '50d': '🌫️', '50n': '🌫️'
};

function App() {
  const [city, setCity] = useState('Istanbul');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const weatherRes = await fetch(`/api/weather/${city}`);
      const weatherData = await weatherRes.json();
      setWeather(weatherData);

      const forecastRes = await fetch(`/api/forecast/${city}`);
      const forecastData = await forecastRes.json();
      setForecast(forecastData.map(f => ({
        date: new Date(f.dt * 1000).toLocaleDateString('tr-TR', { weekday: 'short' }),
        temp: Math.round(f.main.temp),
        icon: f.weather[0].icon
      })));
    } catch (error) {
      console.error('Error fetching weather:', error);
    }
    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeather();
  };

  return (
    <div className="app">
      <div className="container">
        <h1>🌤️ Weather Dashboard</h1>
        
        <form onSubmit={handleSubmit} className="search-form">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Şehir ara..."
          />
          <button type="submit">Ara</button>
        </form>

        {loading ? (
          <div className="loading">Yükleniyor...</div>
        ) : weather ? (
          <>
            <div className="current-weather">
              <div className="main-info">
                <h2>{weather.name}, {weather.sys.country}</h2>
                <div className="weather-icon">
                  {weatherIcons[weather.weather[0].icon] || '🌡️'}
                </div>
                <div className="temperature">{Math.round(weather.main.temp)}°C</div>
                <p className="description">{weather.weather[0].description}</p>
              </div>
              
              <div className="details">
                <div className="detail-item">
                  <span>💧 Nem</span>
                  <strong>{weather.main.humidity}%</strong>
                </div>
                <div className="detail-item">
                  <span>💨 Rüzgar</span>
                  <strong>{weather.wind.speed} km/s</strong>
                </div>
                <div className="detail-item">
                  <span>🌡️ Hissedilen</span>
                  <strong>{Math.round(weather.main.feels_like)}°C</strong>
                </div>
                <div className="detail-item">
                  <span>👁️ Görüş</span>
                  <strong>{(weather.visibility / 1000).toFixed(1)} km</strong>
                </div>
              </div>
            </div>

            <div className="forecast">
              <h3>📅 7 Günlük Tahmin</h3>
              <div className="forecast-grid">
                {forecast.map((day, idx) => (
                  <div key={idx} className="forecast-day">
                    <span className="day">{day.date}</span>
                    <span className="icon">{weatherIcons[day.icon] || '🌡️'}</span>
                    <span className="temp">{day.temp}°C</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default App;
