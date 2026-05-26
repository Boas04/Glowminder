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

const getAllBrands = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, name, country FROM brands ORDER BY id DESC"
    );

    return res.json({
      success: true,
      data: rows,
    });
  } catch (err) {
    console.error("Failed to fetch brands:", err.message);
    return res.status(500).json({
      success: false,
      message: "failed to fetch brands",
    });
  }
};

const createBrand = async (req, res) => {
  const { name, country } = req.body || {};

  const normalizedName = pickString(name);
  if (!normalizedName) {
    return res.status(400).json({
      success: false,
      message: "name is required",
    });
  }

  const normalizedCountry = pickString(country);
  if (!normalizedCountry) {
    return res.status(400).json({
      success: false,
      message: "country is required",
    });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO brands (name, country) VALUES (?, ?)",
      [normalizedName, normalizedCountry]
    );

    const [rows] = await db.query(
      "SELECT id, name, country FROM brands WHERE id = ?",
      [result.insertId]
    );

    return res.status(201).json({
      success: true,
      data: rows[0],
    });
  } catch (err) {
    console.error("Failed to create brand:", err.message);
    return res.status(500).json({
      success: false,
      message: "failed to create brand",
    });
  }
};

const getBrandById = async (req, res) => {
  const id = parseIdParam(req, res);
  if (id === null) {
    return;
  }

  try {
    const [rows] = await db.query(
      "SELECT id, name, country FROM brands WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "brand not found",
      });
    }

    return res.json({
      success: true,
      data: rows[0],
    });
  } catch (err) {
    console.error("Failed to fetch brand:", err.message);
    return res.status(500).json({
      success: false,
      message: "failed to fetch brand",
    });
  }
};

const updateBrand = async (req, res) => {
  const id = parseIdParam(req, res);
  if (id === null) {
    return;
  }

  const { name, country } = req.body || {};
  const normalizedName = pickString(name);
  const normalizedCountry = pickString(country);

  if (!normalizedName && !normalizedCountry) {
    return res.status(400).json({
      success: false,
      message: "name or country is required",
    });
  }

  const updates = {};
  if (normalizedName) {
    updates.name = normalizedName;
  }
  if (normalizedCountry) {
    updates.country = normalizedCountry;
  }

  const updateKeys = Object.keys(updates);
  const setClause = updateKeys.map((key) => `${key} = ?`).join(", ");
  const values = updateKeys.map((key) => updates[key]);

  try {
    const [result] = await db.query(
      `UPDATE brands SET ${setClause} WHERE id = ?`,
      [...values, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "brand not found",
      });
    }

    const [rows] = await db.query(
      "SELECT id, name, country FROM brands WHERE id = ?",
      [id]
    );

    return res.json({
      success: true,
      data: rows[0],
    });
  } catch (err) {
    console.error("Failed to update brand:", err.message);
    return res.status(500).json({
      success: false,
      message: "failed to update brand",
    });
  }
};

const deleteBrand = async (req, res) => {
  const id = parseIdParam(req, res);
  if (id === null) {
    return;
  }

  try {
    const [rows] = await db.query(
      "SELECT id, name, country FROM brands WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "brand not found",
      });
    }

    await db.query("DELETE FROM brands WHERE id = ?", [id]);

    return res.json({
      success: true,
      data: rows[0],
    });
  } catch (err) {
    console.error("Failed to delete brand:", err.message);
    return res.status(500).json({
      success: false,
      message: "failed to delete brand",
    });
  }
};

module.exports = {
  getAllBrands,
  createBrand,
  getBrandById,
  updateBrand,
  deleteBrand,
};
