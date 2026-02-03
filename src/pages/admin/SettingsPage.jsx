import { Save, Globe, CreditCard, Bell, Shield, Loader2, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { adminAPI } from '../../api/admin.js';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'أثر البداية',
    siteEmail: 'info@athar-start.com',
    price: '139',
    originalPrice: '199',
    discount: '30',
    maxFreeMessages: '10',
    requirePayment: true,
    emailNotifications: true,
    smsNotifications: false,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getSettings()
      .then((data) => {
        if (data.settings) {
          setSettings({
            siteName: data.settings.siteName || 'أثر البداية',
            siteEmail: data.settings.siteEmail || 'info@athar-start.com',
            price: String(data.settings.price || 139),
            originalPrice: String(data.settings.originalPrice || 199),
            discount: String(data.settings.discount || 30),
            maxFreeMessages: String(data.settings.maxFreeMessages || 10),
            requirePayment: data.settings.requirePayment ?? true,
            emailNotifications: data.settings.emailNotifications ?? true,
            smsNotifications: data.settings.smsNotifications ?? false,
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...settings,
        price: Number(settings.price),
        originalPrice: Number(settings.originalPrice),
        discount: Number(settings.discount),
        maxFreeMessages: Number(settings.maxFreeMessages),
      };
      await adminAPI.updateSettings(payload);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert('حدث خطأ أثناء حفظ الإعدادات');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-green-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <h2 className="text-2xl font-bold text-navy-500">الإعدادات</h2>

      {/* General */}
      <div className="bg-white rounded-2xl shadow-card p-6">
        <h3 className="text-lg font-bold text-navy-500 mb-4 flex items-center gap-2">
          <Globe className="h-5 w-5 text-green-500" />
          إعدادات عامة
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-navy-500 mb-1.5">اسم الموقع</label>
            <input
              value={settings.siteName}
              onChange={(e) => handleChange('siteName', e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 form-input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-500 mb-1.5">البريد الإلكتروني</label>
            <input
              value={settings.siteEmail}
              onChange={(e) => handleChange('siteEmail', e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 form-input"
              dir="ltr"
            />
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-white rounded-2xl shadow-card p-6">
        <h3 className="text-lg font-bold text-navy-500 mb-4 flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-green-500" />
          إعدادات التسعير
        </h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-navy-500 mb-1.5">السعر الأصلي (ر.س)</label>
            <input
              type="number"
              value={settings.originalPrice}
              onChange={(e) => handleChange('originalPrice', e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 form-input"
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-500 mb-1.5">السعر بعد الخصم (ر.س)</label>
            <input
              type="number"
              value={settings.price}
              onChange={(e) => handleChange('price', e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 form-input"
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-500 mb-1.5">نسبة الخصم (%)</label>
            <input
              type="number"
              value={settings.discount}
              onChange={(e) => handleChange('discount', e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 form-input"
              dir="ltr"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => handleChange('requirePayment', !settings.requirePayment)}
              className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings.requirePayment ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${
                settings.requirePayment ? 'right-1' : 'right-5'
              }`} />
            </div>
            <span className="text-sm text-navy-500">تفعيل الدفع الإلزامي</span>
          </label>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl shadow-card p-6">
        <h3 className="text-lg font-bold text-navy-500 mb-4 flex items-center gap-2">
          <Bell className="h-5 w-5 text-green-500" />
          الإشعارات
        </h3>
        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => handleChange('emailNotifications', !settings.emailNotifications)}
              className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings.emailNotifications ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${
                settings.emailNotifications ? 'right-1' : 'right-5'
              }`} />
            </div>
            <span className="text-sm text-navy-500">إشعارات البريد الإلكتروني</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => handleChange('smsNotifications', !settings.smsNotifications)}
              className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings.smsNotifications ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${
                settings.smsNotifications ? 'right-1' : 'right-5'
              }`} />
            </div>
            <span className="text-sm text-navy-500">إشعارات الرسائل النصية</span>
          </label>
        </div>
      </div>

      {/* AI Settings */}
      <div className="bg-white rounded-2xl shadow-card p-6">
        <h3 className="text-lg font-bold text-navy-500 mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-green-500" />
          إعدادات المساعد الذكي
        </h3>
        <div>
          <label className="block text-sm font-medium text-navy-500 mb-1.5">الرسائل المجانية</label>
          <input
            type="number"
            value={settings.maxFreeMessages}
            onChange={(e) => handleChange('maxFreeMessages', e.target.value)}
            className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 form-input"
            dir="ltr"
          />
        </div>
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 bg-green-500 text-white px-8 py-3 rounded-xl hover:bg-green-600 transition-colors font-medium disabled:opacity-50"
      >
        {saving ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : saved ? (
          <Check className="h-5 w-5" />
        ) : (
          <Save className="h-5 w-5" />
        )}
        {saving ? 'جاري الحفظ...' : saved ? 'تم الحفظ' : 'حفظ الإعدادات'}
      </button>
    </div>
  );
}
