const db = require("../config/db");
const { getCurrentWeather } = require("../services/weatherService");

const getCurrentWeatherHandler = async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (lat === undefined || lon === undefined) {
      return res.status(400).json({
        success: false,
        message: "lat and lon are required",
      });
    }

    const latitude = Number.parseFloat(lat);
    const longitude = Number.parseFloat(lon);

    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
      return res.status(400).json({
        success: false,
        message: "lat and lon must be valid numbers",
      });
    }

    const weatherData = await getCurrentWeather(latitude, longitude);

    const temperature = weatherData?.main?.temp ?? null;
    const humidity = weatherData?.main?.humidity ?? null;
    const weatherCondition = weatherData?.weather?.[0]?.main ?? null;
    const windSpeed = weatherData?.wind?.speed ?? null;
    const locationName = weatherData?.name ?? null;
    const uvIndex = null;

    if (temperature === null || humidity === null) {
      return res.status(502).json({
        success: false,
        message: "Weather data is incomplete",
      });
    }

    await db.execute(
      "INSERT INTO weather_logs (temperature, humidity, uv_index, weather_condition, wind_speed, location_name) VALUES (?, ?, ?, ?, ?, ?)",
      [
        temperature,
        humidity,
        uvIndex,
        weatherCondition,
        windSpeed,
        locationName,
      ]
    );

    return res.json({
      success: true,
      message: "Weather data fetched successfully",
      data: {
        temperature,
        humidity,
        uv_index: uvIndex,
        weather_condition: weatherCondition,
        wind_speed: windSpeed,
        location_name: locationName,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch weather data",
    });
  }
};

module.exports = {
  getCurrentWeatherHandler,
};
