const jwt = require('jsonwebtoken');

<<<<<<< HEAD
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
=======
const generateToken = (user, userType = 'user') => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, userType },
>>>>>>> 2d887b0789fadae1c29b3db3c146c5173bf30e47
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = { generateToken, verifyToken };
