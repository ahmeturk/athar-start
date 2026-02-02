import { CreditCard, Search, Download } from 'lucide-react';

const mockPayments = [
  { id: 'PAY-001', name: 'محمد الشمري', amount: '139', method: 'فيزا', status: 'مكتمل', date: '2025-01-15' },
  { id: 'PAY-002', name: 'سارة العتيبي', amount: '139', method: 'مدى', status: 'مكتمل', date: '2025-01-15' },
  { id: 'PAY-003', name: 'عبدالله القحطاني', amount: '139', method: 'أبل باي', status: 'معلق', date: '2025-01-14' },
  { id: 'PAY-004', name: 'نورة الدوسري', amount: '139', method: 'فيزا', status: 'مكتمل', date: '2025-01-14' },
  { id: 'PAY-005', name: 'فهد المطيري', amount: '139', method: 'مدى', status: 'مسترد', date: '2025-01-13' },
];

const statusColors = {
  'مكتمل': 'bg-green-100 text-green-700',
  'معلق': 'bg-yellow-100 text-yellow-700',
  'مسترد': 'bg-red-100 text-red-700',
};

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-navy-500">المدفوعات</h2>
        <button className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition-colors text-sm font-medium">
          <Download className="h-4 w-4" />
          تصدير
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-card p-6">
          <p className="text-sm text-gray-500 mb-1">الإيرادات الإجمالية</p>
          <p className="text-2xl font-bold text-navy-500">556 ر.س</p>
        </div>
        <div className="bg-white rounded-2xl shadow-card p-6">
          <p className="text-sm text-gray-500 mb-1">هذا الشهر</p>
          <p className="text-2xl font-bold text-green-500">278 ر.س</p>
        </div>
        <div className="bg-white rounded-2xl shadow-card p-6">
          <p className="text-sm text-gray-500 mb-1">المسترد</p>
          <p className="text-2xl font-bold text-red-500">139 ر.س</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-sm text-gray-500 font-medium">رقم العملية</th>
                <th className="p-4 text-sm text-gray-500 font-medium">العميل</th>
                <th className="p-4 text-sm text-gray-500 font-medium">المبلغ</th>
                <th className="p-4 text-sm text-gray-500 font-medium">طريقة الدفع</th>
                <th className="p-4 text-sm text-gray-500 font-medium">الحالة</th>
                <th className="p-4 text-sm text-gray-500 font-medium">التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {mockPayments.map((p) => (
                <tr key={p.id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm font-mono text-navy-500">{p.id}</td>
                  <td className="p-4 font-medium text-navy-500">{p.name}</td>
                  <td className="p-4 text-sm text-navy-500 font-bold">{p.amount} ر.س</td>
                  <td className="p-4 text-sm text-gray-600">{p.method}</td>
                  <td className="p-4">
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColors[p.status]}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-500" dir="ltr">{p.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
