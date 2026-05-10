import User from './models/User.js';
import connectDB from './config/db.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

console.log('\n🔍 Starting Authentication Diagnostic...\n');

const tests = {
  passed: [],
  failed: []
};

connectDB().then(async () => {
  try {
    // Test 1: Environment Variables
    console.log('📝 Test 1: Checking Environment Variables...');
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET not set in .env');
    }
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI not set in .env');
    }
    console.log('✅ Environment variables loaded correctly\n');
    tests.passed.push('Environment Variables');

    // Test 2: Create Test User
    console.log('📝 Test 2: Creating Test User...');
    const testEmail = `diag-test-${Date.now()}@example.com`;
    const testPassword = 'password123';

    const hashedPassword = await bcryptjs.hash(testPassword, 10);
    const testUser = await User.create({
      name: 'Diagnostic Test',
      email: testEmail,
      password: hashedPassword
    });
    console.log(`✅ User created: ${testUser.email}\n`);
    tests.passed.push('User Creation');

    // Test 3: Find User
    console.log('📝 Test 3: Finding User by Email...');
    const found = await User.findOne({ email: testEmail });
    if (!found) {
      throw new Error('User not found in database');
    }
    console.log(`✅ User found: ${found.email}\n`);
    tests.passed.push('User Lookup');

    // Test 4: Password Verification
    console.log('📝 Test 4: Verifying Password...');
    const match = await bcryptjs.compare(testPassword, found.password);
    if (!match) {
      throw new Error('Password verification failed');
    }
    console.log('✅ Password verified correctly\n');
    tests.passed.push('Password Hashing');

    // Test 5: JWT Token Generation
    console.log('📝 Test 5: Generating JWT Token...');
    const token = jwt.sign(
      { id: found._id, role: found.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    if (!token) {
      throw new Error('Token generation failed');
    }
    console.log(`✅ Token generated: ${token.substring(0, 30)}...\n`);
    tests.passed.push('JWT Token Generation');

    // Test 6: Token Verification
    console.log('📝 Test 6: Verifying JWT Token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.id !== found._id.toString()) {
      throw new Error('Token verification failed');
    }
    console.log(`✅ Token verified for user: ${decoded.id}\n`);
    tests.passed.push('JWT Verification');

    // Cleanup
    console.log('📝 Test 7: Cleaning Up...');
    await User.deleteOne({ email: testEmail });
    console.log('✅ Test user deleted\n');
    tests.passed.push('Cleanup');

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('🎉 ALL TESTS PASSED!');
    console.log('='.repeat(50));
    console.log('\n✅ Your authentication system is working correctly!\n');
    console.log('If you\'re still getting "Login failed" errors:');
    console.log('1. Check that both backend and frontend are running');
    console.log('2. Verify seedling data exists in MongoDB');
    console.log('3. Clear browser localStorage and try again\n');

  } catch (error) {
    console.error('\n❌ TEST FAILED!\n');
    console.error('Error:', error.message);
    console.error('\nStack:', error.stack);
    tests.failed.push(error.message);

    console.log('\n' + '='.repeat(50));
    console.log('🔧 TROUBLESHOOTING STEPS:');
    console.log('='.repeat(50));

    if (error.message.includes('JWT_SECRET')) {
      console.log('\n1. Check your .env file has JWT_SECRET set:');
      console.log('   cat backend/.env | grep JWT_SECRET');
    }

    if (error.message.includes('MONGO_URI')) {
      console.log('\n2. Check your .env file has MONGO_URI set:');
      console.log('   cat backend/.env | grep MONGO_URI');
    }

    if (error.message.includes('MongoDB')) {
      console.log('\n3. MongoDB connection failed:');
      console.log('   - Check MongoDB Atlas IP whitelist (add 0.0.0.0/0)');
      console.log('   - Verify MONGO_URI connection string is correct');
      console.log('   - Check your internet connection');
    }

    if (error.message.includes('Password')) {
      console.log('\n4. Password hashing issue:');
      console.log('   - Reinstall bcryptjs: npm install bcryptjs');
    }

    if (error.message.includes('User')) {
      console.log('\n5. Database issue:');
      console.log('   - Check MongoDB is accessible');
      console.log('   - Verify credentials in MONGO_URI');
    }

    console.log('\n');

  } finally {
    process.exit(tests.failed.length > 0 ? 1 : 0);
  }
}).catch(err => {
  console.error('❌ Failed to connect to database:', err.message);
  console.error('\nMake sure:');
  console.error('1. MongoDB Atlas cluster is running');
  console.error('2. .env file has correct MONGO_URI');
  console.error('3. Your IP is whitelisted in MongoDB Atlas network access');
  process.exit(1);
});
