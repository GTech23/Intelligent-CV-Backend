import mongoose from "mongoose";

async function connectDB(){
    try {
       const connection = await mongoose.connect(process.env.MONGODB_URI)
       console.log(`✅ MongoDB connected: ${connection.connection.host}`);

    } catch (error) {
      console.error(`Error connecting to DB, ${error}`)  
      process.exit(1)
    }
}

export default connectDB;