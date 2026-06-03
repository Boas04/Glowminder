require("dotenv").config();

const app = require("./app");
const db = require("./config/db");

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    const connection = await db.getConnection();
    connection.release();
    console.log("Database connected");
  } catch (err) {
    console.error("Database connection failed:", err.message);
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
