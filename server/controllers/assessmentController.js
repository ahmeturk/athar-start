import Assessment from '../models/Assessment.js';
import User from '../models/User.js';
import { calculateResults } from '../services/hollandService.js';
import { getAIResponse } from '../services/aiService.js';

/**
 * POST /api/assessment/start
 * Start a new assessment or resume existing
 */
export const startAssessment = async (req, res, next) => {
  try {
    // Check if user has an active assessment
    let assessment = await Assessment.findOne({
      user: req.user._id,
      status: 'in-progress',
    });

    if (assessment) {
      return res.json({
        success: true,
        message: 'استئناف التقييم الحالي',
        assessment,
        isResume: true,
      });
    }

    // Create new assessment
    assessment = await Assessment.create({
      user: req.user._id,
      startedAt: new Date(),
    });

    res.status(201).json({
      success: true,
      message: 'تم بدء التقييم',
      assessment,
      isResume: false,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/assessment/current
 * Get user's current/active assessment
 */
export const getCurrentAssessment = async (req, res, next) => {
  try {
    const assessment = await Assessment.findOne({
      user: req.user._id,
      status: 'in-progress',
    });

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'لا يوجد تقييم نشط',
      });
    }

    res.json({
      success: true,
      assessment,
      progress: assessment.getProgress(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/assessment/student-info
 */
export const saveStudentInfo = async (req, res, next) => {
  try {
    const assessment = await Assessment.findOne({
      user: req.user._id,
      status: 'in-progress',
    });

    if (!assessment) {
      return res.status(404).json({ success: false, message: 'لا يوجد تقييم نشط' });
    }

    assessment.studentInfo = req.validatedBody;
    assessment.currentStep = 'pre-assessment';

    // Also update user profile
    await User.findByIdAndUpdate(req.user._id, {
      grade: req.validatedBody.grade,
      city: req.validatedBody.city,
      school: req.validatedBody.school,
    });

    await assessment.save();

    res.json({
      success: true,
      message: 'تم حفظ البيانات',
      assessment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/assessment/pre-answers
 */
export const savePreAssessment = async (req, res, next) => {
  try {
    const assessment = await Assessment.findOne({
      user: req.user._id,
      status: 'in-progress',
    });

    if (!assessment) {
      return res.status(404).json({ success: false, message: 'لا يوجد تقييم نشط' });
    }

    assessment.preAssessmentAnswers = new Map(Object.entries(req.validatedBody.answers));
    assessment.currentStep = 'orientation-1';
    await assessment.save();

    res.json({ success: true, assessment });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/assessment/video-watched
 */
export const markVideoWatched = async (req, res, next) => {
  try {
    const { videoId, duration } = req.body;

    const assessment = await Assessment.findOne({
      user: req.user._id,
      status: 'in-progress',
    });

    if (!assessment) {
      return res.status(404).json({ success: false, message: 'لا يوجد تقييم نشط' });
    }

    // Add video to watched list
    const alreadyWatched = assessment.watchedVideos.some(v => v.videoId === videoId);
    if (!alreadyWatched) {
      assessment.watchedVideos.push({ videoId, duration });
    }

    // Determine next step based on video ID
    const videoStepMap = {
      'orientation-1': 'orientation-2',
      'orientation-2': 'orientation-3',
      'orientation-3': 'orientation-4',
      'orientation-4': 'career-test',
      'decision-1': 'decision-2',
      'decision-2': 'decision-3',
      'decision-3': 'decision-4',
      'decision-4': 'post-assessment',
    };

    if (videoStepMap[videoId]) {
      assessment.currentStep = videoStepMap[videoId];
    }

    await assessment.save();

    res.json({ success: true, assessment });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/assessment/career-answers
 * Submit career test (40 RIASEC questions)
 */
export const saveCareerAnswers = async (req, res, next) => {
  try {
    const assessment = await Assessment.findOne({
      user: req.user._id,
      status: 'in-progress',
    });

    if (!assessment) {
      return res.status(404).json({ success: false, message: 'لا يوجد تقييم نشط' });
    }

    assessment.careerTestAnswers = new Map(Object.entries(req.validatedBody.answers));

    // Calculate RIASEC results server-side
    const results = calculateResults(req.validatedBody.answers);
    assessment.results = results;
    assessment.currentStep = 'decision-1';

    await assessment.save();

    res.json({
      success: true,
      assessment,
      results,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/assessment/post-answers
 */
export const savePostAssessment = async (req, res, next) => {
  try {
    const assessment = await Assessment.findOne({
      user: req.user._id,
      status: 'in-progress',
    });

    if (!assessment) {
      return res.status(404).json({ success: false, message: 'لا يوجد تقييم نشط' });
    }

    assessment.postAssessmentAnswers = new Map(Object.entries(req.validatedBody.answers));
    assessment.currentStep = 'ai-chat';
    await assessment.save();

    res.json({ success: true, assessment });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/assessment/chat
 * Send a message to AI career advisor
 */
export const sendChatMessage = async (req, res, next) => {
  try {
    const { message } = req.validatedBody;

    const assessment = await Assessment.findOne({
      user: req.user._id,
      status: 'in-progress',
    });

    if (!assessment) {
      return res.status(404).json({ success: false, message: 'لا يوجد تقييم نشط' });
    }

    // Add user message
    assessment.chatMessages.push({
      role: 'user',
      content: message,
    });

    // Get AI response
    const aiResponse = await getAIResponse(
      assessment.chatMessages,
      assessment.results
    );

    // Add AI response
    assessment.chatMessages.push({
      role: 'assistant',
      content: aiResponse.content,
    });

    await assessment.save();

    res.json({
      success: true,
      message: aiResponse.content,
      model: aiResponse.model,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/assessment/step
 * Update current step
 */
export const updateStep = async (req, res, next) => {
  try {
    const { step } = req.body;

    const assessment = await Assessment.findOne({
      user: req.user._id,
      status: 'in-progress',
    });

    if (!assessment) {
      return res.status(404).json({ success: false, message: 'لا يوجد تقييم نشط' });
    }

    assessment.currentStep = step;

    // Mark as completed if reaching completion step
    if (step === 'completion') {
      assessment.status = 'completed';
      assessment.completedAt = new Date();
      assessment.generateCertificateId();
    }

    await assessment.save();

    res.json({ success: true, assessment });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/assessment/results
 */
export const getResults = async (req, res, next) => {
  try {
    const assessment = await Assessment.findOne({
      user: req.user._id,
      status: { $in: ['in-progress', 'completed'] },
    }).sort({ createdAt: -1 });

    if (!assessment || !assessment.results?.hollandCode) {
      return res.status(404).json({
        success: false,
        message: 'لم يتم إكمال الاختبار بعد',
      });
    }

    res.json({
      success: true,
      results: assessment.results,
      certificateId: assessment.certificateId,
      completedAt: assessment.completedAt,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/assessment/history
 */
export const getHistory = async (req, res, next) => {
  try {
    const assessments = await Assessment.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .select('status currentStep results.hollandCode certificateId startedAt completedAt');

    res.json({
      success: true,
      assessments,
    });
  } catch (error) {
    next(error);
  }
};
