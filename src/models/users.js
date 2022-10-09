import { DataTypes } from "sequelize-cockroachdb";
import sequelize from './index'

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

export async function insertUser({ user }) {
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(user.password, salt)
  await UserModel.create({
    username: user.username,
    email: user.email,
    hash: hash
  })
}

export async function queryOneUser(email) {
  const user = await UserModel.findOne({ where: { email: email } })
  return user.get()
}


export default UserModel;
