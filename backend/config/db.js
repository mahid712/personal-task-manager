const mongoose = require('mongoose');

let mongoConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/taskmanager';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000
    });
    mongoConnected = true;
    console.log(` MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    mongoConnected = false;
    console.warn(`! MongoDB Connection Warning: ${error.message}`);
    console.warn(`i Running in local JSON-persistent fallback mode.`);
    console.warn(`  To connect to MongoDB, ensure mongod is running or update MONGODB_URI in backend/.env`);
  }
};

const isConnected = () => mongoConnected;

module.exports = {
  connectDB,
  isConnected
};
