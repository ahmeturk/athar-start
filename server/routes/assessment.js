import { Router } from 'express';
import {
  startAssessment,
  getCurrentAssessment,
  saveStudentInfo,
  savePreAssessment,
  markVideoWatched,
  saveCareerAnswers,
  savePostAssessment,
  sendChatMessage,
  updateStep,
  getResults,
  getHistory,
} from '../controllers/assessmentController.js';
import { protect } from '../middleware/auth.js';
import {
  validate,
  studentInfoSchema,
  assessmentAnswersSchema,
  chatMessageSchema,
} from '../middleware/validate.js';

const router = Router();

router.use(protect);

router.post('/start', startAssessment);
router.get('/current', getCurrentAssessment);
router.put('/student-info', validate(studentInfoSchema), saveStudentInfo);
router.put('/pre-answers', validate(assessmentAnswersSchema), savePreAssessment);
router.put('/video-watched', markVideoWatched);
router.put('/career-answers', validate(assessmentAnswersSchema), saveCareerAnswers);
router.put('/post-answers', validate(assessmentAnswersSchema), savePostAssessment);
router.post('/chat', validate(chatMessageSchema), sendChatMessage);
router.put('/step', updateStep);
router.get('/results', getResults);
router.get('/history', getHistory);

export default router;
