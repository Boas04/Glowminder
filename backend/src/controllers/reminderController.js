const db = require("../config/db");
const { getCurrentWeather } = require("../services/weatherService");
const { requestReminder } = require("../services/aiService");

const VALID_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const CATEGORY_KEYWORDS = {
  "Weather Protector": ["sunscreen", "sunblock", "spf", "uv", "tabir surya"],
  Hydrator: [
    "moisturizer",
    "moisturiser",
    "hydrator",
    "pelembab",
    "cream",
    "lotion",
  ],
  "Sebum Controller": ["sebum", "oil", "oily", "anti minyak", "serum", "treatment"],
  "Daily Maintenance": [
    "sabun cuci muka",
    "facial wash",
    "cleanser",
    "toner",
    "basic",
    "daily",
  ],
};

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

const pickString = (value) => {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== "string") {
    return String(value);
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const parseDays = (value) => {
  if (!Array.isArray(value)) {
    return null;
  }

  const normalized = value.filter((day) => VALID_DAYS.includes(day));
  return normalized.length > 0 ? normalized : null;
};

const normalizeTime = (value) => {
  if (!value) {
    return null;
  }

  const match = String(value).match(/^(\d{2}):(\d{2})/);
  if (!match) {
    return null;
  }

  return `${match[1]}:${match[2]}:00`;
};

const normalizeText = (value) => String(value || "").toLowerCase();

const pickCategoryIds = (categories, labels) => {
  if (!Array.isArray(labels) || labels.length === 0) {
    return [];
  }

  const normalizedCategories = categories.map((cat) => ({
    ...cat,
    nameLower: normalizeText(cat.name),
  }));

  for (const label of labels) {
    const keywords = CATEGORY_KEYWORDS[label] || [normalizeText(label)];
    const matches = normalizedCategories.filter((cat) =>
      keywords.some((keyword) => cat.nameLower.includes(keyword))
    );

    if (matches.length > 0) {
      return matches.map((cat) => cat.id);
    }
  }

  return [];
};

const fetchRecommendedProducts = async (labels) => {
  const [categories] = await db.query(
    "SELECT id, name FROM products_categories"
  );

  const matchedCategoryIds = pickCategoryIds(categories, labels);

  if (matchedCategoryIds.length > 0) {
    const placeholders = matchedCategoryIds.map(() => "?").join(", ");
    const [products] = await db.query(
      `SELECT p.id, p.name, p.usage_time, p.description, p.ingredients, p.category_id, p.brand_id, p.created_at, c.name AS category_name
       FROM products p
       LEFT JOIN products_categories c ON p.category_id = c.id
       WHERE p.category_id IN (${placeholders})
       ORDER BY p.id DESC
       LIMIT 3`,
      matchedCategoryIds
    );

    if (products.length > 0) {
      return products;
    }
  }

  const [fallbackProducts] = await db.query(
    `SELECT p.id, p.name, p.usage_time, p.description, p.ingredients, p.category_id, p.brand_id, p.created_at, c.name AS category_name
     FROM products p
     LEFT JOIN products_categories c ON p.category_id = c.id
     ORDER BY p.id DESC
     LIMIT 3`
  );

  return fallbackProducts;
};

const parseReminderRows = (rows) =>
  rows.map((row) => {
    let days = row.days;
    if (typeof days === "string") {
      try {
        days = JSON.parse(days);
      } catch {
        days = [];
      }
    }

    return {
      ...row,
      days,
      active: Boolean(row.active),
    };
  });

const getAllReminders = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, title, time, days, active, created_at FROM reminders ORDER BY id DESC"
    );

    return res.json({
      success: true,
      data: parseReminderRows(rows),
    });
  } catch (err) {
    console.error("Failed to fetch reminders:", err.message);
    return res.status(500).json({
      success: false,
      message: "failed to fetch reminders",
    });
  }
};

const createReminder = async (req, res) => {
  const { title, time, days } = req.body || {};

  const normalizedTitle = pickString(title);
  if (!normalizedTitle) {
    return res.status(400).json({
      success: false,
      message: "title is required",
    });
  }

  const normalizedTime = normalizeTime(time);
  if (!normalizedTime) {
    return res.status(400).json({
      success: false,
      message: "time must be in HH:MM format",
    });
  }

  const normalizedDays = parseDays(days);
  if (!normalizedDays) {
    return res.status(400).json({
      success: false,
      message: "days must contain at least one valid day",
    });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO reminders (title, time, days, active) VALUES (?, ?, ?, ?)",
      [normalizedTitle, normalizedTime, JSON.stringify(normalizedDays), 1]
    );

    const [rows] = await db.query(
      "SELECT id, title, time, days, active, created_at FROM reminders WHERE id = ?",
      [result.insertId]
    );

    return res.status(201).json({
      success: true,
      data: parseReminderRows(rows)[0],
    });
  } catch (err) {
    console.error("Failed to create reminder:", err.message);
    return res.status(500).json({
      success: false,
      message: "failed to create reminder",
    });
  }
};

