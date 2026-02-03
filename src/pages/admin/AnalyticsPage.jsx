import { useState, useEffect } from 'react';
import { TrendingUp, Users, PieChart, MapPin, GraduationCap, Loader2, RefreshCw } from 'lucide-react';
import { adminAPI } from '../../api/admin.js';

const gradeLabels = {
  'first-secondary': 'أول ثانوي',
  'second-secondary': 'ثاني ثانوي',
  'third-secondary': 'ثالث ثانوي',
  'university': 'جامعي',
  'graduate': 'خريج',
};

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [analyticsRes, dashRes] = await Promise.all([
        adminAPI.getAnalytics(),
        adminAPI.getDashboard(),
      ]);
      setData(analyticsRes.analytics);
      setDashboardStats(dashRes.stats);
    } catch (err) {
      setError(err.message || 'فشل في تحميل البيانات');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
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
        <button onClick={fetchData} className="flex items-center gap-2 bg-navy-500 text-white px-4 py-2 rounded-xl text-sm">
          <RefreshCw className="h-4 w-4" /> إعادة المحاولة
        </button>
      </div>
    );
  }

  const { dailySignups, dailyPayments, assessmentStats, topCities, gradeDistribution } = data;
  const stats = dashboardStats;

  // Map assessment stats
  const assessmentStatusMap = {};
  assessmentStats.forEach((s) => { assessmentStatusMap[s._id] = s.count; });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-navy-500">التحليلات</h2>
        <button onClick={fetchData} className="flex items-center gap-2 text-sm text-gray-500 hover:text-navy-500 transition-colors">
          <RefreshCw className="h-4 w-4" /> تحديث
        </button>
      </div>

      {/* Top stats */}
      <div className="grid sm:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-card p-6 text-center">
          <p className="text-3xl font-bold text-navy-500">{stats.totalUsers}</p>
          <p className="text-sm text-gray-500 mt-1">إجمالي المستخدمين</p>
        </div>
        <div className="bg-white rounded-2xl shadow-card p-6 text-center">
          <p className="text-3xl font-bold text-green-500">{stats.completionRate}%</p>
          <p className="text-sm text-gray-500 mt-1">معدل الإكمال</p>
        </div>
        <div className="bg-white rounded-2xl shadow-card p-6 text-center">
          <p className="text-3xl font-bold text-navy-500">{stats.totalAssessments}</p>
          <p className="text-sm text-gray-500 mt-1">إجمالي التقييمات</p>
        </div>
        <div className="bg-white rounded-2xl shadow-card p-6 text-center">
          <p className="text-3xl font-bold text-green-500">{stats.totalRevenue.toLocaleString('ar-SA')} <span className="text-base">ر.س</span></p>
          <p className="text-sm text-gray-500 mt-1">إجمالي الإيرادات</p>
        </div>
      </div>

      {/* Assessment status breakdown */}
      <div className="bg-white rounded-2xl shadow-card p-6">
        <h3 className="text-lg font-bold text-navy-500 mb-6 flex items-center gap-2">
          <PieChart className="h-5 w-5 text-green-500" />
          حالة التقييمات
        </h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{assessmentStatusMap['completed'] || 0}</p>
            <p className="text-sm text-green-700 mt-1">مكتمل</p>
          </div>
          <div className="bg-yellow-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">{assessmentStatusMap['in-progress'] || 0}</p>
            <p className="text-sm text-yellow-700 mt-1">قيد التقدم</p>
          </div>
          <div className="bg-red-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{assessmentStatusMap['abandoned'] || 0}</p>
            <p className="text-sm text-red-700 mt-1">متروك</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Daily signups chart */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <h3 className="text-lg font-bold text-navy-500 mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-green-500" />
            التسجيلات (آخر 30 يوم)
          </h3>
          {dailySignups.length === 0 ? (
            <p className="text-gray-400 text-center py-8">لا توجد بيانات بعد</p>
          ) : (
            <div className="space-y-2">
              {dailySignups.slice(-10).map((day) => {
                const maxCount = Math.max(...dailySignups.map((d) => d.count), 1);
                return (
                  <div key={day._id} className="flex items-center gap-3">
                    <span className="w-20 text-xs text-gray-500 shrink-0" dir="ltr">{day._id.slice(5)}</span>
                    <div className="flex-1 h-6 bg-gray-100 rounded-lg overflow-hidden">
                      <div
                        className="h-full bg-navy-500 rounded-lg flex items-center px-2 transition-all duration-500"
                        style={{ width: `${Math.max((day.count / maxCount) * 100, 8)}%` }}
                      >
                        <span className="text-white text-xs font-bold">{day.count}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Daily payments chart */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <h3 className="text-lg font-bold text-navy-500 mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            الإيرادات (آخر 30 يوم)
          </h3>
          {dailyPayments.length === 0 ? (
            <p className="text-gray-400 text-center py-8">لا توجد بيانات بعد</p>
          ) : (
            <div className="space-y-2">
              {dailyPayments.slice(-10).map((day) => {
                const maxRevenue = Math.max(...dailyPayments.map((d) => d.revenue), 1);
                return (
                  <div key={day._id} className="flex items-center gap-3">
                    <span className="w-20 text-xs text-gray-500 shrink-0" dir="ltr">{day._id.slice(5)}</span>
                    <div className="flex-1 h-6 bg-gray-100 rounded-lg overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-lg flex items-center px-2 transition-all duration-500"
                        style={{ width: `${Math.max((day.revenue / maxRevenue) * 100, 8)}%` }}
                      >
                        <span className="text-white text-xs font-bold">{day.revenue} ر.س</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top cities */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <h3 className="text-lg font-bold text-navy-500 mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-green-500" />
            أعلى المدن
          </h3>
          {topCities.length === 0 ? (
            <p className="text-gray-400 text-center py-8">لا توجد بيانات بعد</p>
          ) : (
            <div className="space-y-3">
              {topCities.map((city, i) => {
                const maxCount = topCities[0]?.count || 1;
                return (
                  <div key={city._id} className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-navy-100 rounded-full flex items-center justify-center text-xs font-bold text-navy-500">{i + 1}</span>
                    <span className="w-24 text-sm font-medium text-navy-500">{city._id}</span>
                    <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-navy-400 rounded-full"
                        style={{ width: `${(city.count / maxCount) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-500 w-8 text-left">{city.count}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Grade distribution */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <h3 className="text-lg font-bold text-navy-500 mb-4 flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-green-500" />
            توزيع المراحل الدراسية
          </h3>
          {gradeDistribution.length === 0 ? (
            <p className="text-gray-400 text-center py-8">لا توجد بيانات بعد</p>
          ) : (
            <div className="space-y-3">
              {gradeDistribution.map((grade) => {
                const maxCount = gradeDistribution[0]?.count || 1;
                const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-red-500'];
                const colorIdx = gradeDistribution.indexOf(grade) % colors.length;
                return (
                  <div key={grade._id} className="flex items-center gap-3">
                    <span className="w-24 text-sm font-medium text-navy-500">{gradeLabels[grade._id] || grade._id}</span>
                    <div className="flex-1 h-6 bg-gray-100 rounded-lg overflow-hidden">
                      <div
                        className={`h-full ${colors[colorIdx]} rounded-lg flex items-center px-2`}
                        style={{ width: `${Math.max((grade.count / maxCount) * 100, 10)}%` }}
                      >
                        <span className="text-white text-xs font-bold">{grade.count}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
