const express = require("express");
const path = require("path");
const { createProxyMiddleware } = require("http-proxy-middleware");

const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const brandRoutes = require("./routes/brandRoutes");
const aiRoutes = require("./routes/aiRoutes");
const weatherRoutes = require("./routes/weatherRoutes");
const reminderRoutes = require("./routes/reminderRoutes");

const app = express();

app.use(express.json());

// CORS middleware
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  return next();
});

// API Routes
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api", (req, res) => {
  res.json({ message: "Glowminder backend running" });
});

app.use("/api/product", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/reminders", reminderRoutes);

// Proxy AI Engine requests
const aiEngineUrl =
  process.env.AI_ENGINE_URL || "http://localhost:7860";
app.use(
  "/api/ai-engine",
  createProxyMiddleware({
    target: aiEngineUrl,
    changeOrigin: true,
    pathRewrite: {
      "^/api/ai-engine": "",
    },
  })
);

// Serve frontend static files
const frontendPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendPath));

// SPA fallback - serve index.html for all non-API routes
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

module.exports = app;
