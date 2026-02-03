import User from '../models/User.js';
import Assessment from '../models/Assessment.js';
import Payment from '../models/Payment.js';
import Coupon from '../models/Coupon.js';
import Settings from '../models/Settings.js';

/**
 * GET /api/admin/dashboard
 */
export const getDashboard = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalAssessments,
      completedAssessments,
      totalPayments,
      revenueResult,
      recentUsers,
      recentPayments,
    ] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      Assessment.countDocuments(),
      Assessment.countDocuments({ status: 'completed' }),
      Payment.countDocuments({ status: 'paid' }),
      Payment.aggregate([
        { $match: { status: 'paid' } },
        { $group: { _id: null, total: { $sum: '$pricing.total' } } },
      ]),
      User.find({ role: 'student' })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name email createdAt hasPaid'),
      Payment.find({ status: 'paid' })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('user', 'name email')
        .select('pricing.total method createdAt'),
    ]);

    const totalRevenue = revenueResult[0]?.total || 0;
    const completionRate = totalAssessments > 0
      ? Math.round((completedAssessments / totalAssessments) * 100)
      : 0;

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalAssessments,
        completedAssessments,
        completionRate,
        totalPayments,
        totalRevenue,
      },
      recentUsers,
      recentPayments,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/users
 */
export const getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    const filter = { role: 'student' };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('name email phone grade city hasPaid isActive createdAt lastLoginAt'),
      User.countDocuments(filter),
    ]);

    res.json({
      success: true,
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/users/:id
 */
export const getUserDetail = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'المستخدم غير موجود' });
    }

    const [assessments, payments] = await Promise.all([
      Assessment.find({ user: user._id }).sort({ createdAt: -1 }),
      Payment.find({ user: user._id }).sort({ createdAt: -1 }),
    ]);

    res.json({
      success: true,
      user: user.toPublicJSON(),
      assessments,
      payments,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/admin/users/:id/toggle-active
 */
export const toggleUserActive = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'المستخدم غير موجود' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: user.isActive ? 'تم تفعيل الحساب' : 'تم تعطيل الحساب',
      isActive: user.isActive,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/payments
 */
export const getPayments = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status;
    const skip = (page - 1) * limit;

    const filter = {};
    if (status) filter.status = status;

    const [payments, total] = await Promise.all([
      Payment.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('user', 'name email'),
      Payment.countDocuments(filter),
    ]);

    res.json({
      success: true,
      payments,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/analytics
 */
export const getAnalytics = async (req, res, next) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      dailySignups,
      dailyPayments,
      assessmentStats,
      topCities,
      gradeDistribution,
    ] = await Promise.all([
      // Daily signups for last 30 days
      User.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo }, role: 'student' } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      // Daily payments
      Payment.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo }, status: 'paid' } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 },
            revenue: { $sum: '$pricing.total' },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      // Assessment completion stats
      Assessment.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]),
      // Top cities
      User.aggregate([
        { $match: { city: { $ne: '' } } },
        { $group: { _id: '$city', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      // Grade distribution
      User.aggregate([
        { $match: { grade: { $ne: '' } } },
        { $group: { _id: '$grade', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    res.json({
      success: true,
      analytics: {
        dailySignups,
        dailyPayments,
        assessmentStats,
        topCities,
        gradeDistribution,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/coupons
 */
export const getCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ success: true, coupons });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/admin/coupons
 */
export const createCoupon = async (req, res, next) => {
  try {
    const { code, discount, maxUses, expiresAt } = req.body;

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      discount,
      maxUses: maxUses || null,
      expiresAt: expiresAt || null,
    });

    res.status(201).json({ success: true, coupon });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/admin/coupons/:id
 */
export const deleteCoupon = async (req, res, next) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'تم حذف الكوبون' });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/settings
 */
export const getSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne({ key: 'global' });
    if (!settings) {
      settings = await Settings.create({ key: 'global' });
    }
    res.json({ success: true, settings });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/admin/settings
 */
export const updateSettings = async (req, res, next) => {
  try {
    const allowedFields = [
      'siteName', 'siteEmail', 'price', 'originalPrice', 'discount',
      'maxFreeMessages', 'requirePayment', 'emailNotifications', 'smsNotifications',
    ];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const settings = await Settings.findOneAndUpdate(
      { key: 'global' },
      updates,
      { new: true, upsert: true }
    );

    res.json({ success: true, settings, message: 'تم حفظ الإعدادات بنجاح' });
  } catch (error) {
    next(error);
  }
};
