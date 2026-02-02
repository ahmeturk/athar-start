import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

/**
 * ProtectedRoute - guards routes that require authentication.
 * @param {boolean} requireAdmin - if true, only admin users can access
 */
export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, isAdmin } = useApp();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to home with a state so we can show login modal
    return <Navigate to="/" state={{ from: location, showLogin: true }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div dir="rtl" className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white rounded-3xl shadow-card p-12 max-w-md">
          <div className="w-16 h-16 mx-auto bg-red-50 rounded-full flex items-center justify-center mb-6">
            <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-navy-500 mb-3">غير مصرح</h2>
          <p className="text-gray-600 mb-6">ليس لديك صلاحية للوصول لهذه الصفحة.</p>
          <a
            href="/"
            className="inline-block bg-green-500 text-white px-8 py-3 rounded-full hover:bg-green-600 transition-colors font-medium"
          >
            العودة للرئيسية
          </a>
        </div>
      </div>
    );
  }

  return children;
}
