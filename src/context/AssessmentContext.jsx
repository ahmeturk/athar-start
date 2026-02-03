import { createContext, useContext, useState, useCallback } from 'react';
import { assessmentAPI } from '../api/assessment.js';
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
  const [assessmentId, setAssessmentId] = useState(null);
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
  const [saving, setSaving] = useState(false);

  const currentStepId = STEPS[currentStep];
  const totalSteps = STEPS.length;
  const progress = Math.round((currentStep / (totalSteps - 1)) * 100);

  // Start or resume assessment via API
  const startAssessment = useCallback(async () => {
    try {
      const data = await assessmentAPI.start();
      setAssessmentId(data.assessment._id);

      // If resuming, restore state
      if (data.isResume && data.assessment) {
        const a = data.assessment;
        const stepIdx = STEPS.indexOf(a.currentStep);
        if (stepIdx !== -1) setCurrentStep(stepIdx);
        if (a.studentInfo) setStudentInfo(a.studentInfo);
        if (a.preAssessmentAnswers) setPreAnswers(Object.fromEntries(a.preAssessmentAnswers));
        if (a.careerTestAnswers) setCareerAnswers(Object.fromEntries(a.careerTestAnswers));
        if (a.postAssessmentAnswers) setPostAnswers(Object.fromEntries(a.postAssessmentAnswers));
        if (a.watchedVideos) setWatchedVideos(a.watchedVideos.map(v => v.videoId));
        if (a.results?.hollandCode) setResults(a.results);
        if (a.chatMessages) setChatMessages(a.chatMessages);
      }

      return data;
    } catch (error) {
      console.error('Failed to start assessment:', error);
      // Fallback: continue with local-only mode
      return null;
    }
  }, []);

  const goNext = useCallback(() => {
    setCurrentStep((prev) => {
      const next = Math.min(prev + 1, STEPS.length - 1);
      // Sync step to backend (fire-and-forget)
      assessmentAPI.updateStep(STEPS[next]).catch(() => {});
      return next;
    });
  }, []);

  const goPrev = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const goToStep = useCallback((stepId) => {
    const idx = STEPS.indexOf(stepId);
    if (idx !== -1) {
      setCurrentStep(idx);
      assessmentAPI.updateStep(stepId).catch(() => {});
    }
  }, []);

  // Save student info to backend
  const saveStudentInfo = useCallback(async (info) => {
    setStudentInfo(info);
    setSaving(true);
    try {
      await assessmentAPI.saveStudentInfo(info);
    } catch (error) {
      console.error('Failed to save student info:', error);
    }
    setSaving(false);
  }, []);

  // Save pre-assessment answers
  const savePreAnswers = useCallback(async (answers) => {
    setPreAnswers(answers);
    setSaving(true);
    try {
      await assessmentAPI.savePreAnswers(answers);
    } catch (error) {
      console.error('Failed to save pre-answers:', error);
    }
    setSaving(false);
  }, []);

  // Mark video as watched
  const markVideoWatched = useCallback((videoId) => {
    setWatchedVideos((prev) => {
      if (prev.includes(videoId)) return prev;
      // Sync to backend
      assessmentAPI.markVideoWatched(videoId, 0).catch(() => {});
      return [...prev, videoId];
    });
  }, []);

  // Save career test answers and calculate results
  const saveCareerAnswers = useCallback(async (answers) => {
    setCareerAnswers(answers);
    setSaving(true);
    try {
      const data = await assessmentAPI.saveCareerAnswers(answers);
      if (data.results) {
        setResults(data.results);
        setSaving(false);
        return data.results;
      }
    } catch (error) {
      console.error('Failed to save career answers:', error);
    }
    // Fallback: calculate locally
    const hollandResults = calculateHollandCode(answers, careerAssessmentQuestions);
    const careers = careerMatches[hollandResults.topThreeCode] || careerMatches.CRI;
    const resultData = { ...hollandResults, careers, studentInfo, completedAt: new Date().toISOString() };
    setResults(resultData);
    setSaving(false);
    return resultData;
  }, [studentInfo]);

  // Legacy calculateResults for backward compatibility
  const calculateResults = useCallback(() => {
    const hollandResults = calculateHollandCode(careerAnswers, careerAssessmentQuestions);
    const careers = careerMatches[hollandResults.topThreeCode] || careerMatches.CRI;
    const resultData = { ...hollandResults, careers, studentInfo, completedAt: new Date().toISOString() };
    setResults(resultData);
    return resultData;
  }, [careerAnswers, studentInfo]);

  // Save post-assessment answers
  const savePostAnswers = useCallback(async (answers) => {
    setPostAnswers(answers);
    try {
      await assessmentAPI.savePostAnswers(answers);
    } catch (error) {
      console.error('Failed to save post-answers:', error);
    }
  }, []);

  // Send chat message to AI
  const sendChatMessage = useCallback(async (message) => {
    const userMsg = { role: 'user', content: message, timestamp: new Date().toISOString() };
    setChatMessages((prev) => [...prev, userMsg]);

    try {
      const data = await assessmentAPI.sendChatMessage(message);
      const aiMsg = { role: 'assistant', content: data.message, timestamp: new Date().toISOString() };
      setChatMessages((prev) => [...prev, aiMsg]);
      return aiMsg;
    } catch (error) {
      const fallbackMsg = {
        role: 'assistant',
        content: 'عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.',
        timestamp: new Date().toISOString(),
      };
      setChatMessages((prev) => [...prev, fallbackMsg]);
      return fallbackMsg;
    }
  }, []);

  const completeAssessment = useCallback(() => {
    setIsComplete(true);
    assessmentAPI.updateStep('completion').catch(() => {});
  }, []);

  const resetAssessment = useCallback(() => {
    setCurrentStep(0);
    setAssessmentId(null);
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
        // Assessment
        assessmentId,
        startAssessment,
        saving,
        // Student info
        studentInfo,
        setStudentInfo,
        saveStudentInfo,
        // Answers
        preAnswers,
        setPreAnswers,
        savePreAnswers,
        careerAnswers,
        setCareerAnswers,
        saveCareerAnswers,
        postAnswers,
        setPostAnswers,
        savePostAnswers,
        // Videos
        watchedVideos,
        markVideoWatched,
        // Results
        results,
        calculateResults,
        // Chat
        chatMessages,
        setChatMessages,
        sendChatMessage,
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
