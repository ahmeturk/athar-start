import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  // Singleton pattern - only one settings document
  _id: {
    type: String,
    default: 'app-settings',
  },
  // General
  siteName: { type: String, default: 'أثر البداية' },
  siteEmail: { type: String, default: 'info@athar-start.com' },
  phone: { type: String, default: '+966 50 000 0000' },
  whatsapp: { type: String, default: '+966 50 000 0000' },
  // Pricing
  originalPrice: { type: Number, default: 199 },
  salePrice: { type: Number, default: 139 },
  discountPercent: { type: Number, default: 30 },
  vatRate: { type: Number, default: 0.15 },
  requirePayment: { type: Boolean, default: true },
  // AI Settings
  maxFreeMessages: { type: Number, default: 10 },
  aiModel: { type: String, default: 'gpt-4o-mini' },
  aiSystemPrompt: { type: String, default: '' },
  // Notifications
  emailNotifications: { type: Boolean, default: true },
  smsNotifications: { type: Boolean, default: false },
  // Assessment config
  assessmentSteps: [{
    id: String,
    name: String,
    type: { type: String, enum: ['entry', 'form', 'survey', 'video', 'assessment', 'chat', 'results', 'report', 'certificate', 'completion'] },
    enabled: { type: Boolean, default: true },
    order: Number,
    config: mongoose.Schema.Types.Mixed, // flexible config per step
  }],
  // Videos content
  videos: [{
    videoId: { type: String, required: true }, // e.g., 'orientation-1'
    title: String,
    description: String,
    youtubeUrl: String,
    duration: String,
    type: { type: String, enum: ['توجيهي', 'قرار'] },
    order: Number,
    isActive: { type: Boolean, default: true },
  }],
}, {
  timestamps: true,
});

// Get settings (create with defaults if not exists)
settingsSchema.statics.getSettings = async function () {
  let settings = await this.findById('app-settings');
  if (!settings) {
    settings = await this.create({
      _id: 'app-settings',
      assessmentSteps: getDefaultSteps(),
      videos: getDefaultVideos(),
    });
  }
  return settings;
};

function getDefaultSteps() {
  return [
    { id: 'entry', name: 'صفحة الترحيب', type: 'entry', enabled: true, order: 1 },
    { id: 'info', name: 'معلومات الطالب', type: 'form', enabled: true, order: 2 },
    { id: 'pre-assessment', name: 'التقييم القبلي', type: 'survey', enabled: true, order: 3 },
    { id: 'orientation-1', name: 'فيديو توجيهي 1', type: 'video', enabled: true, order: 4 },
    { id: 'orientation-2', name: 'فيديو توجيهي 2', type: 'video', enabled: true, order: 5 },
    { id: 'orientation-3', name: 'فيديو توجيهي 3', type: 'video', enabled: true, order: 6 },
    { id: 'orientation-4', name: 'فيديو توجيهي 4', type: 'video', enabled: true, order: 7 },
    { id: 'career-test', name: 'التقييم المهني (40 سؤال)', type: 'assessment', enabled: true, order: 8 },
    { id: 'decision-1', name: 'فيديو قرار 1', type: 'video', enabled: true, order: 9 },
    { id: 'decision-2', name: 'فيديو قرار 2', type: 'video', enabled: true, order: 10 },
    { id: 'decision-3', name: 'فيديو قرار 3', type: 'video', enabled: true, order: 11 },
    { id: 'decision-4', name: 'فيديو قرار 4', type: 'video', enabled: true, order: 12 },
    { id: 'post-assessment', name: 'التقييم البعدي', type: 'survey', enabled: true, order: 13 },
    { id: 'ai-chat', name: 'المستشار الذكي', type: 'chat', enabled: true, order: 14 },
    { id: 'results', name: 'النتائج', type: 'results', enabled: true, order: 15 },
    { id: 'report', name: 'التقرير', type: 'report', enabled: true, order: 16 },
    { id: 'certificate', name: 'الشهادة', type: 'certificate', enabled: true, order: 17 },
    { id: 'completion', name: 'صفحة الإتمام', type: 'completion', enabled: true, order: 18 },
  ];
}

function getDefaultVideos() {
  return [
    { videoId: 'orientation-1', title: 'مقدمة: رحلة اكتشاف الذات', description: 'تعرف على أهمية الوعي المهني وكيف يؤثر على مستقبلك', youtubeUrl: '', duration: '8 دقائق', type: 'توجيهي', order: 1, isActive: true },
    { videoId: 'orientation-2', title: 'فهم الميول المهنية', description: 'تعلم عن نموذج هولاند وأنواع الشخصيات المهنية الستة', youtubeUrl: '', duration: '12 دقيقة', type: 'توجيهي', order: 2, isActive: true },
    { videoId: 'orientation-3', title: 'استكشاف عالم التخصصات', description: 'نظرة شاملة على التخصصات الجامعية وعلاقتها بسوق العمل', youtubeUrl: '', duration: '10 دقائق', type: 'توجيهي', order: 3, isActive: true },
    { videoId: 'orientation-4', title: 'مهارات القرن الحادي والعشرين', description: 'تعرف على المهارات المطلوبة في سوق العمل المستقبلي', youtubeUrl: '', duration: '9 دقائق', type: 'توجيهي', order: 4, isActive: true },
    { videoId: 'decision-1', title: 'كيف تتخذ قرارك المهني', description: 'خطوات علمية لاتخاذ قرار مهني صحيح', youtubeUrl: '', duration: '11 دقيقة', type: 'قرار', order: 5, isActive: true },
    { videoId: 'decision-2', title: 'التخطيط الأكاديمي', description: 'كيف تخطط لمسارك الأكاديمي بما يتناسب مع أهدافك', youtubeUrl: '', duration: '10 دقائق', type: 'قرار', order: 6, isActive: true },
    { videoId: 'decision-3', title: 'تجارب ناجحة', description: 'قصص نجاح لطلاب اتخذوا قرارات مهنية صائبة', youtubeUrl: '', duration: '8 دقائق', type: 'قرار', order: 7, isActive: true },
    { videoId: 'decision-4', title: 'خطتك للمستقبل', description: 'كيف تبني خطة عمل واضحة لتحقيق أهدافك المهنية', youtubeUrl: '', duration: '9 دقائق', type: 'قرار', order: 8, isActive: true },
  ];
}

const Settings = mongoose.model('Settings', settingsSchema);
export default Settings;
export { getDefaultSteps, getDefaultVideos };
