const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const role = 'petugas';
    const userId = await User.create(username, password, role);
    res.status(201).json({ message: 'User registered successfully', userId });
  } catch (error) {
    console.error('Error in register function:', error);
    if (error.message === 'Username already exists') {
      res.status(409).json({ message: 'Username already exists' });
    } else {
      res.status(500).json({ message: 'Error registering user', error: error.message });
    }
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Login attempt for username:', username);
    const user = await User.findByUsername(username);
    console.log('User found in controller:', user);
    if (!user) {
      console.log('User not found in controller');
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    const isMatch = await User.comparePassword(password, user.password);
    console.log('Password match:', isMatch);
    if (!isMatch) {
      console.log('Password does not match');
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Login successful, sending response');
    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

exports.check = (req, res) => {
  res.json({ isAuthenticated: true, user: { id: req.userId, role: req.userRole } });
};