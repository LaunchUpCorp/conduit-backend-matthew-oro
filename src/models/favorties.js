import { DataTypes } from "sequelize-cockroachdb";
import sequelize from "./index";
import ArticleModel from "./articles";
import UserModel from "./users";

const FavoriteModel = sequelize.define("Favorite", {
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
  userId: {
    type: DataTypes.STRING,
    allownull: false,
    references: {
      model: UserModel,
      key: "email",
    },
  },
});

UserModel.belongsToMany(ArticleModel, {
  through: "Favorite",
  as: "isFavorite",
  foreignKey: "userId",
  onDelete: "CASCADE",
});
ArticleModel.belongsToMany(UserModel, {
  through: "Favorite",
  as: "favoritesCount",
  foreignKey: "articleId",
  onDelete: "CASCADE",
});

export default FavoriteModel;
