import mongoose from 'mongoose';
import { promises as dns } from 'node:dns';

dns.setServers(['8.8.8.8', '1.1.1.1']);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/preppilot');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}, ${error.stack}`);
    process.exit(1);
  }
};

export default connectDB;
