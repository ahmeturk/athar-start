// Holland RIASEC Calculator - Server Side
// Mirrors the frontend calculator but runs server-side for data integrity

const RIASEC_TYPES = {
  R: { title: 'Realistic', titleAr: 'واقعي', description: 'يفضل العمل اليدوي والتقني والعملي' },
  I: { title: 'Investigative', titleAr: 'بحثي', description: 'يفضل البحث والتحليل والاستكشاف' },
  A: { title: 'Artistic', titleAr: 'فني', description: 'يفضل الإبداع والتعبير الفني' },
  S: { title: 'Social', titleAr: 'اجتماعي', description: 'يفضل مساعدة الآخرين والعمل الجماعي' },
  E: { title: 'Enterprising', titleAr: 'مبادر', description: 'يفضل القيادة والإقناع وريادة الأعمال' },
  C: { title: 'Conventional', titleAr: 'تقليدي', description: 'يفضل التنظيم والدقة والعمل المنظم' },
};

// Question-to-type mapping (40 questions, indices 0-39)
// Each question maps to one of R, I, A, S, E, C
const QUESTION_TYPE_MAP = [
  'R', 'I', 'A', 'S', 'E', 'C', 'R', 'I', 'A', 'S',
  'E', 'C', 'R', 'I', 'A', 'S', 'E', 'C', 'R', 'I',
  'A', 'S', 'E', 'C', 'R', 'I', 'A', 'S', 'E', 'C',
  'R', 'I', 'A', 'S', 'E', 'C', 'R', 'I', 'A', 'S',
];

// Career matches for each Holland code combination
const CAREER_DATABASE = {
  R: [
    { title: 'Mechanical Engineer', titleAr: 'مهندس ميكانيكي', match: 95 },
    { title: 'Civil Engineer', titleAr: 'مهندس مدني', match: 90 },
    { title: 'Architect', titleAr: 'مهندس معماري', match: 85 },
    { title: 'Pilot', titleAr: 'طيار', match: 80 },
  ],
  I: [
    { title: 'Data Scientist', titleAr: 'عالم بيانات', match: 95 },
    { title: 'Medical Researcher', titleAr: 'باحث طبي', match: 90 },
    { title: 'Software Engineer', titleAr: 'مهندس برمجيات', match: 88 },
    { title: 'Pharmacist', titleAr: 'صيدلي', match: 82 },
  ],
  A: [
    { title: 'Graphic Designer', titleAr: 'مصمم جرافيك', match: 95 },
    { title: 'UX Designer', titleAr: 'مصمم تجربة المستخدم', match: 90 },
    { title: 'Content Creator', titleAr: 'صانع محتوى', match: 85 },
    { title: 'Interior Designer', titleAr: 'مصمم داخلي', match: 80 },
  ],
  S: [
    { title: 'Teacher', titleAr: 'معلم', match: 95 },
    { title: 'Psychologist', titleAr: 'أخصائي نفسي', match: 92 },
    { title: 'Social Worker', titleAr: 'أخصائي اجتماعي', match: 88 },
    { title: 'Human Resources', titleAr: 'موارد بشرية', match: 82 },
  ],
  E: [
    { title: 'Entrepreneur', titleAr: 'رائد أعمال', match: 95 },
    { title: 'Marketing Manager', titleAr: 'مدير تسويق', match: 90 },
    { title: 'Sales Director', titleAr: 'مدير مبيعات', match: 85 },
    { title: 'Business Consultant', titleAr: 'استشاري أعمال', match: 80 },
  ],
  C: [
    { title: 'Accountant', titleAr: 'محاسب', match: 95 },
    { title: 'Financial Analyst', titleAr: 'محلل مالي', match: 90 },
    { title: 'Project Manager', titleAr: 'مدير مشاريع', match: 85 },
    { title: 'Quality Auditor', titleAr: 'مدقق جودة', match: 80 },
  ],
};

/**
 * Calculate Holland RIASEC scores from answers
 * @param {Object} answers - Map of questionIndex -> score (1-5)
 * @returns {Object} Results with scores, hollandCode, topCareers, personalityType
 */
export const calculateResults = (answers) => {
  // Calculate scores per type
  const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  const counts = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

  for (const [questionIndex, score] of Object.entries(answers)) {
    const idx = parseInt(questionIndex);
    if (idx >= 0 && idx < QUESTION_TYPE_MAP.length) {
      const type = QUESTION_TYPE_MAP[idx];
      scores[type] += score;
      counts[type]++;
    }
  }

  // Normalize scores to percentage (0-100)
  for (const type of Object.keys(scores)) {
    if (counts[type] > 0) {
      scores[type] = Math.round((scores[type] / (counts[type] * 5)) * 100);
    }
  }

  // Get top 3 types for Holland code
  const sorted = Object.entries(scores)
    .sort(([, a], [, b]) => b - a);

  const hollandCode = sorted.slice(0, 3).map(([type]) => type).join('');
  const primaryType = sorted[0][0];

  // Get career matches from primary and secondary types
  const topCareers = [
    ...CAREER_DATABASE[sorted[0][0]].slice(0, 2),
    ...CAREER_DATABASE[sorted[1][0]].slice(0, 2),
    ...CAREER_DATABASE[sorted[2][0]].slice(0, 1),
  ];

  return {
    hollandCode,
    scores,
    topCareers,
    personalityType: RIASEC_TYPES[primaryType],
  };
};
