import OpenAI from 'openai';

let openai = null;

const getClient = () => {
  if (!openai && process.env.OPENAI_API_KEY) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openai;
};

const SYSTEM_PROMPT = `أنت مستشار مهني متخصص في منصة "أثر البداية" لتوجيه الطلاب السعوديين.

دورك:
- مساعدة الطلاب في فهم نتائج اختبار Holland RIASEC الخاص بهم
- تقديم نصائح مهنية مخصصة بناءً على شخصيتهم ونتائجهم
- اقتراح تخصصات جامعية ومسارات مهنية تناسبهم
- الإجابة عن أسئلتهم حول سوق العمل السعودي والفرص المتاحة
- تحفيز الطلاب وتشجيعهم على استكشاف خياراتهم

قواعد:
- تحدث دائماً بالعربية الفصحى البسيطة
- كن ودوداً ومشجعاً
- قدم إجابات مختصرة ومفيدة (لا تتجاوز 200 كلمة)
- ركز على السياق السعودي (الجامعات السعودية، سوق العمل المحلي، رؤية 2030)
- لا تقدم معلومات طبية أو قانونية`;

// Fallback responses when OpenAI is not configured
const FALLBACK_RESPONSES = [
  'بناءً على نتائج اختبارك، يبدو أن لديك ميول قوية نحو هذا المجال. أنصحك بالتعمق أكثر واستكشاف التخصصات المرتبطة به في الجامعات السعودية.',
  'سؤال رائع! بالنظر إلى نتائجك، هناك عدة مسارات يمكنك استكشافها. أنصحك بالتحدث مع مرشد أكاديمي في مدرستك لمزيد من التوجيه.',
  'من المهم أن تتبع شغفك وتستكشف خياراتك. رؤية 2030 تفتح آفاقاً واسعة في مجالات جديدة. ما الذي يثير اهتمامك أكثر؟',
  'نتائجك تشير إلى قدرات مميزة. أنصحك بالبحث عن برامج تدريبية وفرص تطوعية في هذا المجال لتكتسب خبرة عملية.',
  'كل شخص لديه مواهب فريدة. استمر في استكشاف اهتماماتك ولا تتردد في تجربة أشياء جديدة. المستقبل مليء بالفرص!',
];

export const getAIResponse = async (messages, hollandResults = null) => {
  const client = getClient();

  // Build context with Holland results
  let systemMessage = SYSTEM_PROMPT;
  if (hollandResults) {
    systemMessage += `\n\nنتائج اختبار الطالب:
- كود Holland: ${hollandResults.hollandCode || 'غير متوفر'}
- النقاط: ${JSON.stringify(hollandResults.scores || {})}
- أعلى المهن المقترحة: ${(hollandResults.topCareers || []).map(c => c.titleAr || c.title).join('، ')}`;
  }

  // If OpenAI is configured, use it
  if (client) {
    try {
      const response = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemMessage },
          ...messages.map(m => ({
            role: m.role,
            content: m.content,
          })),
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      return {
        content: response.choices[0].message.content,
        model: 'gpt-4o-mini',
      };
    } catch (error) {
      console.error('OpenAI Error:', error.message);
      // Fall through to fallback
    }
  }

  // Fallback response
  console.log('⚠️ Using fallback AI response (OpenAI not configured)');
  const randomIndex = Math.floor(Math.random() * FALLBACK_RESPONSES.length);
  return {
    content: FALLBACK_RESPONSES[randomIndex],
    model: 'fallback',
  };
};
