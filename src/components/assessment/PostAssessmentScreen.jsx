import { useState } from 'react';
import Button from '../ui/Button';
import { useAssessment } from '../../context/AssessmentContext';
import { postImpactQuestions } from '../../data/prePostQuestions';

export default function PostAssessmentScreen() {
  const { postAnswers, setPostAnswers, goNext, goPrev } = useAssessment();
  const [currentQ, setCurrentQ] = useState(0);
  const question = postImpactQuestions[currentQ];
  const totalQ = postImpactQuestions.length;

  const handleAnswer = (optionIndex) => {
    setPostAnswers((prev) => ({ ...prev, [question.id]: optionIndex }));
    if (currentQ < totalQ - 1) {
      setCurrentQ(currentQ + 1);
    }
  };

  const allAnswered = Object.keys(postAnswers).length >= totalQ;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl shadow-card p-8">
        <div className="mb-8">
          <span className="inline-block bg-navy-50 text-navy-500 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
            تقييم بعدي
          </span>
          <h2 className="text-2xl font-bold text-navy-500 mb-2">
            قياس أثر البرنامج
          </h2>
          <p className="text-gray-500">
            ساعدنا نقيس مدى استفادتك من البرنامج بالإجابة على الأسئلة التالية.
          </p>
        </div>

        <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
          <span>سؤال {currentQ + 1} من {totalQ}</span>
          <span>{Object.keys(postAnswers).length} / {totalQ} مكتمل</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full transition-all duration-300"
            style={{ width: `${((currentQ + 1) / totalQ) * 100}%` }}
          />
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-bold text-navy-500 mb-6">{question.text}</h3>
          <div className="space-y-3">
            {question.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                className={`w-full text-right p-4 rounded-xl border-2 transition-all ${
                  postAnswers[question.id] === i
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-green-300 hover:bg-green-50/50'
                }`}
              >
                <span className="font-medium">{opt}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {currentQ > 0 && (
              <Button variant="ghost" onClick={() => setCurrentQ(currentQ - 1)}>
                السؤال السابق
              </Button>
            )}
          </div>
          <div className="flex gap-4">
            {currentQ < totalQ - 1 && postAnswers[question.id] !== undefined && (
              <Button variant="secondary" onClick={() => setCurrentQ(currentQ + 1)}>
                التالي
              </Button>
            )}
            {allAnswered && (
              <Button onClick={goNext}>متابعة</Button>
            )}
          </div>
        </div>

        <div className="flex gap-4 pt-4 border-t border-gray-100 mt-6">
          <Button variant="ghost" onClick={goPrev}>
            رجوع للخطوة السابقة
          </Button>
        </div>
      </div>
    </div>
  );
}
