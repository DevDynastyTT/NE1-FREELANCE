import mongoose, { ConnectOptions } from "mongoose";

let connected = false

export const connectToDB: () => Promise<void>  = async () => {
    mongoose.set('strictQuery', true)
    if(connected) return
    
        const mongodbUri = process.env.MONGODB_URI;

        if (!mongodbUri) {
        throw new Error("MONGODB_URI environment variable is not defined");
        }
    try {
        await mongoose.connect(mongodbUri, {
          dbName: process.env.MONGODB_DBNAME,
          useNewUrlParser: true,
          useUnifiedTopology: true,
        } as ConnectOptions);

        connected = true
        console.log("Connected to MongoDB")
      } catch (error) {
        console.error("Error connecting to MongoDB:", error)
      }
}