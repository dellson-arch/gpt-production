const mongoose = require('mongoose');

async function connectDb(){
  try {
       await mongoose.connect(process.env.MONGO_URI)

       console.log("connected to MongoDB")
  } catch (error) {
    console.log("Error connecting to MongoDB :" , error)
  }
  
}
module.exports = connectDb