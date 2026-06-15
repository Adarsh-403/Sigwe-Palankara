import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/sigwe-inventory';

async function dropDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB.');
    await mongoose.connection.db.dropDatabase();
    console.log('Database dropped successfully.');
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error dropping DB:', err);
  }
}

dropDB();
