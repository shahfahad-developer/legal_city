require('dotenv').config();
const { generateToken, verifyToken } = require('./utils/token');

// Test token generation
const testUser = {
  id: 1,
  email: 'test@example.com',
  role: 'user'
};

console.log('Testing token generation...');

// Test with userType
const tokenWithUserType = generateToken(testUser, 'user');
console.log('Generated token with userType:', tokenWithUserType.substring(0, 50) + '...');

const decodedWithUserType = verifyToken(tokenWithUserType);
console.log('Decoded token with userType:', decodedWithUserType);

// Test without userType (should default to 'user')
const tokenWithoutUserType = generateToken(testUser);
console.log('\nGenerated token without userType:', tokenWithoutUserType.substring(0, 50) + '...');

const decodedWithoutUserType = verifyToken(tokenWithoutUserType);
console.log('Decoded token without userType:', decodedWithoutUserType);

console.log('\nToken generation test completed!');