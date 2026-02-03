import User from '../models/User.js';
import { generateToken } from '../config/jwt.js';
import { OAuth2Client } from 'google-auth-library';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper: send token response
const sendTokenResponse = (res, user, statusCode = 200) => {
  const token = generateToken(user._id);
  const userData = user.toPublicJSON();

  res.status(statusCode).json({
    success: true,
    token,
    user: userData,
  });
};

/**
 * POST /api/auth/signup
 */
export const signup = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.validatedBody;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'البريد الإلكتروني مسجل مسبقاً',
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone: phone || undefined,
      authProvider: 'local',
    });

    user.lastLoginAt = new Date();
    await user.save();

    sendTokenResponse(res, user, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.validatedBody;

    // Get user with password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
      });
    }

    // Check if user registered with Google
    if (user.authProvider === 'google' && !user.password) {
      return res.status(401).json({
        success: false,
        message: 'هذا الحساب مسجل عبر Google. يرجى تسجيل الدخول باستخدام Google.',
      });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'الحساب معطل. يرجى التواصل مع الدعم.',
      });
    }

    user.lastLoginAt = new Date();
    await user.save();

    sendTokenResponse(res, user);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/google
 */
export const googleAuth = async (req, res, next) => {
  try {
    const { credential } = req.validatedBody;

    let payload;

    // If Google Client ID is configured, verify the token
    if (process.env.GOOGLE_CLIENT_ID) {
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } else {
      // Dev mode: accept a simulated Google token
      // In dev, the frontend sends a JSON string as "credential"
      try {
        payload = JSON.parse(credential);
      } catch {
        return res.status(400).json({
          success: false,
          message: 'رمز Google غير صالح',
        });
      }
    }

    const { sub: googleId, email, name, picture } = payload;

    // Find or create user
    let user = await User.findOne({
      $or: [{ googleId }, { email }],
    });

    if (user) {
      // Update Google ID if user exists but registered with email
      if (!user.googleId) {
        user.googleId = googleId;
        user.authProvider = 'google';
      }
      if (picture && !user.avatar) {
        user.avatar = picture;
      }
      user.lastLoginAt = new Date();
      await user.save();
    } else {
      // Create new user
      user = await User.create({
        name,
        email,
        googleId,
        avatar: picture || null,
        authProvider: 'google',
        isEmailVerified: true,
        lastLoginAt: new Date(),
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'الحساب معطل. يرجى التواصل مع الدعم.',
      });
    }

    sendTokenResponse(res, user);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/me
 */
export const getMe = async (req, res) => {
  res.json({
    success: true,
    user: req.user.toPublicJSON(),
  });
};

/**
 * POST /api/auth/logout
 */
export const logout = async (req, res) => {
  res.json({
    success: true,
    message: 'تم تسجيل الخروج بنجاح',
  });
};
