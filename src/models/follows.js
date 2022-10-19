import { DataTypes } from "sequelize-cockroachdb";
import sequelize from "./index";
import UserModel from "./users";

const FollowModel = sequelize.define("Follow", {
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
  followingId: {
    type: DataTypes.STRING,
    allownull: false,
    unique: true,
    references: {
      model: UserModel,
      key: "email",
    },
  },
});

UserModel.belongsToMany(UserModel, {
  through: "Follow",
  foreignKey: "userId",
  as: "followers",
  onDelete: "CASCADE",
});
UserModel.belongsToMany(UserModel, {
  through: "Follow",
  foreignKey: "followingId",
  as: "following",
  onDelete: "CASCADE",
});

export default FollowModel;
