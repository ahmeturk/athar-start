import { useAssessment } from '../context/AssessmentContext';
import AssessmentLayout from '../components/assessment/AssessmentLayout';
import EntryScreen from '../components/assessment/EntryScreen';
import StudentInfoScreen from '../components/assessment/StudentInfoScreen';
import PreAssessmentScreen from '../components/assessment/PreAssessmentScreen';
import VideoScreen from '../components/assessment/VideoScreen';
import CareerTestScreen from '../components/assessment/CareerTestScreen';
import PostAssessmentScreen from '../components/assessment/PostAssessmentScreen';
import AIChatScreen from '../components/assessment/AIChatScreen';
import ResultsScreen from '../components/assessment/ResultsScreen';
import ReportScreen from '../components/assessment/ReportScreen';
import CertificateScreen from '../components/assessment/CertificateScreen';
import CompletionScreen from '../components/assessment/CompletionScreen';

const stepComponents = {
  'entry': EntryScreen,
  'info': StudentInfoScreen,
  'pre-assessment': PreAssessmentScreen,
  'orientation-1': VideoScreen,
  'orientation-2': VideoScreen,
  'orientation-3': VideoScreen,
  'orientation-4': VideoScreen,
  'career-test': CareerTestScreen,
  'decision-1': VideoScreen,
  'decision-2': VideoScreen,
  'decision-3': VideoScreen,
  'decision-4': VideoScreen,
  'post-assessment': PostAssessmentScreen,
  'ai-chat': AIChatScreen,
  'results': ResultsScreen,
  'report': ReportScreen,
  'certificate': CertificateScreen,
  'completion': CompletionScreen,
};

export default function AssessmentPage() {
  const { currentStepId } = useAssessment();
  const StepComponent = stepComponents[currentStepId] || EntryScreen;

  return (
    <AssessmentLayout>
      <StepComponent />
    </AssessmentLayout>
  );
}
