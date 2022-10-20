import { DataTypes } from "sequelize-cockroachdb";
import sequelize from "./index";
import UserModel from "./users";

const ArticleModel = sequelize.define("Article", {
  id: {
    type: DataTypes.UUID,
    unique: true,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4,
  },
  authorId: {
    type: DataTypes.STRING,
    allowNull: null,
    references: {
      model: UserModel,
      key: "email",
    },
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

UserModel.hasMany(ArticleModel, {
  foreignKey: "authorId",
  as: "articles",
  onDelete: "CASCADE",
});

export default ArticleModel;
