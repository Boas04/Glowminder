const db = require("../config/db");
const { requestReminder } = require("../services/aiService");

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

const fetchRecommendedProduct = async (labels) => {
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
       LIMIT 1`,
      matchedCategoryIds
    );

    if (products.length > 0) {
      return products[0];
    }
  }

  const [fallbackProducts] = await db.query(
    `SELECT p.id, p.name, p.usage_time, p.description, p.ingredients, p.category_id, p.brand_id, p.created_at, c.name AS category_name
     FROM products p
     LEFT JOIN products_categories c ON p.category_id = c.id
     ORDER BY p.id DESC
     LIMIT 1`
  );

  return fallbackProducts[0] || null;
};

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

    const labels = aiResponse?.prediksi_fungsi_skincare || [];
    const recommendedProduct = await fetchRecommendedProduct(labels);

    return res.json({
      success: true,
      data: {
        ...aiResponse,
        recommended_product: recommendedProduct,
      },
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
