// Holland Code (RIASEC) Calculator
// Takes assessment answers and questions array, returns sorted category results

const RIASEC_CATEGORIES = {
  R: {
    code: 'R',
    name: 'واقعي',
    nameEn: 'Realistic',
    description: 'تفضل العمل مع الأشياء والآلات والأدوات. تحب الأنشطة البدنية والعملية.',
  },
  I: {
    code: 'I',
    name: 'بحثي',
    nameEn: 'Investigative',
    description: 'تحب التفكير والبحث والتحليل. تستمتع بحل المشكلات العلمية والرياضية.',
  },
  A: {
    code: 'A',
    name: 'فني',
    nameEn: 'Artistic',
    description: 'تحب الإبداع والتعبير عن نفسك. تستمتع بالفنون والتصميم والكتابة.',
  },
  S: {
    code: 'S',
    name: 'اجتماعي',
    nameEn: 'Social',
    description: 'تحب مساعدة الناس والعمل معهم. تستمتع بالتعليم والإرشاد والتطوع.',
  },
  E: {
    code: 'E',
    name: 'مبادر',
    nameEn: 'Enterprising',
    description: 'تحب القيادة والإقناع والتأثير. تستمتع ببدء المشاريع واتخاذ القرارات.',
  },
  C: {
    code: 'C',
    name: 'تقليدي',
    nameEn: 'Conventional',
    description: 'تحب التنظيم والدقة والعمل وفق أنظمة واضحة. تستمتع بالأرقام والبيانات.',
  },
};

/**
 * Calculate Holland code results from assessment answers
 * @param {Object} answers - { questionId: score (1-5) }
 * @param {Array} questions - Array of { id, text, category } question objects
 * @returns {Object} { scores, topThreeCode, results }
 */
export function calculateHollandCode(answers, questions) {
  // Sum scores for each RIASEC category
  const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  const counts = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

  Object.entries(answers).forEach(([questionId, value]) => {
    const question = questions.find((q) => q.id === parseInt(questionId));
    if (question) {
      scores[question.category] += value;
      counts[question.category] += 1;
    }
  });

  // Calculate max possible score per category (count * 5)
  // Convert raw scores to percentages
  const results = Object.entries(scores)
    .map(([code, rawScore]) => {
      const maxPossible = counts[code] * 5 || 1; // avoid divide by zero
      const percentage = Math.round((rawScore / maxPossible) * 100);
      const category = RIASEC_CATEGORIES[code];
      return {
        code,
        name: category.name,
        nameEn: category.nameEn,
        description: category.description,
        rawScore,
        percentage,
      };
    })
    .sort((a, b) => b.percentage - a.percentage);

  // Top 3 code string (e.g., "RIA")
  const topThreeCode = results
    .slice(0, 3)
    .map((r) => r.code)
    .join('');

  return {
    scores,
    topThreeCode,
    results,
  };
}

export { RIASEC_CATEGORIES };
export default calculateHollandCode;
