import { DataTypes } from "sequelize-cockroachdb";
import sequelize from "./index";
import ArticleModel from "./aticles"

const TagModel = sequelize.define("Tag", {
  id: {
    type: DataTypes.UUID,
    unique: true,
    primaryKey: true,
    allownull: false,
    defaultValue: DataTypes.UUIDV4
  },
  articleId: {
    type: DataTypes.STRING,
    unique: true,
    allownull: false,
  },
  tag: {
    type: DataTypes.STRING
  }
});

ArticleModel.hasMany(TagModel, { foreignKey: "articleId", as: "tags"})
TagModel.belongsTo(ArticleModel)

export default TagModel;
