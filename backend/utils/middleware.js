const { verifyToken } = require('./token');
const db = require('../db');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }

  // Check if user exists in users or lawyers table
  let user = await db('users').where({ id: decoded.id }).first();
  let userType = 'user';
  
  if (!user) {
    user = await db('lawyers').where({ id: decoded.id }).first();
    userType = 'lawyer';
  }

  if (!user) {
    return res.status(403).json({ message: 'User not found' });
  }

  req.user = { 
    ...decoded, 
    userType,
    isAdmin: user.is_admin || user.role === 'admin' || false 
  };
  next();
};

const verifyAdmin = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token missing' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  // Check if user exists and is admin
  let user = await db('users').where({ id: decoded.id }).first();
  if (!user) {
    user = await db('lawyers').where({ id: decoded.id }).first();
  }

  if (!user) {
    return res.status(403).json({ error: 'User not found' });
  }

  if (user.role !== 'admin' && !user.is_admin) {
    return res.status(403).json({ error: 'Access denied: Admins only' });
  }

  req.user = { ...decoded, isAdmin: true };
  next();
};

const rateLimit = (req, res, next) => {
  // Simple in-memory rate limiting (for production, use Redis or similar)
  const key = req.ip;
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 100;

  if (!global.rateLimitStore) {
    global.rateLimitStore = {};
  }

  const now = Date.now();
  if (!global.rateLimitStore[key]) {
    global.rateLimitStore[key] = { count: 1, resetTime: now + windowMs };
  } else {
    if (now > global.rateLimitStore[key].resetTime) {
      global.rateLimitStore[key] = { count: 1, resetTime: now + windowMs };
    } else {
      global.rateLimitStore[key].count++;
      if (global.rateLimitStore[key].count > maxRequests) {
        return res.status(429).json({ message: 'Too many requests' });
      }
    }
  }

  next();
};

const authenticateLawyer = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }

  // Check if user exists in lawyers table
  const lawyer = await db('lawyers').where({ id: decoded.id }).first();
  if (!lawyer) {
    return res.status(403).json({ message: 'Lawyer not found' });
  }

  req.user = { ...decoded, role: 'lawyer' };
  next();
};

module.exports = { authenticateToken, verifyAdmin, rateLimit, authenticateLawyer };
