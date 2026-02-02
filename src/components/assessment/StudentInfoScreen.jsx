import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useAssessment } from '../../context/AssessmentContext';

const gradeOptions = [
  'أول ثانوي',
  'ثاني ثانوي',
  'ثالث ثانوي',
  'سنة تحضيرية',
  'طالب جامعي',
  'خريج',
];

const cityOptions = [
  'الرياض', 'جدة', 'مكة المكرمة', 'المدينة المنورة',
  'الدمام', 'الخبر', 'الطائف', 'تبوك',
  'بريدة', 'أبها', 'حائل', 'أخرى',
];

export default function StudentInfoScreen() {
  const { studentInfo, setStudentInfo, goNext, goPrev } = useAssessment();
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setStudentInfo((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const e = {};
    if (!studentInfo.name.trim()) e.name = 'الاسم مطلوب';
    if (!studentInfo.grade) e.grade = 'المرحلة الدراسية مطلوبة';
    if (!studentInfo.city) e.city = 'المدينة مطلوبة';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) goNext();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl shadow-card p-8">
        <h2 className="text-2xl font-bold text-navy-500 mb-2">معلوماتك الأساسية</h2>
        <p className="text-gray-500 mb-8">ساعدنا نعرفك أكثر عشان نقدم لك أفضل تجربة</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="الاسم الكامل"
            value={studentInfo.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="أدخل اسمك"
            error={errors.name}
          />

          <Input
            label="البريد الإلكتروني (اختياري)"
            type="email"
            value={studentInfo.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="example@email.com"
            dir="ltr"
          />

          <div>
            <label className="block text-sm font-medium text-navy-500 mb-1.5">
              المرحلة الدراسية
            </label>
            <select
              value={studentInfo.grade}
              onChange={(e) => handleChange('grade', e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 text-navy-500 transition-all form-input appearance-none bg-white"
            >
              <option value="">اختر المرحلة</option>
              {gradeOptions.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
            {errors.grade && <p className="mt-1.5 text-sm text-red-500">{errors.grade}</p>}
          </div>

          <Input
            label="اسم المدرسة / الجامعة (اختياري)"
            value={studentInfo.school}
            onChange={(e) => handleChange('school', e.target.value)}
            placeholder="أدخل اسم المدرسة أو الجامعة"
          />

          <div>
            <label className="block text-sm font-medium text-navy-500 mb-1.5">المدينة</label>
            <select
              value={studentInfo.city}
              onChange={(e) => handleChange('city', e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 text-navy-500 transition-all form-input appearance-none bg-white"
            >
              <option value="">اختر المدينة</option>
              {cityOptions.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {errors.city && <p className="mt-1.5 text-sm text-red-500">{errors.city}</p>}
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1">
              التالي
            </Button>
            <Button variant="ghost" onClick={goPrev} type="button">
              رجوع
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
