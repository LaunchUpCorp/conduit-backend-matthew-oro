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
  userId: {
    type: DataTypes.STRING,
    allownull: false,
    references: {
      model: UserModel,
      key: "email",
    },
  },
  articleId: {
    type: DataTypes.UUID,
    allownull: false,
    references: {
      model: ArticleModel,
      key: "id",
    },
  },
});

UserModel.belongsToMany(ArticleModel, {
  through: FavoriteModel,
  as: "isFavorite",
  foreignKey: "userId",
  onDelete: "CASCADE",
});
ArticleModel.belongsToMany(UserModel, {
  through: FavoriteModel,
  as: "favoritesCount",
  foreignKey: "articleId",
  onDelete: "CASCADE",
});

export default FavoriteModel;
