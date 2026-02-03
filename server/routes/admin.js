import { Router } from 'express';
import {
  getDashboard,
  getUsers,
  getUserDetail,
  toggleUserActive,
  getPayments,
  getAnalytics,
  getCoupons,
  createCoupon,
  deleteCoupon,
  getSettings,
  updateSettings,
  getSteps,
  updateSteps,
  toggleStep,
  updateStep,
  getVideos,
  createVideo,
  updateVideo,
  deleteVideo,
  reorderVideos,
} from '../controllers/adminController.js';
import { protect, requireAdmin } from '../middleware/auth.js';

const router = Router();

// All admin routes require authentication + admin role
router.use(protect, requireAdmin);

// Dashboard
router.get('/dashboard', getDashboard);

// Users
router.get('/users', getUsers);
router.get('/users/:id', getUserDetail);
router.put('/users/:id/toggle-active', toggleUserActive);

// Payments
router.get('/payments', getPayments);

// Analytics
router.get('/analytics', getAnalytics);

// Coupons
router.get('/coupons', getCoupons);
router.post('/coupons', createCoupon);
router.delete('/coupons/:id', deleteCoupon);

// Settings
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

// Assessment Steps
router.get('/steps', getSteps);
router.put('/steps', updateSteps);
router.put('/steps/:stepId/toggle', toggleStep);
router.put('/steps/:stepId', updateStep);

// Videos
router.get('/videos', getVideos);
router.post('/videos', createVideo);
router.put('/videos/reorder', reorderVideos);
router.put('/videos/:videoId', updateVideo);
router.delete('/videos/:videoId', deleteVideo);

export default router;
