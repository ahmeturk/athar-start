import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Spinner from '../ui/Spinner';
import { useApp } from '../../context/AppContext';

function GoogleIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 001 12c0 1.77.42 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

export default function LoginModal({ onClose, onSwitchToSignup }) {
  const navigate = useNavigate();
  const { loginWithEmail, loginWithGoogle, authLoading, showNotification } = useApp();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صحيح';
    }
    if (!formData.password) {
      newErrors.password = 'كلمة المرور مطلوبة';
    } else if (formData.password.length < 6) {
      newErrors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validateForm()) return;

    const result = await loginWithEmail(formData.email, formData.password);
    if (result.success) {
      showNotification(`مرحباً ${result.user.name}!`);
      onClose();
      navigate(result.redirect);
    } else {
      setServerError(result.error);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setServerError('');
    const result = await loginWithGoogle();
    setGoogleLoading(false);
    if (result.success) {
      showNotification(`مرحباً ${result.user.name}!`);
      onClose();
      navigate(result.redirect);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
    if (serverError) setServerError('');
  };

  const isLoading = authLoading || googleLoading;

  return (
    <Modal onClose={onClose}>
      <div className="p-8 pt-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-navy-500 to-green-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg">
            أ
          </div>
          <h2 className="text-2xl font-bold text-navy-500">تسجيل الدخول</h2>
          <p className="text-gray-500 mt-1">أهلاً بعودتك!</p>
        </div>

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 py-3.5 border-2 border-gray-200 rounded-xl font-medium text-navy-500 hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-60 disabled:cursor-not-allowed mb-6"
        >
          {googleLoading ? (
            <Spinner size="sm" />
          ) : (
            <GoogleIcon className="h-5 w-5" />
          )}
          <span>الدخول عبر Google</span>
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-sm text-gray-400">أو</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Server error */}
        {serverError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 text-center">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="البريد الإلكتروني"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="example@email.com"
            dir="ltr"
            error={errors.email}
          />

          <div className="relative">
            <Input
              label="كلمة المرور"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              placeholder="••••••••"
              error={errors.password}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-3 top-[38px] text-gray-400 hover:text-gray-600 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div
                className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all ${
                  rememberMe ? 'bg-green-500 border-green-500' : 'border-gray-300 group-hover:border-green-500'
                }`}
                onClick={() => setRememberMe(!rememberMe)}
                role="checkbox"
                aria-checked={rememberMe}
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setRememberMe(!rememberMe); } }}
              >
                {rememberMe && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="text-gray-600">تذكرني</span>
            </label>
            <button type="button" className="text-green-500 hover:underline font-medium">
              نسيت كلمة المرور؟
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {authLoading && !googleLoading ? (
              <>
                <Spinner size="sm" className="border-white border-t-transparent" />
                <span>جاري الدخول...</span>
              </>
            ) : (
              'دخول'
            )}
          </button>
        </form>

        {/* Admin hint */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-400">
            للدخول كمدير: admin@athar.com / admin123
          </p>
        </div>

        <div className="mt-6 text-center">
          <span className="text-gray-500">ليس لديك حساب؟</span>
          <button
            onClick={onSwitchToSignup}
            className="text-green-500 font-medium mr-2 hover:underline"
          >
            سجّل الآن
          </button>
        </div>
      </div>
    </Modal>
  );
}
