import { DataTypes } from "sequelize-cockroachdb";
import sequelize from "./index";
import { generateHash } from "../utils/bcryptUtils";
import { signToken } from "../utils/jwtUtils";

const UserModel = sequelize.define(
  "User",
  {
    email: {
      type: DataTypes.STRING,
      unique: true,
      primaryKey: true,
      allownull: false,
    },
    token: {
      type: DataTypes.STRING(5000),
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
      allowNull: false,
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

export async function destroyUser(email) {
  await UserModel.destroy({ where: { email: email } });
}

export async function createUser(user) {
  const { password, ...insert } = user;
  insert.hash = await generateHash(user.password);
  insert.token = signToken(insert);
  const newUser = await UserModel.create(insert);
  return newUser.get();
}

export async function queryOneUser(email) {
  const user = await UserModel.findOne({ where: { email: email } });
  return user.get();
}

export default UserModel;
