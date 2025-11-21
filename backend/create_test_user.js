const bcrypt = require('bcryptjs');
const db = require('./db');

async function createTestUser() {
  try {
    console.log('Creating test user...');
    
    // Check if test user already exists
    const existingUser = await db('users').where({ email: 'test@example.com' }).first();
    
    if (existingUser) {
      console.log('Test user already exists:', existingUser);
      return;
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    // Create test user
    const [userId] = await db('users').insert({
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
      email_verified: 1,
      is_verified: 1,
      role: 'user'
    });
    
    console.log('✅ Test user created successfully with ID:', userId);
    
    // Verify the user was created
    const createdUser = await db('users').where({ id: userId }).first();
    console.log('Created user details:', {
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
      email_verified: createdUser.email_verified,
      is_verified: createdUser.is_verified,
      role: createdUser.role
    });
    
  } catch (error) {
    console.error('❌ Error creating test user:', error.message);
  } finally {
    process.exit(0);
  }
}

createTestUser();