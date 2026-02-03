import clsx from 'clsx';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Video,
  ListOrdered,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Tag,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const navItems = [
  { id: 'dashboard', path: '/admin/dashboard', icon: LayoutDashboard, label: 'لوحة التحكم' },
  { id: 'users', path: '/admin/users', icon: Users, label: 'المستخدمين' },
  { id: 'content', path: '/admin/content', icon: Video, label: 'المحتوى' },
  { id: 'steps', path: '/admin/steps', icon: ListOrdered, label: 'خطوات البرنامج' },
  { id: 'payments', path: '/admin/payments', icon: CreditCard, label: 'المدفوعات' },
  { id: 'analytics', path: '/admin/analytics', icon: BarChart3, label: 'التحليلات' },
  { id: 'coupons', path: '/admin/coupons', icon: Tag, label: 'الكوبونات' },
  { id: 'settings', path: '/admin/settings', icon: Settings, label: 'الإعدادات' },
];

export default function AdminSidebar({ isOpen, onToggle }) {
  const { logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside
      className={clsx(
        'fixed top-0 right-0 h-full bg-navy-800 text-white z-30 transition-all duration-300 flex flex-col',
        isOpen ? 'w-64' : 'w-20'
      )}
    >
      {/* Logo */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-navy-500 to-green-500 rounded-xl flex items-center justify-center text-white font-bold shadow-md flex-shrink-0">
            أ
          </div>
          {isOpen && (
            <span className="font-bold text-lg whitespace-nowrap">
              لوحة التحكم
            </span>
          )}
        </div>
      </div>

      {/* Navigation with NavLink */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.id}
              to={item.path}
              end={item.id === 'dashboard'}
              className={({ isActive }) =>
                clsx(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
                  isActive
                    ? 'bg-white/10 text-green-400 shadow-md'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                )
              }
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {isOpen && (
                <span className="font-medium whitespace-nowrap">
                  {item.label}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom: Logout + Collapse */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {isOpen && <span className="font-medium whitespace-nowrap">تسجيل الخروج</span>}
        </button>
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all"
          aria-label={isOpen ? 'طي القائمة' : 'توسيع القائمة'}
        >
          {isOpen ? (
            <>
              <ChevronRight className="h-5 w-5" />
              <span className="font-medium">طي القائمة</span>
            </>
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>
    </aside>
  );
}
