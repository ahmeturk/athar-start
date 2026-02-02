import { useState } from 'react';
import { Search, Filter, Download, Eye, Trash2 } from 'lucide-react';

const mockUsers = [
  { id: 1, name: 'محمد الشمري', email: 'mohammed@email.com', phone: '0512345678', grade: 'ثالث ثانوي', city: 'الرياض', status: 'مكتمل', hollandCode: 'RIA', date: '2025-01-15' },
  { id: 2, name: 'سارة العتيبي', email: 'sarah@email.com', phone: '0523456789', grade: 'ثاني ثانوي', city: 'جدة', status: 'قيد التقدم', hollandCode: '-', date: '2025-01-15' },
  { id: 3, name: 'عبدالله القحطاني', email: 'abdullah@email.com', phone: '0534567890', grade: 'سنة تحضيرية', city: 'الدمام', status: 'جديد', hollandCode: '-', date: '2025-01-14' },
  { id: 4, name: 'نورة الدوسري', email: 'noura@email.com', phone: '0545678901', grade: 'ثالث ثانوي', city: 'مكة', status: 'مكتمل', hollandCode: 'SEC', date: '2025-01-14' },
  { id: 5, name: 'فهد المطيري', email: 'fahad@email.com', phone: '0556789012', grade: 'أول ثانوي', city: 'الرياض', status: 'قيد التقدم', hollandCode: '-', date: '2025-01-13' },
];

const statusColors = {
  'مكتمل': 'bg-green-100 text-green-700',
  'قيد التقدم': 'bg-yellow-100 text-yellow-700',
  'جديد': 'bg-blue-100 text-blue-700',
};

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filtered = mockUsers.filter((u) => {
    const matchSearch = u.name.includes(search) || u.email.includes(search);
    const matchStatus = !statusFilter || u.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-navy-500">إدارة المستخدمين</h2>
        <button className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition-colors text-sm font-medium">
          <Download className="h-4 w-4" />
          تصدير CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-card p-4 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث بالاسم أو البريد..."
            className="w-full border border-gray-200 rounded-xl py-2.5 pr-10 pl-4 text-sm form-input"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-xl py-2.5 px-4 text-sm bg-white"
        >
          <option value="">كل الحالات</option>
          <option value="جديد">جديد</option>
          <option value="قيد التقدم">قيد التقدم</option>
          <option value="مكتمل">مكتمل</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-sm text-gray-500 font-medium">الاسم</th>
                <th className="p-4 text-sm text-gray-500 font-medium">البريد</th>
                <th className="p-4 text-sm text-gray-500 font-medium">المرحلة</th>
                <th className="p-4 text-sm text-gray-500 font-medium">المدينة</th>
                <th className="p-4 text-sm text-gray-500 font-medium">الحالة</th>
                <th className="p-4 text-sm text-gray-500 font-medium">الكود</th>
                <th className="p-4 text-sm text-gray-500 font-medium">التاريخ</th>
                <th className="p-4 text-sm text-gray-500 font-medium">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-navy-500">{user.name}</td>
                  <td className="p-4 text-gray-500 text-sm" dir="ltr">{user.email}</td>
                  <td className="p-4 text-sm text-gray-600">{user.grade}</td>
                  <td className="p-4 text-sm text-gray-600">{user.city}</td>
                  <td className="p-4">
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColors[user.status]}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm font-mono text-navy-500">{user.hollandCode}</td>
                  <td className="p-4 text-sm text-gray-500" dir="ltr">{user.date}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button className="p-2 text-gray-400 hover:text-navy-500 hover:bg-gray-100 rounded-lg transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">عرض {filtered.length} من {mockUsers.length}</p>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-sm bg-navy-500 text-white rounded-lg">1</button>
            <button className="px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100 rounded-lg">2</button>
            <button className="px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100 rounded-lg">3</button>
          </div>
        </div>
      </div>
    </div>
  );
}
