import { Users, CreditCard, TrendingUp, FileText, ArrowUp, ArrowDown } from 'lucide-react';

const statCards = [
  { title: 'إجمالي المستخدمين', value: '12,847', change: '+12%', icon: Users, up: true, color: 'from-navy-500 to-navy-600' },
  { title: 'الإيرادات الشهرية', value: '45,200 ر.س', change: '+8%', icon: CreditCard, up: true, color: 'from-green-500 to-green-600' },
  { title: 'معدل الإكمال', value: '73%', change: '+5%', icon: TrendingUp, up: true, color: 'from-blue-500 to-blue-600' },
  { title: 'التقارير المولّدة', value: '9,312', change: '-2%', icon: FileText, up: false, color: 'from-purple-500 to-purple-600' },
];

const recentUsers = [
  { name: 'محمد الشمري', email: 'mohammed@email.com', status: 'مكتمل', date: '2025-01-15' },
  { name: 'سارة العتيبي', email: 'sarah@email.com', status: 'قيد التقدم', date: '2025-01-15' },
  { name: 'عبدالله القحطاني', email: 'abdullah@email.com', status: 'جديد', date: '2025-01-14' },
  { name: 'نورة الدوسري', email: 'noura@email.com', status: 'مكتمل', date: '2025-01-14' },
  { name: 'فهد المطيري', email: 'fahad@email.com', status: 'قيد التقدم', date: '2025-01-13' },
];

const statusColors = {
  'مكتمل': 'bg-green-100 text-green-700',
  'قيد التقدم': 'bg-yellow-100 text-yellow-700',
  'جديد': 'bg-blue-100 text-blue-700',
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <div key={card.title} className="bg-white rounded-2xl shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
              <span className={`inline-flex items-center gap-1 text-sm font-medium ${card.up ? 'text-green-500' : 'text-red-500'}`}>
                {card.up ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />}
                {card.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-navy-500">{card.value}</p>
            <p className="text-sm text-gray-500 mt-1">{card.title}</p>
          </div>
        ))}
      </div>

      {/* Recent users table */}
      <div className="bg-white rounded-2xl shadow-card p-6">
        <h3 className="text-lg font-bold text-navy-500 mb-4">آخر المستخدمين</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-3 text-sm text-gray-500 font-medium">الاسم</th>
                <th className="pb-3 text-sm text-gray-500 font-medium">البريد</th>
                <th className="pb-3 text-sm text-gray-500 font-medium">الحالة</th>
                <th className="pb-3 text-sm text-gray-500 font-medium">التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((user) => (
                <tr key={user.email} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-3 font-medium text-navy-500">{user.name}</td>
                  <td className="py-3 text-gray-500 text-sm" dir="ltr">{user.email}</td>
                  <td className="py-3">
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColors[user.status]}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 text-gray-500 text-sm" dir="ltr">{user.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick chart placeholder */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-card p-6">
          <h3 className="text-lg font-bold text-navy-500 mb-4">التسجيلات الشهرية</h3>
          <div className="h-48 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
            الرسم البياني سيظهر هنا
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-card p-6">
          <h3 className="text-lg font-bold text-navy-500 mb-4">توزيع الأنماط المهنية</h3>
          <div className="h-48 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
            الرسم البياني سيظهر هنا
          </div>
        </div>
      </div>
    </div>
  );
}
