import Joi from "joi";
import { Schema,model } from "mongoose";

  
  
  export const userSchema = new Schema ({
    password: {
      type: String,
      required: [true, 'Set password for user'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter"
    },
    token: {
      type:String,
      default:""
    },
   
    avatar :{
      type:String,
      required:true
    }
  },
  {versionKey:false, timeseries:true}
  )

export const authSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().required()
})



  const User = model("user",userSchema)

  export default User