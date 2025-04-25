import mongoose from 'mongoose';
import { ipAddress } from '../constants/index.js';

const connectDb = async (port) => {
  try {
    mongoose.Error;
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(
      `\x1b[32mConnected to MongoDB and server is running on port http://${ipAddress()}:${port}\x1b[0m`
    );
  } catch (err) {
    console.error(err);
  }
};

export default connectDb;
