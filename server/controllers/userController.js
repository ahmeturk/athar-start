import User from '../models/User.js';

/**
 * GET /api/users/profile
 */
export const getProfile = async (req, res) => {
  res.json({
    success: true,
    user: req.user.toPublicJSON(),
  });
};

/**
 * PUT /api/users/profile
 */
export const updateProfile = async (req, res, next) => {
  try {
    const updates = req.validatedBody;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'تم تحديث الملف الشخصي',
      user: user.toPublicJSON(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/users/change-password
 */
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل',
      });
    }

    const user = await User.findById(req.user._id).select('+password');

    if (user.authProvider === 'google' && !user.password) {
      return res.status(400).json({
        success: false,
        message: 'لا يمكن تغيير كلمة المرور لحساب Google',
      });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'كلمة المرور الحالية غير صحيحة',
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'تم تغيير كلمة المرور بنجاح',
    });
  } catch (error) {
    next(error);
  }
};
