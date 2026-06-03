const axios = require("axios");

const DEFAULT_AI_BASE_URL = "https://boas04-glowminder.hf.space";
const AI_BASE_URL = process.env.AI_ENGINE_URL || DEFAULT_AI_BASE_URL;
const REQUEST_TIMEOUT_MS =
  Number.parseInt(process.env.AI_TIMEOUT_MS, 10) || 60000;

const buildReminderUrl = (baseUrl) => {
  if (baseUrl.endsWith("/get-reminder")) {
    return baseUrl;
  }

  return `${baseUrl.replace(/\/$/, "")}/get-reminder`;
};

const shouldRetry = (error) => {
  if (!error || !error.response) {
    return true;
  }

  return error.response.status >= 500;
};

const delay = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const requestReminder = async (payload) => {
  const url = buildReminderUrl(AI_BASE_URL);

  try {
    const response = await axios.post(url, payload, {
      timeout: REQUEST_TIMEOUT_MS,
    });

    return response.data;
  } catch (error) {
    if (!shouldRetry(error)) {
      throw error;
    }

    await delay(1500);

    const response = await axios.post(url, payload, {
      timeout: REQUEST_TIMEOUT_MS,
    });

    return response.data;
  }
};

module.exports = {
  requestReminder,
};
