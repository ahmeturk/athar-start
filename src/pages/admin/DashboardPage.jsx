import { useState, useEffect } from 'react';
import { Users, CreditCard, TrendingUp, FileText, Loader2, RefreshCw } from 'lucide-react';
import { adminAPI } from '../../api/admin.js';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminAPI.getDashboard();
      setData(res);
    } catch (err) {
      setError(err.message || 'فشل في تحميل البيانات');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-navy-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-red-500">{error}</p>
        <button onClick={fetchDashboard} className="flex items-center gap-2 bg-navy-500 text-white px-4 py-2 rounded-xl text-sm">
          <RefreshCw className="h-4 w-4" /> إعادة المحاولة
        </button>
      </div>
    );
  }

  const { stats, recentUsers, recentPayments } = data;

  const statCards = [
    { title: 'إجمالي المستخدمين', value: stats.totalUsers.toLocaleString('ar-SA'), icon: Users, color: 'from-navy-500 to-navy-600' },
    { title: 'الإيرادات', value: `${stats.totalRevenue.toLocaleString('ar-SA')} ر.س`, icon: CreditCard, color: 'from-green-500 to-green-600' },
    { title: 'معدل الإكمال', value: `${stats.completionRate}%`, icon: TrendingUp, color: 'from-blue-500 to-blue-600' },
    { title: 'التقييمات المكتملة', value: stats.completedAssessments.toLocaleString('ar-SA'), icon: FileText, color: 'from-purple-500 to-purple-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button onClick={fetchDashboard} className="flex items-center gap-2 text-sm text-gray-500 hover:text-navy-500 transition-colors">
          <RefreshCw className="h-4 w-4" /> تحديث
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <div key={card.title} className="bg-white rounded-2xl shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold text-navy-500">{card.value}</p>
            <p className="text-sm text-gray-500 mt-1">{card.title}</p>
          </div>
        ))}
      </div>

      {/* Recent users & payments */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent users */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <h3 className="text-lg font-bold text-navy-500 mb-4">آخر المستخدمين</h3>
          {recentUsers.length === 0 ? (
            <p className="text-gray-400 text-center py-8">لا يوجد مستخدمين بعد</p>
          ) : (
            <div className="space-y-3">
              {recentUsers.map((user) => (
                <div key={user._id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-navy-100 rounded-full flex items-center justify-center text-sm font-bold text-navy-500">
                      {user.name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <p className="font-medium text-navy-500 text-sm">{user.name}</p>
                      <p className="text-xs text-gray-400" dir="ltr">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${user.hasPaid ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {user.hasPaid ? 'مدفوع' : 'غير مدفوع'}
                    </span>
                    <p className="text-xs text-gray-400 mt-1" dir="ltr">
                      {new Date(user.createdAt).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent payments */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <h3 className="text-lg font-bold text-navy-500 mb-4">آخر المدفوعات</h3>
          {recentPayments.length === 0 ? (
            <p className="text-gray-400 text-center py-8">لا يوجد مدفوعات بعد</p>
          ) : (
            <div className="space-y-3">
              {recentPayments.map((payment) => (
                <div key={payment._id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-navy-500 text-sm">{payment.user?.name || 'مستخدم'}</p>
                      <p className="text-xs text-gray-400">{payment.method}</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-green-500 text-sm">{payment.pricing?.total} ر.س</p>
                    <p className="text-xs text-gray-400" dir="ltr">
                      {new Date(payment.createdAt).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Summary row */}
      <div className="grid sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-card p-6 text-center">
          <p className="text-3xl font-bold text-navy-500">{stats.totalAssessments}</p>
          <p className="text-sm text-gray-500 mt-1">إجمالي التقييمات</p>
        </div>
        <div className="bg-white rounded-2xl shadow-card p-6 text-center">
          <p className="text-3xl font-bold text-green-500">{stats.completionRate}%</p>
          <p className="text-sm text-gray-500 mt-1">معدل الإكمال</p>
        </div>
        <div className="bg-white rounded-2xl shadow-card p-6 text-center">
          <p className="text-3xl font-bold text-navy-500">{stats.totalPayments}</p>
          <p className="text-sm text-gray-500 mt-1">عمليات الدفع الناجحة</p>
        </div>
      </div>
    </div>
  );
}
