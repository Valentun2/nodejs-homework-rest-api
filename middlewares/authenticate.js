import jwt  from "jsonwebtoken";
import dotenv from "dotenv"
import { HttpError } from "../helpers/index.js";
import User from "../models/user.js";

dotenv.config()


const {JWT_SECRET} = process.env

const authenticate = async (req,res,next)=>{
const {authorization} = req.headers

if(!authorization){
    return next(HttpError(401,"Authorization not define"))
}

const [bearer, token] = authorization.split(" ")

if(bearer !== "Bearer"){
    return next(HttpError(401))
}

try {
    const {id}=jwt.verify(token,JWT_SECRET)
   
    const user =await User.findById(id)
    if(!user || !user.token || token !== user.token){
        return next(HttpError(401,"Not authorized"))

    }
    req.user = user
    
    next()
} catch (error) {
    next(HttpError(401, "Not authorized"))
}

}



/*
// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
javascript
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const msg = {
  to: 'test@example.com', // Change to your recipient
  from: 'test@example.com', // Change to your verified sender
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
}
sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })
*/




export default authenticate