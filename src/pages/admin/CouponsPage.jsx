import { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, X, Loader2, RefreshCw, Copy, CheckCircle } from 'lucide-react';
import { adminAPI } from '../../api/admin';

export default function CouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [form, setForm] = useState({ code: '', discount: '', maxUses: '', expiresAt: '' });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminAPI.getCoupons();
      setCoupons(data.coupons || []);
    } catch (err) {
      setError('فشل في تحميل الكوبونات');
    }
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!form.code.trim() || !form.discount) return;
    setSaving(true);
    try {
      const data = await adminAPI.createCoupon({
        code: form.code.toUpperCase(),
        discount: Number(form.discount),
        maxUses: form.maxUses ? Number(form.maxUses) : null,
        expiresAt: form.expiresAt || null,
      });
      setCoupons((prev) => [data.coupon, ...prev]);
      setForm({ code: '', discount: '', maxUses: '', expiresAt: '' });
      setShowCreate(false);
    } catch (err) {
      setError('فشل في إنشاء الكوبون');
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    try {
      await adminAPI.deleteCoupon(id);
      setCoupons((prev) => prev.filter((c) => c._id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      setError('فشل في حذف الكوبون');
    }
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="h-8 w-8 animate-spin text-green-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-navy-500">إدارة الكوبونات</h2>
        <div className="flex gap-2">
          <button onClick={fetchCoupons} className="p-2 text-gray-400 hover:text-navy-500 hover:bg-gray-100 rounded-xl transition-colors">
            <RefreshCw className="h-4 w-4" />
          </button>
          <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition-colors text-sm font-medium">
            <Plus className="h-4 w-4" />
            كوبون جديد
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center justify-between">
          {error}
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600"><X className="h-4 w-4" /></button>
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow-card p-4 text-center">
          <p className="text-2xl font-bold text-navy-500">{coupons.length}</p>
          <p className="text-sm text-gray-500">إجمالي الكوبونات</p>
        </div>
        <div className="bg-white rounded-2xl shadow-card p-4 text-center">
          <p className="text-2xl font-bold text-green-500">{coupons.filter(c => c.isActive).length}</p>
          <p className="text-sm text-gray-500">نشط</p>
        </div>
        <div className="bg-white rounded-2xl shadow-card p-4 text-center">
          <p className="text-2xl font-bold text-gray-400">{coupons.reduce((sum, c) => sum + (c.currentUses || 0), 0)}</p>
          <p className="text-sm text-gray-500">إجمالي الاستخدام</p>
        </div>
      </div>

      {/* Coupons list */}
      {coupons.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Tag className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>لا توجد كوبونات</p>
          <button onClick={() => setShowCreate(true)} className="mt-3 text-green-500 hover:text-green-600 text-sm font-medium">
            إنشاء كوبون جديد
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-right">
                <th className="px-4 py-3 text-sm font-medium text-gray-500">الكود</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500">الخصم</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500 hidden sm:table-cell">الاستخدام</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500 hidden md:table-cell">الصلاحية</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500">الحالة</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500 w-20"></th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => {
                const isExpired = coupon.expiresAt && new Date(coupon.expiresAt) < new Date();
                const isMaxedOut = coupon.maxUses && coupon.currentUses >= coupon.maxUses;
                const isValid = coupon.isActive && !isExpired && !isMaxedOut;

                return (
                  <tr key={coupon._id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-navy-500 bg-navy-50 px-3 py-1 rounded-lg text-sm" dir="ltr">
                          {coupon.code}
                        </span>
                        <button onClick={() => copyCode(coupon.code)} className="text-gray-300 hover:text-navy-500 transition-colors">
                          {copied === coupon.code ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-lg font-bold text-green-500">{coupon.discount}%</span>
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <span className="text-sm text-gray-600">
                        {coupon.currentUses || 0}{coupon.maxUses ? ` / ${coupon.maxUses}` : ''}
                      </span>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className="text-sm text-gray-500">
                        {coupon.expiresAt
                          ? new Date(coupon.expiresAt).toLocaleDateString('ar-SA')
                          : 'غير محدد'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        isValid
                          ? 'bg-green-100 text-green-700'
                          : isExpired
                          ? 'bg-red-100 text-red-600'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {isValid ? 'نشط' : isExpired ? 'منتهي' : isMaxedOut ? 'مكتمل' : 'معطل'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => setDeleteConfirm(coupon._id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowCreate(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-navy-500">إنشاء كوبون جديد</h3>
              <button onClick={() => setShowCreate(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy-500 mb-1.5">كود الكوبون *</label>
                <input
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 focus:border-green-500 focus:outline-none font-mono"
                  dir="ltr"
                  placeholder="WELCOME20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-500 mb-1.5">نسبة الخصم (%) *</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={form.discount}
                  onChange={(e) => setForm({ ...form, discount: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 focus:border-green-500 focus:outline-none"
                  dir="ltr"
                  placeholder="20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-500 mb-1.5">الحد الأقصى للاستخدام (اختياري)</label>
                <input
                  type="number"
                  value={form.maxUses}
                  onChange={(e) => setForm({ ...form, maxUses: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 focus:border-green-500 focus:outline-none"
                  dir="ltr"
                  placeholder="100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-500 mb-1.5">تاريخ الانتهاء (اختياري)</label>
                <input
                  type="date"
                  value={form.expiresAt}
                  onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 focus:border-green-500 focus:outline-none"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCreate}
                disabled={saving || !form.code.trim() || !form.discount}
                className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-xl hover:bg-green-600 transition-colors font-medium disabled:opacity-50"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                إنشاء الكوبون
              </button>
              <button
                onClick={() => setShowCreate(false)}
                className="px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors font-medium"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 text-center" onClick={(e) => e.stopPropagation()}>
            <Trash2 className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-navy-500 mb-2">حذف الكوبون؟</h3>
            <p className="text-gray-500 text-sm mb-6">لا يمكن التراجع عن هذا الإجراء.</p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 bg-red-500 text-white py-3 rounded-xl hover:bg-red-600 transition-colors font-medium"
              >
                نعم، احذف
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 border-2 border-gray-200 text-gray-600 py-3 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
