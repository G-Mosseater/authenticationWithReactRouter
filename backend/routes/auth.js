const express = require('express');
const { add, get } = require('../data/user');
const { createJSONToken, isValidPassword } = require('../util/auth');
const { isValidEmail, isValidText } = require('../util/validation');

const router = express.Router();
// Signup route

router.post('/signup', async (req, res, next) => {
  const data = req.body;
  let errors = {};
  // Validate email and check if it already exists

  if (!isValidEmail(data.email)) {
    errors.email = 'Invalid email.';
  } else {
    try {
      const existingUser = await get(data.email);
      if (existingUser) {
        errors.email = 'Email exists already.';
      }
    } catch (error) {}
  }
  //  Validate password length

  if (!isValidText(data.password, 6)) {
    errors.password = 'Invalid password. Must be at least 6 characters long.';
  }
  //  If validation fails, return errors

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      message: 'User signup failed due to validation errors.',
      errors,
    });
  }
    // Add user to database

  try {
    const createdUser = await add(data);
        //  Create a JWT token for the new user

    const authToken = createJSONToken(createdUser.email);
        //  Send token back to frontend

    res
      .status(201)
      .json({ message: 'User created.', user: createdUser, token: authToken });
  } catch (error) {
    next(error);
  }
});
// Login route

router.post('/login', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  let user;
  try {
        // Get user from database

    user = await get(email);
  } catch (error) {
    return res.status(401).json({ message: 'Authentication failed.' });
  }
  // Check if password is correct

  const pwIsValid = await isValidPassword(password, user.password);
  if (!pwIsValid) {
    return res.status(422).json({
      message: 'Invalid credentials.',
      errors: { credentials: 'Invalid email or password entered.' },
    });
  }
  // Create JWT token for logged-in user

  const token = createJSONToken(email);
    //  Send token to frontend to store in localStorage

  res.json({ token });
});

module.exports = router;
