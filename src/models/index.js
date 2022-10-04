const {Sequelize} = require('sequelize-cockroachdb')
const env = process.env.NODE_ENV === "production" ? "production" : "development";
const config = require(__dirname + "/../config/config.js")[env];
const sequelize = new Sequelize(config.database);

(async () => {
  try {
    const [results, metadata] = await sequelize.query("SELECT NOW()");
    console.log(results);
  } catch (err) {
    throw console.error("error executing query:", err);
  }
})();

export default sequelize;
