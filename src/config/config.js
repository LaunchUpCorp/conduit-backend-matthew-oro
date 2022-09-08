require("dotenv/config");
module.exports = {
  development: {
    database: process.env.DATABASE_URL,
  },
  production: {
    database: process.env.DATABASE_URL,
  },
};
