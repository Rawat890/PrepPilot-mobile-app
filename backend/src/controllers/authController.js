import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import TestAttempt from '../models/TestAttempt.js';
import Bookmark from '../models/Bookmark.js';
import Cart from '../models/Cart.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'prepmaster_super_secret_jwt_key_2026', {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });
};

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, targetExam } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Please provide name, email, and password');
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(400);
      throw new Error('User with this email already exists');
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      targetExam: targetExam || 'General Competitive Exams',
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      targetExam: user.targetExam,
      phone: user.phone,
      bio: user.bio,
      streakDays: user.streakDays,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide email and password');
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      targetExam: user.targetExam,
      phone: user.phone,
      bio: user.bio,
      streakDays: user.streakDays,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('purchasedPacks');
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    user.name = req.body.name || user.name;
    user.targetExam = req.body.targetExam || user.targetExam;
    user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
    user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;

    if (req.body.password && req.body.password.length >= 6) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      targetExam: updatedUser.targetExam,
      phone: updatedUser.phone,
      bio: updatedUser.bio,
      streakDays: updatedUser.streakDays,
      token: generateToken(updatedUser._id),
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUserAccount = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Cascade delete all user-owned data
    await Promise.all([
      TestAttempt.deleteMany({ user: userId }),
      Bookmark.deleteMany({ user: userId }),
      Cart.deleteMany({ user: userId }),
      User.findByIdAndDelete(userId),
    ]);

    res.json({ message: 'Account and all associated exam data permanently deleted.' });
  } catch (error) {
    next(error);
  }
};
