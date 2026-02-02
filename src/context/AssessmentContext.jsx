import { createContext, useContext, useState, useCallback } from 'react';
import { calculateHollandCode } from '../utils/hollandCalculator';
import careerAssessmentQuestions from '../data/assessmentQuestions';
import careerMatches from '../data/careerMatches';

const AssessmentContext = createContext(null);

// Assessment flow steps
const STEPS = [
  'entry',           // Welcome screen
  'info',            // Student info form
  'pre-assessment',  // Pre-impact survey
  'orientation-1',   // Orientation video 1
  'orientation-2',   // Orientation video 2
  'orientation-3',   // Orientation video 3
  'orientation-4',   // Orientation video 4
  'career-test',     // 40 RIASEC questions
  'decision-1',      // Decision video 1
  'decision-2',      // Decision video 2
  'decision-3',      // Decision video 3
  'decision-4',      // Decision video 4
  'post-assessment', // Post-impact survey
  'ai-chat',         // AI career advisor
  'results',         // Results dashboard
  'report',          // Full report
  'certificate',     // Certificate
  'completion',      // Completion screen
];

export function AssessmentProvider({ children }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [studentInfo, setStudentInfo] = useState({
    name: '',
    email: '',
    phone: '',
    school: '',
    grade: '',
    city: '',
  });
  const [preAnswers, setPreAnswers] = useState({});
  const [careerAnswers, setCareerAnswers] = useState({});
  const [postAnswers, setPostAnswers] = useState({});
  const [watchedVideos, setWatchedVideos] = useState([]);
  const [results, setResults] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [isComplete, setIsComplete] = useState(false);

  const currentStepId = STEPS[currentStep];
  const totalSteps = STEPS.length;
  const progress = Math.round((currentStep / (totalSteps - 1)) * 100);

  const goNext = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  }, []);

  const goPrev = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const goToStep = useCallback((stepId) => {
    const idx = STEPS.indexOf(stepId);
    if (idx !== -1) setCurrentStep(idx);
  }, []);

  const markVideoWatched = useCallback((videoId) => {
    setWatchedVideos((prev) =>
      prev.includes(videoId) ? prev : [...prev, videoId]
    );
  }, []);

  const calculateResults = useCallback(() => {
    const hollandResults = calculateHollandCode(
      careerAnswers,
      careerAssessmentQuestions
    );
    const careers = careerMatches[hollandResults.topThreeCode] || careerMatches.CRI;
    const resultData = {
      ...hollandResults,
      careers,
      studentInfo,
      completedAt: new Date().toISOString(),
    };
    setResults(resultData);
    return resultData;
  }, [careerAnswers, studentInfo]);

  const completeAssessment = useCallback(() => {
    setIsComplete(true);
  }, []);

  const resetAssessment = useCallback(() => {
    setCurrentStep(0);
    setStudentInfo({ name: '', email: '', phone: '', school: '', grade: '', city: '' });
    setPreAnswers({});
    setCareerAnswers({});
    setPostAnswers({});
    setWatchedVideos([]);
    setResults(null);
    setChatMessages([]);
    setIsComplete(false);
  }, []);

  return (
    <AssessmentContext.Provider
      value={{
        // Navigation
        currentStep,
        currentStepId,
        totalSteps,
        progress,
        steps: STEPS,
        goNext,
        goPrev,
        goToStep,
        // Student info
        studentInfo,
        setStudentInfo,
        // Answers
        preAnswers,
        setPreAnswers,
        careerAnswers,
        setCareerAnswers,
        postAnswers,
        setPostAnswers,
        // Videos
        watchedVideos,
        markVideoWatched,
        // Results
        results,
        calculateResults,
        // Chat
        chatMessages,
        setChatMessages,
        // Completion
        isComplete,
        completeAssessment,
        resetAssessment,
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment() {
  const context = useContext(AssessmentContext);
  if (!context) throw new Error('useAssessment must be used within AssessmentProvider');
  return context;
}

export default AssessmentContext;
