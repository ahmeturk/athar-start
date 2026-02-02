import { TrendingUp, Users, BarChart3, PieChart } from 'lucide-react';

const riasecStats = [
  { code: 'R', name: 'واقعي', percentage: 18, color: 'bg-blue-500' },
  { code: 'I', name: 'بحثي', percentage: 22, color: 'bg-green-500' },
  { code: 'A', name: 'فني', percentage: 15, color: 'bg-purple-500' },
  { code: 'S', name: 'اجتماعي', percentage: 20, color: 'bg-yellow-500' },
  { code: 'E', name: 'مبادر', percentage: 14, color: 'bg-red-500' },
  { code: 'C', name: 'تقليدي', percentage: 11, color: 'bg-gray-500' },
];

const impactMetrics = [
  { label: 'وضوح المسار', before: 32, after: 78 },
  { label: 'الثقة بالقرار', before: 28, after: 82 },
  { label: 'معرفة الميول', before: 25, after: 85 },
  { label: 'معرفة سوق العمل', before: 20, after: 70 },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-navy-500">التحليلات</h2>

      {/* Top stats */}
      <div className="grid sm:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-card p-6 text-center">
          <p className="text-3xl font-bold text-navy-500">12,847</p>
          <p className="text-sm text-gray-500 mt-1">إجمالي المستخدمين</p>
        </div>
        <div className="bg-white rounded-2xl shadow-card p-6 text-center">
          <p className="text-3xl font-bold text-green-500">73%</p>
          <p className="text-sm text-gray-500 mt-1">معدل الإكمال</p>
        </div>
        <div className="bg-white rounded-2xl shadow-card p-6 text-center">
          <p className="text-3xl font-bold text-navy-500">4.8</p>
          <p className="text-sm text-gray-500 mt-1">متوسط التقييم</p>
        </div>
        <div className="bg-white rounded-2xl shadow-card p-6 text-center">
          <p className="text-3xl font-bold text-green-500">52%</p>
          <p className="text-sm text-gray-500 mt-1">تحسن الوعي المهني</p>
        </div>
      </div>

      {/* RIASEC distribution */}
      <div className="bg-white rounded-2xl shadow-card p-6">
        <h3 className="text-lg font-bold text-navy-500 mb-6 flex items-center gap-2">
          <PieChart className="h-5 w-5 text-green-500" />
          توزيع الأنماط المهنية (النمط الأول)
        </h3>
        <div className="space-y-4">
          {riasecStats.map((stat) => (
            <div key={stat.code} className="flex items-center gap-4">
              <span className="w-20 text-sm font-medium text-navy-500">
                {stat.name} ({stat.code})
              </span>
              <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden">
                <div
                  className={`h-full ${stat.color} rounded-lg flex items-center px-3 transition-all duration-500`}
                  style={{ width: `${stat.percentage * 4}%` }}
                >
                  <span className="text-white text-sm font-bold">{stat.percentage}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Impact measurement */}
      <div className="bg-white rounded-2xl shadow-card p-6">
        <h3 className="text-lg font-bold text-navy-500 mb-6 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-500" />
          قياس أثر البرنامج (قبل وبعد)
        </h3>
        <div className="space-y-6">
          {impactMetrics.map((metric) => (
            <div key={metric.label}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-navy-500">{metric.label}</span>
                <span className="text-sm text-green-500 font-bold">
                  +{metric.after - metric.before}%
                </span>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>قبل</span>
                    <span>{metric.before}%</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-red-300 rounded-full" style={{ width: `${metric.before}%` }} />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>بعد</span>
                    <span>{metric.after}%</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${metric.after}%` }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
