import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

export const connectDB = async () => {
  mongoose.set('strictQuery', true);
  
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
  });

  console.log(`MongoDB connected: ${conn.connection.host}`);
};