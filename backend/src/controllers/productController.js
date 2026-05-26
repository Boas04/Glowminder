const db = require("../config/db");

const USAGE_TIME_VALUES = ["morning", "night", "special_treatment"];

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

const normalizeUsageTime = (value) => {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  if (!USAGE_TIME_VALUES.includes(value)) {
    return { error: "usage_time is invalid" };
  }

  return value;
};

const normalizeForeignKey = (value, fieldName) => {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const numericValue = Number.parseInt(value, 10);
  if (Number.isNaN(numericValue) || numericValue <= 0) {
    return { error: `${fieldName} must be a positive number` };
  }

  return numericValue;
};

const getAllProducts = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, name, usage_time, description, ingredients, category_id, brand_id, created_at FROM products ORDER BY id DESC"
    );

    return res.json({
      success: true,
      data: rows,
    });
  } catch (err) {
    console.error("Failed to fetch products:", err.message);
    return res.status(500).json({
      success: false,
      message: "failed to fetch products",
    });
  }
};

const createProduct = async (req, res) => {
  const { name, usage_time, description, ingredients, category_id, brand_id } =
    req.body || {};

  const normalizedName = pickString(name);
  if (!normalizedName) {
    return res.status(400).json({
      success: false,
      message: "name is required",
    });
  }

  const normalizedUsageTime = normalizeUsageTime(usage_time);
  if (normalizedUsageTime && normalizedUsageTime.error) {
    return res.status(400).json({
      success: false,
      message: normalizedUsageTime.error,
    });
  }

  const normalizedIngredients = pickString(ingredients);
  if (!normalizedIngredients) {
    return res.status(400).json({
      success: false,
      message: "ingredients are required",
    });
  }

  const normalizedCategoryId = normalizeForeignKey(category_id, "category_id");
  if (normalizedCategoryId && normalizedCategoryId.error) {
    return res.status(400).json({
      success: false,
      message: normalizedCategoryId.error,
    });
  }

  const normalizedBrandId = normalizeForeignKey(brand_id, "brand_id");
  if (normalizedBrandId && normalizedBrandId.error) {
    return res.status(400).json({
      success: false,
      message: normalizedBrandId.error,
    });
  }

  const payload = {
    name: normalizedName,
    usage_time: normalizedUsageTime || "morning",
    description: pickString(description),
    ingredients: normalizedIngredients,
    category_id: normalizedCategoryId || null,
    brand_id: normalizedBrandId || null,
  };

  try {
    const [result] = await db.query(
      "INSERT INTO products (name, usage_time, description, ingredients, category_id, brand_id) VALUES (?, ?, ?, ?, ?, ?)",
      [
        payload.name,
        payload.usage_time,
        payload.description,
        payload.ingredients,
        payload.category_id,
        payload.brand_id,
      ]
    );

    const [rows] = await db.query(
      "SELECT id, name, usage_time, description, ingredients, category_id, brand_id, created_at FROM products WHERE id = ?",
      [result.insertId]
    );

    return res.status(201).json({
      success: true,
      data: rows[0],
    });
  } catch (err) {
    console.error("Failed to create product:", err.message);
    return res.status(500).json({
      success: false,
      message: "failed to create product",
    });
  }
};

const getProductById = async (req, res) => {
  const id = parseIdParam(req, res);
  if (id === null) {
    return;
  }

  try {
    const [rows] = await db.query(
      "SELECT id, name, usage_time, description, ingredients, category_id, brand_id, created_at FROM products WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "product not found",
      });
    }

    return res.json({
      success: true,
      data: rows[0],
    });
  } catch (err) {
    console.error("Failed to fetch product:", err.message);
    return res.status(500).json({
      success: false,
      message: "failed to fetch product",
    });
  }
};

const updateProduct = async (req, res) => {
  const id = parseIdParam(req, res);
  if (id === null) {
    return;
  }

  const { name, usage_time, description, ingredients, category_id, brand_id } =
    req.body || {};

  const updates = {};

  if (name !== undefined) {
    const normalizedName = pickString(name);
    if (!normalizedName) {
      return res.status(400).json({
        success: false,
        message: "name cannot be empty",
      });
    }
    updates.name = normalizedName;
  }

  if (ingredients !== undefined) {
    const normalizedIngredients = pickString(ingredients);
    if (!normalizedIngredients) {
      return res.status(400).json({
        success: false,
        message: "ingredients cannot be empty",
      });
    }
    updates.ingredients = normalizedIngredients;
  }

  if (usage_time !== undefined) {
    const normalizedUsageTime = normalizeUsageTime(usage_time);
    if (normalizedUsageTime && normalizedUsageTime.error) {
      return res.status(400).json({
        success: false,
        message: normalizedUsageTime.error,
      });
    }
    updates.usage_time = normalizedUsageTime || "morning";
  }

  if (description !== undefined) {
    updates.description = pickString(description);
  }

  if (category_id !== undefined) {
    const normalizedCategoryId = normalizeForeignKey(category_id, "category_id");
    if (normalizedCategoryId && normalizedCategoryId.error) {
      return res.status(400).json({
        success: false,
        message: normalizedCategoryId.error,
      });
    }
    updates.category_id = normalizedCategoryId || null;
  }

  if (brand_id !== undefined) {
    const normalizedBrandId = normalizeForeignKey(brand_id, "brand_id");
    if (normalizedBrandId && normalizedBrandId.error) {
      return res.status(400).json({
        success: false,
        message: normalizedBrandId.error,
      });
    }
    updates.brand_id = normalizedBrandId || null;
  }

  const updateKeys = Object.keys(updates);
  if (updateKeys.length === 0) {
    return res.status(400).json({
      success: false,
      message: "no fields to update",
    });
  }

  const setClause = updateKeys.map((key) => `${key} = ?`).join(", ");
  const values = updateKeys.map((key) => updates[key]);

  try {
    const [result] = await db.query(
      `UPDATE products SET ${setClause} WHERE id = ?`,
      [...values, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "product not found",
      });
    }

    const [rows] = await db.query(
      "SELECT id, name, usage_time, description, ingredients, category_id, brand_id, created_at FROM products WHERE id = ?",
      [id]
    );

    return res.json({
      success: true,
      data: rows[0],
    });
  } catch (err) {
    console.error("Failed to update product:", err.message);
    return res.status(500).json({
      success: false,
      message: "failed to update product",
    });
  }
};

const deleteProduct = async (req, res) => {
  const id = parseIdParam(req, res);
  if (id === null) {
    return;
  }

  try {
    const [rows] = await db.query(
      "SELECT id, name, usage_time, description, ingredients, category_id, brand_id, created_at FROM products WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "product not found",
      });
    }

    await db.query("DELETE FROM products WHERE id = ?", [id]);

    return res.json({
      success: true,
      data: rows[0],
    });
  } catch (err) {
    console.error("Failed to delete product:", err.message);
    return res.status(500).json({
      success: false,
      message: "failed to delete product",
    });
  }
};

module.exports = {
  getAllProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
};
