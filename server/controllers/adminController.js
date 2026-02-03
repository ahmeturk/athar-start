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
      Assessment.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      User.aggregate([
        { $match: { city: { $ne: '' } } },
        { $group: { _id: '$city', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
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

// ============================================
// SETTINGS ENDPOINTS
// ============================================

/**
 * GET /api/admin/settings
 */
export const getSettings = async (req, res, next) => {
  try {
    const settings = await Settings.getSettings();
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
      'siteName', 'siteEmail', 'phone', 'whatsapp',
      'originalPrice', 'salePrice', 'discountPercent', 'vatRate', 'requirePayment',
      'maxFreeMessages', 'aiModel', 'aiSystemPrompt',
      'emailNotifications', 'smsNotifications',
    ];

    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const settings = await Settings.findByIdAndUpdate(
      'app-settings',
      { $set: updates },
      { new: true, upsert: true }
    );

    res.json({ success: true, settings, message: 'تم حفظ الإعدادات' });
  } catch (error) {
    next(error);
  }
};

// ============================================
// STEPS MANAGEMENT
// ============================================

/**
 * GET /api/admin/steps
 */
export const getSteps = async (req, res, next) => {
  try {
    const settings = await Settings.getSettings();
    res.json({ success: true, steps: settings.assessmentSteps });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/admin/steps
 * Body: { steps: [...] } - full array of steps with order
 */
export const updateSteps = async (req, res, next) => {
  try {
    const { steps } = req.body;
    if (!Array.isArray(steps)) {
      return res.status(400).json({ success: false, message: 'خطأ في البيانات' });
    }

    const settings = await Settings.findByIdAndUpdate(
      'app-settings',
      { $set: { assessmentSteps: steps } },
      { new: true, upsert: true }
    );

    res.json({ success: true, steps: settings.assessmentSteps, message: 'تم تحديث الخطوات' });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/admin/steps/:stepId/toggle
 */
export const toggleStep = async (req, res, next) => {
  try {
    const { stepId } = req.params;
    const settings = await Settings.getSettings();

    const step = settings.assessmentSteps.find(s => s.id === stepId);
    if (!step) {
      return res.status(404).json({ success: false, message: 'الخطوة غير موجودة' });
    }

    step.enabled = !step.enabled;
    await settings.save();

    res.json({ success: true, step, message: step.enabled ? 'تم تفعيل الخطوة' : 'تم تعطيل الخطوة' });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/admin/steps/:stepId
 * Body: { name, config }
 */
export const updateStep = async (req, res, next) => {
  try {
    const { stepId } = req.params;
    const { name, config } = req.body;
    const settings = await Settings.getSettings();

    const step = settings.assessmentSteps.find(s => s.id === stepId);
    if (!step) {
      return res.status(404).json({ success: false, message: 'الخطوة غير موجودة' });
    }

    if (name) step.name = name;
    if (config) step.config = config;
    await settings.save();

    res.json({ success: true, step, message: 'تم تحديث الخطوة' });
  } catch (error) {
    next(error);
  }
};

// ============================================
// VIDEOS MANAGEMENT
// ============================================

/**
 * GET /api/admin/videos
 */
export const getVideos = async (req, res, next) => {
  try {
    const settings = await Settings.getSettings();
    res.json({ success: true, videos: settings.videos });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/admin/videos
 */
export const createVideo = async (req, res, next) => {
  try {
    const { videoId, title, description, youtubeUrl, duration, type } = req.body;
    const settings = await Settings.getSettings();

    const maxOrder = settings.videos.reduce((max, v) => Math.max(max, v.order || 0), 0);

    settings.videos.push({
      videoId: videoId || `video-${Date.now()}`,
      title,
      description,
      youtubeUrl: youtubeUrl || '',
      duration: duration || '',
      type: type || 'توجيهي',
      order: maxOrder + 1,
      isActive: true,
    });

    await settings.save();
    res.status(201).json({ success: true, videos: settings.videos, message: 'تم إضافة الفيديو' });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/admin/videos/:videoId
 */
export const updateVideo = async (req, res, next) => {
  try {
    const { videoId } = req.params;
    const { title, description, youtubeUrl, duration, type, isActive } = req.body;
    const settings = await Settings.getSettings();

    const video = settings.videos.find(v => v.videoId === videoId);
    if (!video) {
      return res.status(404).json({ success: false, message: 'الفيديو غير موجود' });
    }

    if (title !== undefined) video.title = title;
    if (description !== undefined) video.description = description;
    if (youtubeUrl !== undefined) video.youtubeUrl = youtubeUrl;
    if (duration !== undefined) video.duration = duration;
    if (type !== undefined) video.type = type;
    if (isActive !== undefined) video.isActive = isActive;

    await settings.save();
    res.json({ success: true, video, message: 'تم تحديث الفيديو' });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/admin/videos/:videoId
 */
export const deleteVideo = async (req, res, next) => {
  try {
    const { videoId } = req.params;
    const settings = await Settings.getSettings();

    settings.videos = settings.videos.filter(v => v.videoId !== videoId);
    await settings.save();

    res.json({ success: true, message: 'تم حذف الفيديو' });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/admin/videos/reorder
 */
export const reorderVideos = async (req, res, next) => {
  try {
    const { videos } = req.body;
    if (!Array.isArray(videos)) {
      return res.status(400).json({ success: false, message: 'خطأ في البيانات' });
    }

    const settings = await Settings.getSettings();
    settings.videos = videos;
    await settings.save();

    res.json({ success: true, videos: settings.videos, message: 'تم إعادة ترتيب الفيديوهات' });
  } catch (error) {
    next(error);
  }
};
