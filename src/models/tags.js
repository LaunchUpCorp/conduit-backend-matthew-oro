import { DataTypes } from "sequelize-cockroachdb";
import sequelize from "./index";
import ArticleModel from "./articles";

const TagModel = sequelize.define("Tag", {
  id: {
    type: DataTypes.UUID,
    unique: true,
    primaryKey: true,
    allownull: false,
    defaultValue: DataTypes.UUIDV4,
  },
  articleId: {
    type: DataTypes.UUID,
    allownull: false,
    references: {
      model: ArticleModel,
      key: "id",
    },
  },
  tag: {
    type: DataTypes.STRING,
  },
});

ArticleModel.hasMany(TagModel, {
  foreignKey: "articleId",
  as: "tagList",
  onDelete: "CASCADE",
});
TagModel.belongsTo(ArticleModel, {
  foreignKey: "articleId",
  as: "tagList",
  onDelete: "CASCADE",
});

export default TagModel;
