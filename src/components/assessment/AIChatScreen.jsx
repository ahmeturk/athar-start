import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import Button from '../ui/Button';
import { useAssessment } from '../../context/AssessmentContext';
import { LIMITS } from '../../config/constants';

const aiResponses = [
  'سؤال جيد! بناءً على نتائج تقييمك، أنصحك بالبحث عن تخصصات تجمع بين ميولك العملية والتحليلية.',
  'هذا خيار ممتاز! سوق العمل يشهد طلباً متزايداً في هذا المجال، خاصة في المملكة.',
  'أفهم قلقك. الكثير من الطلاب يمرون بنفس التجربة. المهم أنك تأخذ قرارك بناءً على فهم ذاتي حقيقي.',
  'بالتأكيد! يمكنك الجمع بين اهتماماتك المختلفة. كثير من المهن الحديثة تتطلب مهارات متعددة.',
  'نصيحتي لك: لا تتسرع في القرار. استكشف أكثر، تحدث مع أشخاص في المجالات التي تهمك.',
];

export default function AIChatScreen() {
  const { chatMessages, setChatMessages, goNext, goPrev } = useAssessment();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const remaining = LIMITS.maxFreeMessages - chatMessages.filter((m) => m.role === 'user').length;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Add welcome message if empty
  useEffect(() => {
    if (chatMessages.length === 0) {
      setChatMessages([
        {
          role: 'assistant',
          content: 'مرحباً! أنا مساعدك الذكي في أثر البداية. يمكنك سؤالي عن أي شيء يخص التخصصات، المهن، أو نتائج تقييمك. كيف أقدر أساعدك؟',
        },
      ]);
    }
  }, [chatMessages.length, setChatMessages]);

  const handleSend = async () => {
    if (!input.trim() || remaining <= 0) return;
    const userMsg = { role: 'user', content: input.trim() };
    setChatMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    await new Promise((r) => setTimeout(r, 1500));
    const aiMsg = {
      role: 'assistant',
      content: aiResponses[Math.floor(Math.random() * aiResponses.length)],
    };
    setChatMessages((prev) => [...prev, aiMsg]);
    setIsTyping(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl shadow-card overflow-hidden flex flex-col" style={{ height: '70vh' }}>
        {/* Header */}
        <div className="bg-gradient-to-l from-navy-500 to-green-500 p-4 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold">المستشار المهني الذكي</h3>
              <p className="text-sm text-white/80">
                متبقي {remaining} رسائل مجانية
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatMessages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'user'
                    ? 'bg-navy-100'
                    : 'bg-green-100'
                }`}
              >
                {msg.role === 'user' ? (
                  <User className="h-4 w-4 text-navy-500" />
                ) : (
                  <Bot className="h-4 w-4 text-green-500" />
                )}
              </div>
              <div
                className={`max-w-[80%] rounded-2xl p-4 ${
                  msg.role === 'user'
                    ? 'bg-navy-500 text-white rounded-tr-sm'
                    : 'bg-gray-100 text-navy-500 rounded-tl-sm'
                }`}
              >
                <p className="leading-relaxed text-sm">{msg.content}</p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Bot className="h-4 w-4 text-green-500" />
              </div>
              <div className="bg-gray-100 rounded-2xl p-4 rounded-tl-sm">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-100">
          {remaining > 0 ? (
            <div className="flex gap-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="اكتب سؤالك هنا..."
                className="flex-1 border-2 border-gray-200 rounded-xl py-3 px-4 text-navy-500 placeholder-gray-400 form-input"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="w-12 h-12 bg-green-500 hover:bg-green-600 rounded-xl flex items-center justify-center text-white transition-colors disabled:opacity-50"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <p className="text-center text-gray-500 text-sm">
              انتهت الرسائل المجانية. احصل على الباقة الكاملة لرسائل غير محدودة.
            </p>
          )}
        </div>

        {/* Continue button */}
        <div className="p-4 pt-0">
          <div className="flex gap-4">
            <Button onClick={goNext} className="flex-1" size="sm">
              متابعة للنتائج
            </Button>
            <Button variant="ghost" onClick={goPrev} size="sm">
              رجوع
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
