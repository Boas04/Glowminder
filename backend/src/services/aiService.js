const axios = require("axios");

const AI_BASE_URL =
  process.env.AI_ENGINE_URL || "http://localhost:8000";

const requestReminder = async (payload) => {
  const response = await axios.post(`${AI_BASE_URL}/get-reminder`, payload, {
    timeout: 15000,
  });

  return response.data;
};

module.exports = {
  requestReminder,
};
