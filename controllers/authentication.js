import { HttpError } from "../helpers/index.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import User from "../models/user.js";
import bcrypt from "bcrypt"
import jwt  from "jsonwebtoken";
import dotenv from "dotenv"

dotenv.config()

const {JWT_SECRET} = process.env

const register = async (req, res) => {

  const {email,password}=req.body;

  const user =await User.findOne({email})

  if(user){
    throw HttpError(409, "Email in use")
  }

  const hashPassword = await bcrypt.hash(password, 10)


  const newUser = await User.create({...req.body, password:hashPassword});
    if (!newUser) {
      throw HttpError(400);
    }
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

  export default{
    register:ctrlWrapper(register),
    login:ctrlWrapper(login),
currentUser:ctrlWrapper(currentUser),
logout:ctrlWrapper(logout)
    }