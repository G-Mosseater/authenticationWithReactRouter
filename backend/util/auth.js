const { sign, verify } = require('jsonwebtoken'); // JWT functions: sign = create token, verify = check token
const { compare } = require('bcryptjs'); // Compare plaintext password with hashed password
const { NotAuthError } = require('./errors'); // Custom error for unauthenticated requests

const KEY = 'supersecret'; // Secret key used to sign/verify JWTs

// Creates a JSON Web Token (JWT) for a user
function createJSONToken(email) {
  return sign({ email }, KEY, { expiresIn: '1h' }); // token contains email, expires in 1 hour
}

// Validates a JWT (used in middleware to check protected routes)
function validateJSONToken(token) {
  return verify(token, KEY); // throws error if token is invalid or expired
}

// Compares the plaintext password with the hashed password stored in the DB
function isValidPassword(password, storedPassword) {
  return compare(password, storedPassword); // returns true/false
}

// Middleware to protect routes (check if request is authenticated)
function checkAuthMiddleware(req, res, next) {
  if (req.method === 'OPTIONS') return next(); // skip for preflight requests

  // Check for authorization header
  if (!req.headers.authorization) {
    console.log('NOT AUTH. AUTH HEADER MISSING.');
    return next(new NotAuthError('Not authenticated.'));
  }

  // Split header: "Bearer <token>"
  const authFragments = req.headers.authorization.split(' ');
  if (authFragments.length !== 2) {
    console.log('NOT AUTH. AUTH HEADER INVALID.');
    return next(new NotAuthError('Not authenticated.'));
  }

  // Extract token and validate it
  const authToken = authFragments[1];
  try {
    const validatedToken = validateJSONToken(authToken); // calls validateJSONToken()
    req.token = validatedToken; // attach validated token to request object
  } catch (error) {
    console.log('NOT AUTH. TOKEN INVALID.');
    return next(new NotAuthError('Not authenticated.'));
  }

  next(); // Token is valid, continue to route handler
}

// Export functions to use in routes
exports.createJSONToken = createJSONToken; // used in signup/login to generate token
exports.validateJSONToken = validateJSONToken; // used in middleware to check token
exports.isValidPassword = isValidPassword; // used in login to check password
exports.checkAuth = checkAuthMiddleware; // used to protect routes
