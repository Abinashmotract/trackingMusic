const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    };

    const conn = await mongoose.connect(process.env.MONGODB_URI, options);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('\n🔧 Troubleshooting Steps:');
    console.error('1. Go to MongoDB Atlas Dashboard → Network Access');
    console.error('2. Click "Add IP Address"');
    console.error('3. For development, add: 0.0.0.0/0 (allows all IPs)');
    console.error('   OR add your specific IP address');
    console.error('4. Wait 1-2 minutes for changes to take effect');
    console.error('5. Verify your username and password in Database Access');
    console.error('\n📝 Connection String Format:');
    console.error('mongodb+srv://username:password@cluster.mongodb.net/database');
    process.exit(1);
  }
};

module.exports = connectDB;
