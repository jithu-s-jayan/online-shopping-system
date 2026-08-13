import mongoose from 'mongoose';
import { setMongoConnected } from '../services/mockDataStore';

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/luxora_db');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    setMongoConnected(true);
  } catch (error) {
    console.log(`MongoDB Connection Note: Local MongoDB service not running. Running in Seamless High-Fidelity Mock Mode.`);
    setMongoConnected(false);
  }
};
