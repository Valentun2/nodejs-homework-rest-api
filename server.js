
import mongoose from 'mongoose'

import app  from './app.js'


const {DB_HOST} = process.env
mongoose.connect(DB_HOST).then(()=>
{
  app.listen(3000, () => {
    console.log("Database connection successful")
  })

}
).catch((err)=>{
  console.log(err.message);
  process.exit(1)
})

