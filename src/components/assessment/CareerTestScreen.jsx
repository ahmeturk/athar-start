import { useState } from 'react';
import Button from '../ui/Button';
import { useAssessment } from '../../context/AssessmentContext';
import careerAssessmentQuestions from '../../data/assessmentQuestions';

const likertLabels = [
  { value: 1, label: 'لا أوافق بشدة' },
  { value: 2, label: 'لا أوافق' },
  { value: 3, label: 'محايد' },
  { value: 4, label: 'أوافق' },
  { value: 5, label: 'أوافق بشدة' },
];

export default function CareerTestScreen() {
  const { careerAnswers, setCareerAnswers, goNext, goPrev } = useAssessment();
  const [currentQ, setCurrentQ] = useState(0);
  const questions = careerAssessmentQuestions;
  const question = questions[currentQ];
  const totalQ = questions.length;
  const answered = Object.keys(careerAnswers).length;

  const handleAnswer = (value) => {
    setCareerAnswers((prev) => ({ ...prev, [question.id]: value }));
    if (currentQ < totalQ - 1) {
      setTimeout(() => setCurrentQ(currentQ + 1), 200);
    }
  };

  const allAnswered = answered >= totalQ;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl shadow-card p-8">
        <div className="mb-6">
          <span className="inline-block bg-green-50 text-green-600 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
            التقييم المهني - نموذج هولاند
          </span>
          <h2 className="text-2xl font-bold text-navy-500 mb-2">
            اكتشف ميولك المهنية
          </h2>
          <p className="text-gray-500 text-sm">
            حدد مدى موافقتك على كل عبارة. لا توجد إجابات صحيحة أو خاطئة.
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-between mb-3 text-sm">
          <span className="text-gray-500">سؤال {currentQ + 1} من {totalQ}</span>
          <span className="text-green-500 font-medium">{answered} / {totalQ}</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-gradient-to-l from-green-400 to-green-600 rounded-full transition-all duration-300"
            style={{ width: `${(answered / totalQ) * 100}%` }}
          />
        </div>

        {/* Question */}
        <div className="mb-8">
          <div className="bg-navy-50 rounded-2xl p-6 mb-6">
            <p className="text-lg font-bold text-navy-500 leading-relaxed">
              {question.text}
            </p>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {likertLabels.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleAnswer(opt.value)}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all text-center ${
                  careerAnswers[question.id] === opt.value
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    careerAnswers[question.id] === opt.value
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {opt.value}
                </div>
                <span className="text-[10px] sm:text-xs text-gray-600 leading-tight">
                  {opt.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Question dots navigation */}
        <div className="flex flex-wrap gap-1.5 mb-6 justify-center">
          {questions.map((q, i) => (
            <button
              key={q.id}
              onClick={() => setCurrentQ(i)}
              className={`w-6 h-6 rounded-full text-[10px] font-bold transition-all ${
                i === currentQ
                  ? 'bg-navy-500 text-white scale-110'
                  : careerAnswers[q.id]
                  ? 'bg-green-100 text-green-600'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex gap-4 pt-4 border-t border-gray-100">
          <Button
            onClick={goNext}
            disabled={!allAnswered}
            className="flex-1"
          >
            {allAnswered ? 'متابعة' : `أجب على ${totalQ - answered} سؤال متبقي`}
          </Button>
          <Button variant="ghost" onClick={goPrev}>
            رجوع
          </Button>
        </div>
      </div>
    </div>
  );
}
