// Check users in database
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sweet-shop';

async function checkUsers() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected\n');

    const users = await mongoose.connection.db.collection('users').find({}).toArray();
    
    console.log(`📊 Found ${users.length} user(s) in database:\n`);
    
    users.forEach((user, index) => {
      console.log(`User #${index + 1}:`);
      console.log('  ID:', user._id);
      console.log('  Username:', user.username);
      console.log('  Email:', user.email);
      console.log('  Role:', user.role);
      console.log('  Password Hash:', user.password ? user.password.substring(0, 30) + '...' : 'NONE');
      console.log('  Created:', user.createdAt);
      console.log('');
    });

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

checkUsers();
