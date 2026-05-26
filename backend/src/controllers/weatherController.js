const db = require("../config/db");
const { getCurrentWeather } = require("../services/weatherService");

const parseIdParam = (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    res.status(400).json({
      success: false,
      message: "id must be a number",
    });
    return null;
  }

  return id;
};

const getWeatherLogs = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, temperature, humidity, uv_index, weather_condition, wind_speed, location_name, created_at FROM weather_logs ORDER BY id DESC"
    );

    return res.json({
      success: true,
      data: rows,
    });
  } catch (err) {
    console.error("Failed to fetch weather logs:", err.message);
    return res.status(500).json({
      success: false,
      message: "failed to fetch weather logs",
    });
  }
};

const getWeatherLogById = async (req, res) => {
  const id = parseIdParam(req, res);
  if (id === null) {
    return;
  }

  try {
    const [rows] = await db.query(
      "SELECT id, temperature, humidity, uv_index, weather_condition, wind_speed, location_name, created_at FROM weather_logs WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "weather log not found",
      });
    }

    return res.json({
      success: true,
      data: rows[0],
    });
  } catch (err) {
    console.error("Failed to fetch weather log:", err.message);
    return res.status(500).json({
      success: false,
      message: "failed to fetch weather log",
    });
  }
};

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

    const [result] = await db.query(
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

    const [rows] = await db.query(
      "SELECT id, temperature, humidity, uv_index, weather_condition, wind_speed, location_name, created_at FROM weather_logs WHERE id = ?",
      [result.insertId]
    );

    return res.json({
      success: true,
      message: "Weather data fetched successfully",
      data: rows[0] || {
        temperature,
        humidity,
        uv_index: uvIndex,
        weather_condition: weatherCondition,
        wind_speed: windSpeed,
        location_name: locationName,
      },
    });
  } catch (err) {
    console.error("Failed to fetch weather data:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch weather data",
    });
  }
};

module.exports = {
  getCurrentWeatherHandler,
  getWeatherLogs,
  getWeatherLogById,
};
