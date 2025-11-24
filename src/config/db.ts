import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

//connect mongo db with env 
//if env is not there it will use harcoded string
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/product-api';

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', true);
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database connection error: ${error}`);
    process.exit(1);
  }
};

export default connectDB;