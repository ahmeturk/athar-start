import { Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import CheckoutPage from '../pages/CheckoutPage';
import AssessmentPage from '../pages/AssessmentPage';
import AdminLayout from '../components/layout/AdminLayout';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import DashboardPage from '../pages/admin/DashboardPage';
import UsersPage from '../pages/admin/UsersPage';
import ContentPage from '../pages/admin/ContentPage';
import StepsPage from '../pages/admin/StepsPage';
import PaymentsPage from '../pages/admin/PaymentsPage';
import AnalyticsPage from '../pages/admin/AnalyticsPage';
import SettingsPage from '../pages/admin/SettingsPage';
import CouponsPage from '../pages/admin/CouponsPage';

export default function AppRouter() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />

      {/* Auth-protected routes */}
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/assessment/*"
        element={
          <ProtectedRoute>
            <AssessmentPage />
          </ProtectedRoute>
        }
      />

      {/* Admin routes - require admin role */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="content" element={<ContentPage />} />
        <Route path="steps" element={<StepsPage />} />
        <Route path="payments" element={<PaymentsPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="coupons" element={<CouponsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* 404 fallback */}
      <Route
        path="*"
        element={
          <div dir="rtl" className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-navy-500 mb-4">404</h1>
              <p className="text-gray-600 mb-8">الصفحة غير موجودة</p>
              <a
                href="/"
                className="bg-green-500 text-white px-8 py-3 rounded-full hover:bg-green-600 transition-colors font-medium"
              >
                العودة للرئيسية
              </a>
            </div>
          </div>
        }
      />
    </Routes>
  );
}
