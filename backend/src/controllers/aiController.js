const { requestReminder } = require("../services/aiService");

const getReminderHandler = async (req, res) => {
  try {
    const { ingredients, uv_index, humidity } = req.body || {};

    if (!ingredients || uv_index === undefined || humidity === undefined) {
      return res.status(400).json({
        success: false,
        message: "ingredients, uv_index, and humidity are required",
      });
    }

    const uvIndexNum = Number.parseFloat(uv_index);
    const humidityNum = Number.parseFloat(humidity);

    if (Number.isNaN(uvIndexNum) || Number.isNaN(humidityNum)) {
      return res.status(400).json({
        success: false,
        message: "uv_index and humidity must be valid numbers",
      });
    }

    const aiResponse = await requestReminder({
      ingredients,
      uv_index: uvIndexNum,
      humidity: humidityNum,
    });

    return res.json({
      success: true,
      data: aiResponse,
    });
  } catch (err) {
    console.error("AI request failed", {
      message: err.message,
      status: err.response?.status,
      data: err.response?.data,
    });

    return res.status(502).json({
      success: false,
      message: "Failed to reach AI service",
      details: err.response?.data || err.message,
    });
  }
};

module.exports = {
  getReminderHandler,
};
