import sgMail from "@sendgrid/mail"
import dotenv from "dotenv"
dotenv.config()
sgMail.setApiKey(process.env.SENDGRID_API_KEY)



console.log(process.env.SENDGRID_API_KEY);
const sendMail = async (data)=>{
    const email = {...data,from:"valentunmoroz@gmail.com"}
    await  sgMail.send(email)
    return true
}


  export default sendMail