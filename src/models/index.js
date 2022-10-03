const { Sequelize, DataTypes } = require("sequelize-cockroachdb");
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.js")[env];
const sequelize = new Sequelize(config.database);

export const UserModel = sequelize.define(
  "User",
  {
    email: {
      type: DataTypes.STRING,
      unique: true,
      allownull: false,
    },
    token: {
      type: DataTypes.STRING,
      unique: true,
      allownull: false,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allownull: false,
    },
    hash: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    salt: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    bio: {
      type: DataTypes.STRING,
    },
    image: {
      type: DataTypes.STRING,
    },
  },
  {}
);

(async () => {
  try {
    const [results, metadata] = await sequelize.query("SELECT NOW()");
    console.log(results);
  } catch (err) {
    console.error("error executing query:", err);
  }
})();

export default sequelize;
