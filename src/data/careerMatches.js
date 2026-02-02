// Holland Code to Career Mapping
// Maps top-3 RIASEC codes to career recommendations with match percentage, salary range, and demand level

const careerMatches = {
  RIA: [
    { name: 'هندسة ميكانيكية', match: 95, salary: '15,000 - 25,000', demand: 'عالي' },
    { name: 'هندسة كهربائية', match: 92, salary: '14,000 - 24,000', demand: 'عالي' },
    { name: 'هندسة مدنية', match: 88, salary: '13,000 - 22,000', demand: 'متوسط' },
  ],
  IAS: [
    { name: 'طب بشري', match: 96, salary: '20,000 - 40,000', demand: 'عالي جداً' },
    { name: 'صيدلة', match: 90, salary: '15,000 - 25,000', demand: 'عالي' },
    { name: 'علوم طبية مخبرية', match: 85, salary: '10,000 - 18,000', demand: 'متوسط' },
  ],
  ASE: [
    { name: 'إعلام وتصميم', match: 93, salary: '12,000 - 22,000', demand: 'عالي' },
    { name: 'تسويق رقمي', match: 89, salary: '10,000 - 20,000', demand: 'عالي جداً' },
    { name: 'علاقات عامة', match: 84, salary: '9,000 - 18,000', demand: 'متوسط' },
  ],
  SEC: [
    { name: 'إدارة موارد بشرية', match: 91, salary: '12,000 - 22,000', demand: 'عالي' },
    { name: 'تعليم', match: 87, salary: '8,000 - 15,000', demand: 'عالي' },
    { name: 'إرشاد نفسي', match: 83, salary: '10,000 - 18,000', demand: 'متوسط' },
  ],
  ECS: [
    { name: 'إدارة أعمال', match: 94, salary: '15,000 - 30,000', demand: 'عالي جداً' },
    { name: 'محاسبة', match: 88, salary: '10,000 - 20,000', demand: 'عالي' },
    { name: 'تمويل', match: 85, salary: '14,000 - 28,000', demand: 'عالي' },
  ],
  CRI: [
    { name: 'هندسة برمجيات', match: 96, salary: '18,000 - 35,000', demand: 'عالي جداً' },
    { name: 'علوم حاسب', match: 93, salary: '15,000 - 30,000', demand: 'عالي جداً' },
    { name: 'أمن سيبراني', match: 91, salary: '20,000 - 40,000', demand: 'عالي جداً' },
  ],
};

// Testimonials organized by user type
export const allTestimonials = {
  student: [
    { name: 'أحمد الشمري', role: 'طالب ثانوي - الرياض', text: 'البرنامج ساعدني أفهم نفسي وأختار تخصصي بثقة.', rating: 5 },
    { name: 'سارة العتيبي', role: 'طالبة جامعية - جدة', text: 'أتمنى لو عرفت البرنامج قبل ما أدخل الجامعة.', rating: 5 },
    { name: 'محمد القحطاني', role: 'طالب ثالث ثانوي', text: 'التقرير كان دقيق جداً وفهمت ميولي بشكل أفضل.', rating: 5 },
  ],
  parent: [
    { name: 'أبو عبدالله', role: 'ولي أمر - الرياض', text: 'البرنامج وفّر علينا كثير من النقاشات مع ابني.', rating: 5 },
    { name: 'أم سارة', role: 'ولية أمر - جدة', text: 'بنتي كانت ضايعة. بعد البرنامج صارت واثقة.', rating: 5 },
  ],
  institution: [
    { name: 'مدارس الفيصلية', role: 'الرياض', text: 'طبقنا البرنامج على 500 طالب. نتائج مبهرة.', rating: 5 },
    { name: 'ثانوية الملك فهد', role: 'جدة', text: 'أصبح البرنامج جزء أساسي من الإرشاد المهني.', rating: 5 },
  ],
};

export default careerMatches;
