import { DataTypes } from "sequelize-cockroachdb";
import sequelize from "./index";

const ArticleModel = sequelize.define("Article", {
  id: {
    type: DataTypes.UUID,
    unique: true,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4
  },
  title: {
    type: DataTypes.STRING,
    unique: true,
    allownull: false,
  },
  description: {
    type: DataTypes.STRING,
    allownull: false,
  },
  body: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default ArticleModel;
