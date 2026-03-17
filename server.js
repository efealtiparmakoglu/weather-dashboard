const express = require('express');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.OPENWEATHER_API_KEY || 'demo_key';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Get current weather
app.get('/api/weather/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const response = await axios.get(`${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric&lang=tr`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Weather data not found' });
  }
});

// Get 5-day forecast
app.get('/api/forecast/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const response = await axios.get(`${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=tr`);
    
    // Group by day
    const daily = {};
    response.data.list.forEach(item => {
      const date = item.dt_txt.split(' ')[0];
      if (!daily[date]) daily[date] = item;
    });
    
    res.json(Object.values(daily).slice(0, 7));
  } catch (error) {
    res.status(500).json({ error: 'Forecast data not found' });
  }
});

// Get weather by coordinates
app.get('/api/weather/coords', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    const response = await axios.get(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=tr`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Weather data not found' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🌤️ Weather API running on port ${PORT}`));
