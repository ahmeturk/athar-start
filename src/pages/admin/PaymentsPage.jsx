import { useState, useEffect } from 'react';
import { CreditCard, Download, Loader2, ChevronRight, ChevronLeft } from 'lucide-react';
import { adminAPI } from '../../api/admin.js';

const methodLabels = { visa: 'فيزا', mada: 'مدى', applepay: 'أبل باي', stcpay: 'STC Pay' };
const statusLabels = { paid: 'مكتمل', pending: 'معلق', failed: 'فشل', refunded: 'مسترد' };
const statusColors = {
  paid: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  failed: 'bg-red-100 text-red-700',
  refunded: 'bg-orange-100 text-orange-700',
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchPayments = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (statusFilter) params.status = statusFilter;
      const res = await adminAPI.getPayments(params);
      setPayments(res.payments);
      setPagination(res.pagination);
    } catch (err) {
      console.error('Failed to fetch payments:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPayments(1);
  }, [statusFilter]);

  // Calculate summary from current page data
  const totalRevenue = payments.filter((p) => p.status === 'paid').reduce((sum, p) => sum + (p.pricing?.total || 0), 0);
  const totalRefunded = payments.filter((p) => p.status === 'refunded').reduce((sum, p) => sum + (p.pricing?.total || 0), 0);
  const paidCount = payments.filter((p) => p.status === 'paid').length;

  const exportCSV = () => {
    if (payments.length === 0) return;
    const headers = ['رقم العملية', 'العميل', 'البريد', 'المبلغ', 'طريقة الدفع', 'الحالة', 'كوبون', 'التاريخ'];
    const rows = payments.map((p) => [
      p._id, p.user?.name || '-', p.user?.email || '-',
      p.pricing?.total || p.amount, methodLabels[p.method] || p.method,
      statusLabels[p.status] || p.status, p.pricing?.couponCode || '-',
      new Date(p.createdAt).toLocaleDateString('ar-SA'),
    ]);
    const csv = '\uFEFF' + [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `payments_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-navy-500">المدفوعات</h2>
        <button onClick={exportCSV} className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition-colors text-sm font-medium">
          <Download className="h-4 w-4" />
          تصدير
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-card p-6">
          <p className="text-sm text-gray-500 mb-1">الإيرادات (هذه الصفحة)</p>
          <p className="text-2xl font-bold text-navy-500">{totalRevenue.toLocaleString('ar-SA')} ر.س</p>
        </div>
        <div className="bg-white rounded-2xl shadow-card p-6">
          <p className="text-sm text-gray-500 mb-1">عمليات مكتملة</p>
          <p className="text-2xl font-bold text-green-500">{paidCount}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-card p-6">
          <p className="text-sm text-gray-500 mb-1">المسترد</p>
          <p className="text-2xl font-bold text-red-500">{totalRefunded.toLocaleString('ar-SA')} ر.س</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {[
          { value: '', label: 'الكل' },
          { value: 'paid', label: 'مكتمل' },
          { value: 'pending', label: 'معلق' },
          { value: 'refunded', label: 'مسترد' },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              statusFilter === f.value ? 'bg-navy-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 shadow-card'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="h-6 w-6 text-navy-500 animate-spin" />
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-12 text-gray-400">لا يوجد مدفوعات</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 text-sm text-gray-500 font-medium">العميل</th>
                    <th className="p-4 text-sm text-gray-500 font-medium">المبلغ</th>
                    <th className="p-4 text-sm text-gray-500 font-medium">طريقة الدفع</th>
                    <th className="p-4 text-sm text-gray-500 font-medium">كوبون</th>
                    <th className="p-4 text-sm text-gray-500 font-medium">الحالة</th>
                    <th className="p-4 text-sm text-gray-500 font-medium">التاريخ</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p._id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <p className="font-medium text-navy-500">{p.user?.name || 'مستخدم'}</p>
                        <p className="text-xs text-gray-400" dir="ltr">{p.user?.email}</p>
                      </td>
                      <td className="p-4 text-sm text-navy-500 font-bold">{p.pricing?.total || p.amount} ر.س</td>
                      <td className="p-4 text-sm text-gray-600">{methodLabels[p.method] || p.method}</td>
                      <td className="p-4 text-sm text-gray-600 font-mono">{p.pricing?.couponCode || '-'}</td>
                      <td className="p-4">
                        <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColors[p.status] || 'bg-gray-100 text-gray-500'}`}>
                          {statusLabels[p.status] || p.status}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-500" dir="ltr">{new Date(p.createdAt).toLocaleDateString('ar-SA')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-gray-100 flex items-center justify-between">
              <p className="text-sm text-gray-500">صفحة {pagination.page} من {pagination.pages} — إجمالي {pagination.total}</p>
              <div className="flex gap-2">
                <button onClick={() => fetchPayments(pagination.page - 1)} disabled={pagination.page <= 1} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg disabled:opacity-30">
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button onClick={() => fetchPayments(pagination.page + 1)} disabled={pagination.page >= pagination.pages} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg disabled:opacity-30">
                  <ChevronLeft className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
