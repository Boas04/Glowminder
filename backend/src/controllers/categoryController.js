const db = require("../config/db");

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

const getAllCategories = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, name FROM products_categories ORDER BY id DESC"
    );

    return res.json({
      success: true,
      data: rows,
    });
  } catch (err) {
    console.error("Failed to fetch categories:", err.message);
    return res.status(500).json({
      success: false,
      message: "failed to fetch categories",
    });
  }
};

const createCategory = async (req, res) => {
  const { name } = req.body || {};

  const normalizedName = pickString(name);
  if (!normalizedName) {
    return res.status(400).json({
      success: false,
      message: "name is required",
    });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO products_categories (name) VALUES (?)",
      [normalizedName]
    );

    const [rows] = await db.query(
      "SELECT id, name FROM products_categories WHERE id = ?",
      [result.insertId]
    );

    return res.status(201).json({
      success: true,
      data: rows[0],
    });
  } catch (err) {
    console.error("Failed to create category:", err.message);
    return res.status(500).json({
      success: false,
      message: "failed to create category",
    });
  }
};

const getCategoryById = async (req, res) => {
  const id = parseIdParam(req, res);
  if (id === null) {
    return;
  }

  try {
    const [rows] = await db.query(
      "SELECT id, name FROM products_categories WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "category not found",
      });
    }

    return res.json({
      success: true,
      data: rows[0],
    });
  } catch (err) {
    console.error("Failed to fetch category:", err.message);
    return res.status(500).json({
      success: false,
      message: "failed to fetch category",
    });
  }
};

const updateCategory = async (req, res) => {
  const id = parseIdParam(req, res);
  if (id === null) {
    return;
  }

  const { name } = req.body || {};
  const normalizedName = pickString(name);
  if (!normalizedName) {
    return res.status(400).json({
      success: false,
      message: "name is required",
    });
  }

  try {
    const [result] = await db.query(
      "UPDATE products_categories SET name = ? WHERE id = ?",
      [normalizedName, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "category not found",
      });
    }

    const [rows] = await db.query(
      "SELECT id, name FROM products_categories WHERE id = ?",
      [id]
    );

    return res.json({
      success: true,
      data: rows[0],
    });
  } catch (err) {
    console.error("Failed to update category:", err.message);
    return res.status(500).json({
      success: false,
      message: "failed to update category",
    });
  }
};

const deleteCategory = async (req, res) => {
  const id = parseIdParam(req, res);
  if (id === null) {
    return;
  }

  try {
    const [rows] = await db.query(
      "SELECT id, name FROM products_categories WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "category not found",
      });
    }

    await db.query("DELETE FROM products_categories WHERE id = ?", [id]);

    return res.json({
      success: true,
      data: rows[0],
    });
  } catch (err) {
    console.error("Failed to delete category:", err.message);
    return res.status(500).json({
      success: false,
      message: "failed to delete category",
    });
  }
};

module.exports = {
  getAllCategories,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
