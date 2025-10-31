const mongoose = require('mongoose');

const connectDatabase = async () => {
  try {
    const { MONGODB_URI } = process.env;
    if (!MONGODB_URI) {
      console.error("[DB] Missing MONGODB_URI. Please create backend/.env or set environment variable. See docs/SETUP.md > 后端环境变量");
      process.exit(1);
    }

    const conn = await mongoose.connect(MONGODB_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[DB] Connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDatabase;
