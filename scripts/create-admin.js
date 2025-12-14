// Create Admin User Script
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sweet-shop';

// User Schema (matching your model)
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
}, {
  timestamps: true,
});

// Password hashing
const bcrypt = require('bcryptjs');

UserSchema.pre('save', async function () {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function createAdminUser() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@sweetshop.com' });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists:');
      console.log('   Email: admin@sweetshop.com');
      console.log('   Username:', existingAdmin.username);
      console.log('   Role:', existingAdmin.role);
      console.log('\n💡 Use these credentials to login');
      await mongoose.disconnect();
      return;
    }

    // Create new admin user
    const adminUser = new User({
      username: 'admin',
      email: 'admin@sweetshop.com',
      password: 'admin123', // Will be hashed by pre-save hook
      role: 'admin',
    });

    await adminUser.save();

    console.log('✅ Admin user created successfully!\n');
    console.log('📝 Admin Credentials:');
    console.log('   Email: admin@sweetshop.com');
    console.log('   Password: admin123');
    console.log('   Username: admin');
    console.log('   Role: admin');
    console.log('\n🔐 Use these credentials to login to the admin panel');
    console.log('🌐 Admin Panel: http://localhost:3000/admin');

    await mongoose.disconnect();
    console.log('\n✅ Done!');
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

createAdminUser();
