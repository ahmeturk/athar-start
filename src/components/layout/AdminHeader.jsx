import { Menu, Bell } from 'lucide-react';

export default function AdminHeader({ title, onToggleSidebar }) {
  return (
    <header className="bg-white shadow-card h-16 flex items-center justify-between px-6 sticky top-0 z-20">
      {/* Right side: toggle + title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-gray-100 rounded-lg transition-all"
          aria-label="تبديل القائمة الجانبية"
        >
          <Menu className="h-5 w-5 text-gray-600" />
        </button>
        <h1 className="text-xl font-bold text-navy-500">{title}</h1>
      </div>

      {/* Left side: notifications + avatar */}
      <div className="flex items-center gap-4">
        <button
          className="relative p-2 hover:bg-gray-100 rounded-lg transition-all"
          aria-label="الإشعارات"
        >
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-navy-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
            م
          </div>
          <div className="hidden md:block">
            <div className="font-medium text-gray-800 text-sm">مدير النظام</div>
            <div className="text-xs text-gray-500">admin@athar.com</div>
          </div>
        </div>
      </div>
    </header>
  );
}
