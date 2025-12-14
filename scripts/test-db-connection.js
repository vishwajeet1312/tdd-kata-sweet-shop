// Test MongoDB Connection
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sweet-shop';

console.log('🔄 Attempting to connect to MongoDB...');
console.log('📍 Connection URI:', MONGODB_URI);

mongoose
  .connect(MONGODB_URI, {
    bufferCommands: false,
  })
  .then(() => {
    console.log('✅ MongoDB connection successful!');
    console.log('📊 Database:', mongoose.connection.db.databaseName);
    console.log('🔗 Host:', mongoose.connection.host);
    console.log('🚪 Port:', mongoose.connection.port);
    console.log('📝 Ready state:', mongoose.connection.readyState, '(1 = connected)');
    
    // List all collections
    return mongoose.connection.db.listCollections().toArray();
  })
  .then((collections) => {
    console.log('\n📂 Collections in database:');
    if (collections.length === 0) {
      console.log('   (empty - no collections yet)');
    } else {
      collections.forEach((col) => {
        console.log(`   - ${col.name}`);
      });
    }
    
    return mongoose.disconnect();
  })
  .then(() => {
    console.log('\n✅ Connection test completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ MongoDB connection failed:');
    console.error('   Error:', error.message);
    console.error('\n💡 Troubleshooting:');
    console.error('   1. Ensure MongoDB service is running');
    console.error('   2. Check if port 27017 is available');
    console.error('   3. Verify MONGODB_URI in .env.local');
    process.exit(1);
  });