const toggleReminder = async (req, res) => {
  const id = parseIdParam(req, res);
  if (id === null) {
    return;
  }

  try {
    const [rows] = await db.query(
      "SELECT id, title, time, days, active, created_at FROM reminders WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "reminder not found",
      });
    }

    const current = rows[0];
    const nextActive = current.active ? 0 : 1;

    await db.query("UPDATE reminders SET active = ? WHERE id = ?", [
      nextActive,
      id,
    ]);

    const [updatedRows] = await db.query(
      "SELECT id, title, time, days, active, created_at FROM reminders WHERE id = ?",
      [id]
    );

    return res.json({
      success: true,
      data: parseReminderRows(updatedRows)[0],
    });
  } catch (err) {
    console.error("Failed to toggle reminder:", err.message);
    return res.status(500).json({
      success: false,
      message: "failed to toggle reminder",
    });
  }
};

const deleteReminder = async (req, res) => {
  const id = parseIdParam(req, res);
  if (id === null) {
    return;
  }

  try {
    const [rows] = await db.query(
      "SELECT id, title, time, days, active, created_at FROM reminders WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "reminder not found",
      });
    }

    await db.query("DELETE FROM reminders WHERE id = ?", [id]);

    return res.json({
      success: true,
      data: parseReminderRows(rows)[0],
    });
  } catch (err) {
    console.error("Failed to delete reminder:", err.message);
    return res.status(500).json({
      success: false,
      message: "failed to delete reminder",
    });
  }
};

const getPersonalizedReminder = async (req, res) => {
  try {
    const { lat, lon } = req.body || {};
    let humidity = null;
    let uvIndex = null;

    if (lat !== undefined && lon !== undefined) {
      const latitude = Number.parseFloat(lat);
      const longitude = Number.parseFloat(lon);

      if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
        return res.status(400).json({
          success: false,
          message: "lat and lon must be valid numbers",
        });
      }

      const weatherData = await getCurrentWeather(latitude, longitude);
      humidity = weatherData?.main?.humidity ?? null;
      uvIndex = null;
    }

    if (humidity === null || uvIndex === null) {
      const [weatherRows] = await db.query(
        "SELECT humidity, uv_index FROM weather_logs ORDER BY id DESC LIMIT 1"
      );
      if (weatherRows.length > 0) {
        humidity = humidity ?? weatherRows[0].humidity;
        uvIndex = uvIndex ?? weatherRows[0].uv_index;
      }
    }

    const finalHumidity = humidity ?? 70;
    const finalUvIndex = uvIndex ?? 5.0;

    const [productRows] = await db.query(
      "SELECT id, name, ingredients FROM products ORDER BY id DESC"
    );

    const ingredientsList = productRows
      .map((product) => product.ingredients || product.name?.toLowerCase())
      .filter(Boolean)
      .join(", ");

    if (!ingredientsList) {
      return res.status(400).json({
        success: false,
        message: "No products available for personalization",
      });
    }

    const aiResponse = await requestReminder({
      ingredients: ingredientsList,
      uv_index: finalUvIndex,
      humidity: finalHumidity,
    });

    const labels = aiResponse?.prediksi_fungsi_skincare || [];
    const products = await fetchRecommendedProducts(labels);
    const productNames = products.map((product) => product.name).filter(Boolean);

    const baseAdvice = Array.isArray(aiResponse?.rekomendasi_sistem)
      ? aiResponse.rekomendasi_sistem.join(" ")
      : "";

    const reminderText = productNames.length > 0
      ? `${baseAdvice} Gunakan produk berikut: ${productNames.join(", ")}.`
      : baseAdvice || "Gunakan skincare yang sesuai dengan kebutuhanmu hari ini.";

    return res.json({
      success: true,
      data: {
        reminder_text: reminderText.trim(),
        products,
        ai: aiResponse,
        weather: {
          humidity: finalHumidity,
          uv_index: finalUvIndex,
        },
      },
    });
  } catch (err) {
    console.error("Failed to build personalized reminder:", err.message);
    return res.status(500).json({
      success: false,
      message: "failed to build personalized reminder",
    });
  }
};

module.exports = {
  getAllReminders,
  createReminder,
  toggleReminder,
  deleteReminder,
  getPersonalizedReminder,
};
