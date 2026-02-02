import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

const pageTitles = {
  dashboard: 'لوحة التحكم',
  users: 'إدارة المستخدمين',
  content: 'إدارة المحتوى',
  steps: 'خطوات البرنامج',
  payments: 'المدفوعات',
  analytics: 'التحليلات',
  settings: 'الإعدادات',
};

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const pathParts = location.pathname.split('/');
  const currentPage = pathParts[2] || 'dashboard';

  const handleToggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50">
      <AdminSidebar
        isOpen={sidebarOpen}
        onToggle={handleToggleSidebar}
      />

      <div
        className={clsx(
          'transition-all duration-300',
          sidebarOpen ? 'mr-64' : 'mr-20'
        )}
      >
        <AdminHeader
          title={pageTitles[currentPage] || 'لوحة التحكم'}
          onToggleSidebar={handleToggleSidebar}
        />

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
