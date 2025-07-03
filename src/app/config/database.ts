import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

const connectDb = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(MONGO_URI!);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Failed to connect to MongoDB: ${error}`);
    process.exit(1);
  }
};

export default connectDb;
