import { useState, useEffect } from 'react';
import { Save, Globe, CreditCard, Bell, Shield, RefreshCw, CheckCircle, Loader2 } from 'lucide-react';
import { adminAPI } from '../../api/admin';

export default function SettingsPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminAPI.getSettings();
      setSettings(data.settings);
    } catch (err) {
      setError('فشل في تحميل الإعدادات');
    }
    setLoading(false);
  };

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const data = await adminAPI.updateSettings({
        siteName: settings.siteName,
        siteEmail: settings.siteEmail,
        phone: settings.phone,
        whatsapp: settings.whatsapp,
        originalPrice: Number(settings.originalPrice),
        salePrice: Number(settings.salePrice),
        discountPercent: Number(settings.discountPercent),
        vatRate: Number(settings.vatRate),
        requirePayment: settings.requirePayment,
        maxFreeMessages: Number(settings.maxFreeMessages),
        aiModel: settings.aiModel,
        aiSystemPrompt: settings.aiSystemPrompt,
        emailNotifications: settings.emailNotifications,
        smsNotifications: settings.smsNotifications,
      });
      setSettings(data.settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError('فشل في حفظ الإعدادات');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="h-8 w-8 animate-spin text-green-500" />
      </div>
    );
  }

  if (error && !settings) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={fetchSettings} className="flex items-center gap-2 mx-auto bg-navy-500 text-white px-6 py-2 rounded-xl hover:bg-navy-600 transition-colors">
          <RefreshCw className="h-4 w-4" /> إعادة المحاولة
        </button>
      </div>
    );
  }

  const Toggle = ({ value, onChange, label }) => (
    <label className="flex items-center gap-3 cursor-pointer">
      <div
        onClick={() => onChange(!value)}
        className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${value ? 'bg-green-500' : 'bg-gray-300'}`}
      >
        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${value ? 'right-1' : 'right-5'}`} />
      </div>
      <span className="text-sm text-navy-500">{label}</span>
    </label>
  );

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-navy-500">الإعدادات</h2>
        {saved && (
          <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium bg-green-50 px-3 py-1.5 rounded-full">
            <CheckCircle className="h-4 w-4" /> تم الحفظ
          </span>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">{error}</div>
      )}

      {/* General */}
      <div className="bg-white rounded-2xl shadow-card p-6">
        <h3 className="text-lg font-bold text-navy-500 mb-4 flex items-center gap-2">
          <Globe className="h-5 w-5 text-green-500" />
          إعدادات عامة
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-navy-500 mb-1.5">اسم الموقع</label>
            <input
              value={settings.siteName || ''}
              onChange={(e) => handleChange('siteName', e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 focus:border-green-500 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-500 mb-1.5">البريد الإلكتروني</label>
            <input
              value={settings.siteEmail || ''}
              onChange={(e) => handleChange('siteEmail', e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 focus:border-green-500 focus:outline-none transition-colors"
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-500 mb-1.5">رقم الهاتف</label>
            <input
              value={settings.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 focus:border-green-500 focus:outline-none transition-colors"
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-500 mb-1.5">واتساب</label>
            <input
              value={settings.whatsapp || ''}
              onChange={(e) => handleChange('whatsapp', e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 focus:border-green-500 focus:outline-none transition-colors"
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-navy-500 mb-1.5">السعر الأصلي (ر.س)</label>
            <input
              type="number"
              value={settings.originalPrice ?? ''}
              onChange={(e) => handleChange('originalPrice', e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 focus:border-green-500 focus:outline-none transition-colors"
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-500 mb-1.5">سعر البيع (ر.س)</label>
            <input
              type="number"
              value={settings.salePrice ?? ''}
              onChange={(e) => handleChange('salePrice', e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 focus:border-green-500 focus:outline-none transition-colors"
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-500 mb-1.5">نسبة الخصم (%)</label>
            <input
              type="number"
              value={settings.discountPercent ?? ''}
              onChange={(e) => handleChange('discountPercent', e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 focus:border-green-500 focus:outline-none transition-colors"
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-500 mb-1.5">ضريبة القيمة المضافة</label>
            <input
              type="number"
              step="0.01"
              value={settings.vatRate ?? ''}
              onChange={(e) => handleChange('vatRate', e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 focus:border-green-500 focus:outline-none transition-colors"
              dir="ltr"
            />
          </div>
        </div>
        <div className="mt-4">
          <Toggle value={settings.requirePayment} onChange={(v) => handleChange('requirePayment', v)} label="تفعيل الدفع الإلزامي" />
        </div>
      </div>

      {/* AI Settings */}
      <div className="bg-white rounded-2xl shadow-card p-6">
        <h3 className="text-lg font-bold text-navy-500 mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-green-500" />
          إعدادات المستشار الذكي
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-navy-500 mb-1.5">الرسائل المجانية</label>
            <input
              type="number"
              value={settings.maxFreeMessages ?? ''}
              onChange={(e) => handleChange('maxFreeMessages', e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 focus:border-green-500 focus:outline-none transition-colors"
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-500 mb-1.5">نموذج الذكاء الاصطناعي</label>
            <select
              value={settings.aiModel || 'gpt-4o-mini'}
              onChange={(e) => handleChange('aiModel', e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 focus:border-green-500 focus:outline-none transition-colors bg-white"
            >
              <option value="gpt-4o-mini">GPT-4o Mini (أسرع)</option>
              <option value="gpt-4o">GPT-4o (أذكى)</option>
              <option value="gpt-4-turbo">GPT-4 Turbo</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-navy-500 mb-1.5">تعليمات النظام المخصصة (اختياري)</label>
          <textarea
            value={settings.aiSystemPrompt || ''}
            onChange={(e) => handleChange('aiSystemPrompt', e.target.value)}
            rows={3}
            placeholder="أضف تعليمات إضافية للمستشار الذكي..."
            className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 focus:border-green-500 focus:outline-none transition-colors resize-none"
          />
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl shadow-card p-6">
        <h3 className="text-lg font-bold text-navy-500 mb-4 flex items-center gap-2">
          <Bell className="h-5 w-5 text-green-500" />
          الإشعارات
        </h3>
        <div className="space-y-4">
          <Toggle value={settings.emailNotifications} onChange={(v) => handleChange('emailNotifications', v)} label="إشعارات البريد الإلكتروني" />
          <Toggle value={settings.smsNotifications} onChange={(v) => handleChange('smsNotifications', v)} label="إشعارات الرسائل النصية" />
        </div>
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 bg-green-500 text-white px-8 py-3 rounded-xl hover:bg-green-600 transition-colors font-medium disabled:opacity-50"
      >
        {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
        {saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
      </button>
    </div>
  );
}
