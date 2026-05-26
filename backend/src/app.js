const express = require("express");

const productRoutes = require("./routes/productRoutes");
const aiRoutes = require("./routes/aiRoutes");
const weatherRoutes = require("./routes/weatherRoutes");

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/", (req, res) => {
  res.json({ message: "Glowminder backend running" });
});

app.use("/api/product", productRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/weather", weatherRoutes);

module.exports = app;
