import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import { faqs } from '../../data/landingData';

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-right hover:bg-gray-50 transition-colors"
      >
        <span className="font-bold text-navy-500 text-lg">{question}</span>
        <ChevronDown
          className={clsx(
            'h-5 w-5 text-gray-400 transition-transform duration-200 flex-shrink-0 mr-4',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      <div
        className={clsx(
          'overflow-hidden transition-all duration-300',
          isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <p className="px-6 pb-6 text-gray-600 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

export default function FAQSection() {
  return (
    <section id="faq" className="py-20 md:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-navy-500">الأسئلة </span>
            <span className="text-green-500">الشائعة</span>
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <FAQItem key={i} question={faq.q} answer={faq.a} />
          ))}
        </div>
      </div>
    </section>
  );
}
