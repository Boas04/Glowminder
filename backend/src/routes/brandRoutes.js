const express = require("express");
const {
  getAllBrands,
  createBrand,
  getBrandById,
  updateBrand,
  deleteBrand,
} = require("../controllers/brandController");

const router = express.Router();

router.get("/", getAllBrands);
router.post("/", createBrand);
router.get("/:id", getBrandById);
router.put("/:id", updateBrand);
router.delete("/:id", deleteBrand);

module.exports = router;
