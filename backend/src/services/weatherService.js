const axios = require("axios");

// Simple city database for common Indonesian locations
const cityDatabase = {
  "-6.25": { "106.78": "Tangerang" },
  "-8.67": { "115.21": "Denpasar" },
  "-6.90": { "107.61": "Bandung" },
  "-6.17": { "106.82": "Jakarta" },
  "-7.80": { "110.37": "Yogyakarta" },
  "-7.25": { "112.75": "Surabaya" },
};

const getCurrentWeather = async (lat, lon) => {
  // Try OpenWeatherMap API if key exists
  if (process.env.OPENWEATHER_API_KEY) {
    try {
      const response = await axios.get(
        "https://api.openweathermap.org/data/2.5/weather",
        {
          params: {
            lat,
            lon,
            appid: process.env.OPENWEATHER_API_KEY,
            units: "metric",
          },
          timeout: 5000,
        }
      );
      return response.data;
    } catch (err) {
      console.error("[Weather] OpenWeatherMap API failed:", err.message);
      // Fall through to fallback
    }
  }

  // Fallback: Use OSM Nominatim reverse geocoding
  try {
    console.log("[Weather] Using OpenStreetMap Nominatim reverse geocoding");
    const geoRes = await axios.get("https://nominatim.openstreetmap.org/reverse", {
      params: { lat, lon, format: "json" },
      timeout: 5000,
      headers: { "User-Agent": "GlowMinder/1.0" },
    });

    // Return mock weather data with real location
    const address = geoRes.data.address;
    const locationName =
      address?.city || address?.town || address?.village || "Lokasi Unknown";

    return {
      name: locationName,
      coord: { lat, lon },
      main: {
        temp: 28, // default temp
        humidity: 70, // default humidity
      },
      weather: [{ main: "Partly Cloudy" }],
      wind: { speed: 3 },
    };
  } catch (geoErr) {
    console.error("[Weather] Nominatim reverse geocoding failed:", geoErr.message);

    // Ultimate fallback: Database lookup or generic name
    const latRounded = lat.toFixed(2);
    const lonRounded = lon.toFixed(2);
    const knownCity = cityDatabase[latRounded]?.[lonRounded];

    return {
      name: knownCity || `Lokasi (${lat.toFixed(2)}, ${lon.toFixed(2)})`,
      coord: { lat, lon },
      main: { temp: 28, humidity: 70 },
      weather: [{ main: "Partly Cloudy" }],
      wind: { speed: 3 },
    };
  }
};

module.exports = {
  getCurrentWeather,
};
