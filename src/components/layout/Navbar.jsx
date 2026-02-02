import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { Menu, X, LogOut, User, LayoutDashboard } from 'lucide-react';
import Button from '../ui/Button';
import { useApp } from '../../context/AppContext';

const navLinks = [
  { id: 'features', label: 'المميزات' },
  { id: 'how-it-works', label: 'كيف يعمل' },
  { id: 'testimonials', label: 'آراء الطلاب' },
  { id: 'pricing', label: 'الأسعار' },
  { id: 'faq', label: 'الأسئلة الشائعة' },
];

export default function Navbar({ onLogin, onSignup, onScrollTo }) {
  const { user, isAuthenticated, isAdmin, logout } = useApp();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    if (!showUserMenu) return;
    const handleClick = () => setShowUserMenu(false);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [showUserMenu]);

  const handleNavClick = (id) => {
    setIsMenuOpen(false);
    onScrollTo?.(id);
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <nav
      className={clsx(
        'sticky top-0 z-40 transition-all duration-300 border-b border-gray-100',
        isScrolled
          ? 'bg-white shadow-md'
          : 'bg-white/95 backdrop-blur-md'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-navy-500 to-green-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm">
              أ
            </div>
            <span className="text-xl font-bold">
              <span className="text-navy-500">أثر</span>
              <span className="text-green-500"> البداية</span>
            </span>
          </div>

          {/* Center nav links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className="text-gray-600 hover:text-navy-500 transition-colors font-medium"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Left side actions */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              /* Authenticated user menu */
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowUserMenu(!showUserMenu);
                  }}
                  className="flex items-center gap-3 px-3 py-1.5 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-navy-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {user?.avatar || user?.name?.charAt(0) || 'م'}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-navy-500">{user?.name}</p>
                    <p className="text-xs text-gray-400">{user?.email}</p>
                  </div>
                </button>

                {showUserMenu && (
                  <div className="absolute left-0 top-full mt-2 w-56 bg-white rounded-xl shadow-modal border border-gray-100 py-2 animate-fadeIn z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-medium text-navy-500 text-sm">{user?.name}</p>
                      <p className="text-xs text-gray-400">{user?.email}</p>
                    </div>

                    {isAdmin && (
                      <button
                        onClick={() => { setShowUserMenu(false); navigate('/admin'); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <LayoutDashboard className="h-4 w-4 text-gray-400" />
                        لوحة التحكم
                      </button>
                    )}
                    <button
                      onClick={() => { setShowUserMenu(false); navigate('/assessment'); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User className="h-4 w-4 text-gray-400" />
                      البرنامج
                    </button>
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      تسجيل الخروج
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Guest actions */
              <>
                <button
                  onClick={onLogin}
                  className="text-navy-500 hover:text-green-500 transition-colors font-medium px-4 py-2"
                >
                  تسجيل الدخول
                </button>
                <Button onClick={onSignup} size="sm">
                  ابدأ الآن
                </Button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label={isMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t animate-fadeIn">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className="text-gray-600 py-3 text-right hover:bg-gray-50 px-4 rounded-lg transition-colors"
                >
                  {link.label}
                </button>
              ))}
              <hr className="my-2" />

              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-2">
                    <div className="w-9 h-9 bg-gradient-to-br from-navy-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {user?.avatar || 'م'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-navy-500">{user?.name}</p>
                      <p className="text-xs text-gray-400">{user?.email}</p>
                    </div>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => { setIsMenuOpen(false); navigate('/admin'); }}
                      className="text-navy-500 py-3 text-right px-4 font-medium hover:bg-gray-50 rounded-lg"
                    >
                      لوحة التحكم
                    </button>
                  )}
                  <button
                    onClick={() => { setIsMenuOpen(false); navigate('/assessment'); }}
                    className="text-navy-500 py-3 text-right px-4 font-medium hover:bg-gray-50 rounded-lg"
                  >
                    البرنامج
                  </button>
                  <button
                    onClick={() => { setIsMenuOpen(false); handleLogout(); }}
                    className="text-red-500 py-3 text-right px-4 font-medium hover:bg-red-50 rounded-lg"
                  >
                    تسجيل الخروج
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { setIsMenuOpen(false); onLogin?.(); }}
                    className="text-navy-500 py-3 text-right px-4 font-medium"
                  >
                    تسجيل الدخول
                  </button>
                  <div className="px-4">
                    <Button
                      onClick={() => { setIsMenuOpen(false); onSignup?.(); }}
                      className="w-full"
                    >
                      ابدأ الآن
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
