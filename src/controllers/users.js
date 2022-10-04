import UserModel from '../models/users'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

export async function registerUser(req, res) {
  try {
    const { user } = req.body


    const token = jwt.sign(user, process.env.PRIVATE_KEY)

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt)


    const newUser = await UserModel.create({
      token: token,
      username: user.username,
      email: user.email,
      hash: hash,
    })

    await newUser.save();

    const returnData = {
      user: {
        email: newUser.email,
        token: newUser.token,
        username: newUser.username,
        bio: newUser.bio,
        image: newUser.image
      }
    }
    return res.status(201).send(returnData)
  } catch (e) {
    throw console.error("Error",e)
  }
}
