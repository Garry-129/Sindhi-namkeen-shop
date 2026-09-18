import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sindhi_namkeen';
    console.log(`[Database] Attempting connection to: ${connStr.replace(/\/\/.*@/, '//***@')}`);
    
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 5000,
    });
    
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`[Database Warning] MongoDB connection failed: ${error.message}`);
    console.warn(`[Database Warning] Operating in fallback mode. API will serve fallback/mock operations if DB is unreachable.`);
    return false;
  }
};

export default connectDB;
