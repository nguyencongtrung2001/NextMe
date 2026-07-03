require("dotenv").config();
const { defineConfig } = require("prisma/config");

module.exports = defineConfig({
  schema: "./prisma/schema.prisma",
  database: {
    url: process.env.DATABASE_URL,
  },
});
