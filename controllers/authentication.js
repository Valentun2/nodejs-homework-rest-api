import { HttpError, sendEmail } from "../helpers/index.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import User from "../models/user.js";
import bcrypt from "bcrypt"
import jwt  from "jsonwebtoken";
import dotenv from "dotenv"
import gravatar from "gravatar"
import path from "path"
import fs from "fs/promises"
import Jimp from "jimp";
import { nanoid } from "nanoid";
const avatarPath = path.resolve( "public","avatars")

dotenv.config()

const {JWT_SECRET,BASE_URL} = process.env

const register = async (req, res) => {

  const {email,password}=req.body;

  const user =await User.findOne({email})

  if(user){
    throw HttpError(409, "Email in use")
  }

  const hashPassword = await bcrypt.hash(password, 10)
const defaultUrl = gravatar.url(email)

const verificationToken = nanoid()
  const newUser = await User.create({...req.body, password:hashPassword,avatar:defaultUrl,verificationToken});
    if (!newUser) {
      throw HttpError(400);
    }

    const verifyEmail = {
      to:email,
      subject : "Verify email",
      html:`<a target = "_blank" href="${BASE_URL}/users/verify/${verificationToken}" >Click verify email</a>`
    }

await sendEmail(verifyEmail)
    res.status(201).json({
      user: {
        email:newUser.email,
        subscription:newUser.subscription
      }
      
    });
  };


const login = async (req,res)=>{


  const {email, password}=req.body;
  

const user =await User.findOne({email})
if (!user) {
  throw HttpError(401, "Email or password invalid");
}

 const passwordCompare =await bcrypt.compare(password,user.password)
if(!passwordCompare){
  throw HttpError(401, "Email or password invalid");

}

if(!user.verify){
  throw HttpError(401,"Email not verified")
}

const {_id:id}=user

const payload = {
  id
}
const token = jwt.sign(payload,JWT_SECRET,{expiresIn:"23h"})
await User.findByIdAndUpdate(id,{token})

res.json({
  token,
  user: {
    email:user.email,
    subscription:user.subscription
  }
})
}


const currentUser =async (req,res,next)=>{
const {email,subscription} = req.user

res.json({
  email,
  subscription
})
}

const logout = async (req,res)=>{
const {_id} = req.user
await User.findByIdAndUpdate(_id,{token:""})
res.status(204).json()
}

const updateAvatar = async (req,res)=>{
  if(!req.file){
    throw HttpError(400, "Avatar is requare")
  }
  const { _id} = req.user
 const {path : oldPath,filename} = req.file

const newPath = path.join(avatarPath, `${_id}${filename}`)
Jimp.read(oldPath, (err, photo) => {
  if (err){
    throw err
  };
  photo
    .resize(250, 250)
    .write(newPath)
});

await fs.unlink(oldPath)

const avatarUrl = path.join( "avatars",`${_id}${filename}`)
await  User.findByIdAndUpdate(_id,{ avatar:avatarUrl})
  res.json({avatar:avatarUrl});
  }
  

const verifyEmail = async(req,res)=>{
const {verificationToken} = req.params
const user = await User.findOne({verificationToken})

if (!user) {
  throw HttpError(404, 'User not found')
}
await User.findByIdAndUpdate(user._id,{
  verificationToken:null,
  verify:true
})
res.json({
  message: 'Verification successful',
})
}


const verify = async(req,res)=>{
  const {email} = req.body
  const user = await User.findOne({email})
  if (!user) {
    throw HttpError(404, 'User not found')
  }
  if(user.verify){
    throw HttpError(401,"Verification has already been passed")
  }

  const verifyEmail = {
    to:email,
    subject : "Verify email",
    html:`<a target = "_blank" href="${BASE_URL}/users/verify/${user.verificationToken}" >Click verify email</a>`
  }

await sendEmail(verifyEmail)

res.json({
  "message": "Verification email sent"
})
}

  export default{
    register:ctrlWrapper(register),
    login:ctrlWrapper(login),
currentUser:ctrlWrapper(currentUser),
logout:ctrlWrapper(logout),
updateAvatar:ctrlWrapper(updateAvatar),
verifyEmail:ctrlWrapper(verifyEmail),
verify:ctrlWrapper(verify)

    }