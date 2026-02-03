import { useState, useEffect, useCallback } from 'react';
import { Search, Download, Eye, UserX, UserCheck, Loader2, ChevronRight, ChevronLeft } from 'lucide-react';
import { adminAPI } from '../../api/admin.js';

const gradeLabels = {
  'first-secondary': 'أول ثانوي',
  'second-secondary': 'ثاني ثانوي',
  'third-secondary': 'ثالث ثانوي',
  'university': 'جامعي',
  'graduate': 'خريج',
};

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetail, setUserDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchUsers = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (search) params.search = search;
      const res = await adminAPI.getUsers(params);
      setUsers(res.users);
      setPagination(res.pagination);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
    setLoading(false);
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => fetchUsers(1), 300);
    return () => clearTimeout(timer);
  }, [search, fetchUsers]);

  const viewUser = async (userId) => {
    setSelectedUser(userId);
    setDetailLoading(true);
    try {
      const res = await adminAPI.getUserDetail(userId);
      setUserDetail(res);
    } catch (err) {
      console.error('Failed to fetch user detail:', err);
    }
    setDetailLoading(false);
  };

  const toggleActive = async (userId) => {
    try {
      const res = await adminAPI.toggleUserActive(userId);
      setUsers((prev) => prev.map((u) =>
        u._id === userId ? { ...u, isActive: res.isActive } : u
      ));
      if (userDetail?.user?.id === userId) {
        setUserDetail((prev) => ({ ...prev, user: { ...prev.user, isActive: res.isActive } }));
      }
    } catch (err) {
      console.error('Failed to toggle user:', err);
    }
  };

  const exportCSV = () => {
    if (users.length === 0) return;
    const headers = ['الاسم', 'البريد', 'الجوال', 'المرحلة', 'المدينة', 'مدفوع', 'نشط', 'تاريخ التسجيل'];
    const rows = users.map((u) => [
      u.name, u.email, u.phone || '-', gradeLabels[u.grade] || '-', u.city || '-',
      u.hasPaid ? 'نعم' : 'لا', u.isActive ? 'نعم' : 'لا',
      new Date(u.createdAt).toLocaleDateString('ar-SA'),
    ]);
    const csv = '\uFEFF' + [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `users_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-navy-500">إدارة المستخدمين</h2>
        <button onClick={exportCSV} className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition-colors text-sm font-medium">
          <Download className="h-4 w-4" />
          تصدير CSV
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-card p-4">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث بالاسم أو البريد..."
            className="w-full border border-gray-200 rounded-xl py-2.5 pr-10 pl-4 text-sm focus:outline-none focus:border-navy-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="h-6 w-6 text-navy-500 animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12 text-gray-400">لا يوجد مستخدمين</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 text-sm text-gray-500 font-medium">الاسم</th>
                    <th className="p-4 text-sm text-gray-500 font-medium">البريد</th>
                    <th className="p-4 text-sm text-gray-500 font-medium">المرحلة</th>
                    <th className="p-4 text-sm text-gray-500 font-medium">المدينة</th>
                    <th className="p-4 text-sm text-gray-500 font-medium">الدفع</th>
                    <th className="p-4 text-sm text-gray-500 font-medium">الحالة</th>
                    <th className="p-4 text-sm text-gray-500 font-medium">التاريخ</th>
                    <th className="p-4 text-sm text-gray-500 font-medium">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-medium text-navy-500">{user.name}</td>
                      <td className="p-4 text-gray-500 text-sm" dir="ltr">{user.email}</td>
                      <td className="p-4 text-sm text-gray-600">{gradeLabels[user.grade] || '-'}</td>
                      <td className="p-4 text-sm text-gray-600">{user.city || '-'}</td>
                      <td className="p-4">
                        <span className={`text-xs font-medium px-3 py-1 rounded-full ${user.hasPaid ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {user.hasPaid ? 'مدفوع' : 'غير مدفوع'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`text-xs font-medium px-3 py-1 rounded-full ${user.isActive ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                          {user.isActive ? 'نشط' : 'معطل'}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-500" dir="ltr">{new Date(user.createdAt).toLocaleDateString('ar-SA')}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button onClick={() => viewUser(user._id)} className="p-2 text-gray-400 hover:text-navy-500 hover:bg-gray-100 rounded-lg transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button onClick={() => toggleActive(user._id)} className={`p-2 rounded-lg transition-colors ${user.isActive ? 'text-gray-400 hover:text-red-500 hover:bg-red-50' : 'text-gray-400 hover:text-green-500 hover:bg-green-50'}`}>
                            {user.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
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
              <p className="text-sm text-gray-500">
                صفحة {pagination.page} من {pagination.pages} — إجمالي {pagination.total} مستخدم
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => fetchUsers(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => fetchUsers(p)}
                    className={`px-3 py-1.5 text-sm rounded-lg ${p === pagination.page ? 'bg-navy-500 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => fetchUsers(pagination.page + 1)}
                  disabled={pagination.page >= pagination.pages}
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* User detail modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => { setSelectedUser(null); setUserDetail(null); }}>
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            {detailLoading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-6 w-6 text-navy-500 animate-spin" />
              </div>
            ) : userDetail ? (
              <>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-navy-100 rounded-full flex items-center justify-center text-xl font-bold text-navy-500">
                    {userDetail.user.name?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-navy-500">{userDetail.user.name}</h3>
                    <p className="text-sm text-gray-400" dir="ltr">{userDetail.user.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500">الجوال</p>
                    <p className="font-medium text-navy-500 text-sm" dir="ltr">{userDetail.user.phone || '-'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500">المرحلة</p>
                    <p className="font-medium text-navy-500 text-sm">{gradeLabels[userDetail.user.grade] || '-'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500">المدينة</p>
                    <p className="font-medium text-navy-500 text-sm">{userDetail.user.city || '-'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500">الدفع</p>
                    <p className={`font-medium text-sm ${userDetail.user.hasPaid ? 'text-green-500' : 'text-gray-400'}`}>
                      {userDetail.user.hasPaid ? 'مدفوع' : 'غير مدفوع'}
                    </p>
                  </div>
                </div>

                {/* Assessments */}
                <h4 className="font-bold text-navy-500 mb-2">التقييمات ({userDetail.assessments.length})</h4>
                {userDetail.assessments.length === 0 ? (
                  <p className="text-gray-400 text-sm mb-4">لا يوجد تقييمات</p>
                ) : (
                  <div className="space-y-2 mb-4">
                    {userDetail.assessments.map((a) => (
                      <div key={a._id} className="bg-gray-50 rounded-xl p-3 flex items-center justify-between">
                        <div>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${a.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {a.status === 'completed' ? 'مكتمل' : 'قيد التقدم'}
                          </span>
                          {a.results?.hollandCode && (
                            <span className="text-xs font-mono text-navy-500 mr-2">({a.results.hollandCode})</span>
                          )}
                        </div>
                        <span className="text-xs text-gray-400" dir="ltr">{new Date(a.createdAt).toLocaleDateString('ar-SA')}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Payments */}
                <h4 className="font-bold text-navy-500 mb-2">المدفوعات ({userDetail.payments.length})</h4>
                {userDetail.payments.length === 0 ? (
                  <p className="text-gray-400 text-sm">لا يوجد مدفوعات</p>
                ) : (
                  <div className="space-y-2">
                    {userDetail.payments.map((p) => (
                      <div key={p._id} className="bg-gray-50 rounded-xl p-3 flex items-center justify-between">
                        <div>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${p.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {p.status === 'paid' ? 'مدفوع' : p.status}
                          </span>
                          <span className="text-sm font-bold text-navy-500 mr-2">{p.pricing?.total} ر.س</span>
                        </div>
                        <span className="text-xs text-gray-400" dir="ltr">{new Date(p.createdAt).toLocaleDateString('ar-SA')}</span>
                      </div>
                    ))}
                  </div>
                )}

                <button onClick={() => { setSelectedUser(null); setUserDetail(null); }} className="w-full mt-6 bg-gray-100 text-navy-500 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                  إغلاق
                </button>
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
