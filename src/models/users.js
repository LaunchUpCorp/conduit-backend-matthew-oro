import { DataTypes } from "sequelize-cockroachdb";
import sequelize from "./index";

const UserModel = sequelize.define("User", {
  email: {
    type: DataTypes.STRING,
    unique: true,
    primaryKey: true,
    allownull: false,
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allownull: false,
  },
  hash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  bio: {
    type: DataTypes.STRING,
  },
  image: {
    type: DataTypes.STRING,
  },
});
export default UserModel;
