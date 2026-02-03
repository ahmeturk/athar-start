import mongoose from 'mongoose';

const assessmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  // Current progress
  currentStep: {
    type: String,
    enum: [
      'entry', 'info', 'pre-assessment',
      'orientation-1', 'orientation-2', 'orientation-3', 'orientation-4',
      'career-test',
      'decision-1', 'decision-2', 'decision-3', 'decision-4',
      'post-assessment', 'ai-chat', 'results', 'report', 'certificate', 'completion',
    ],
    default: 'entry',
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'abandoned'],
    default: 'in-progress',
  },
  // Student info collected during assessment
  studentInfo: {
    name: String,
    grade: String,
    city: String,
    school: String,
    age: Number,
  },
  // Pre-assessment survey (10 questions, 1-5 scale)
  preAssessmentAnswers: {
    type: Map,
    of: Number,
    default: new Map(),
  },
  // Career test - 40 RIASEC questions (1-5 scale)
  careerTestAnswers: {
    type: Map,
    of: Number,
    default: new Map(),
  },
  // Post-assessment survey (10 questions, 1-5 scale)
  postAssessmentAnswers: {
    type: Map,
    of: Number,
    default: new Map(),
  },
  // Video progress tracking
  watchedVideos: [{
    videoId: String,
    watchedAt: { type: Date, default: Date.now },
    duration: Number, // seconds watched
  }],
  // RIASEC Results
  results: {
    hollandCode: {
      type: String,
      default: null, // e.g., "RIA"
    },
    scores: {
      R: { type: Number, default: 0 }, // Realistic
      I: { type: Number, default: 0 }, // Investigative
      A: { type: Number, default: 0 }, // Artistic
      S: { type: Number, default: 0 }, // Social
      E: { type: Number, default: 0 }, // Enterprising
      C: { type: Number, default: 0 }, // Conventional
    },
    topCareers: [{
      title: String,
      titleAr: String,
      match: Number, // percentage
      description: String,
    }],
    personalityType: {
      title: String,
      titleAr: String,
      description: String,
    },
  },
  // AI Chat messages
  chatMessages: [{
    role: { type: String, enum: ['user', 'assistant'] },
    content: String,
    timestamp: { type: Date, default: Date.now },
  }],
  // Certificate
  certificateId: {
    type: String,
    unique: true,
    sparse: true,
  },
  certificateIssuedAt: {
    type: Date,
    default: null,
  },
  // Timing
  startedAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: {
    type: Date,
    default: null,
  },
  // Duration tracking per step (in seconds)
  stepDurations: {
    type: Map,
    of: Number,
    default: new Map(),
  },
}, {
  timestamps: true,
});

// Generate unique certificate ID
assessmentSchema.methods.generateCertificateId = function () {
  const prefix = 'ATHR';
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  this.certificateId = `${prefix}-${year}-${random}`;
  this.certificateIssuedAt = new Date();
  return this.certificateId;
};

// Calculate completion percentage
assessmentSchema.methods.getProgress = function () {
  const steps = [
    'entry', 'info', 'pre-assessment',
    'orientation-1', 'orientation-2', 'orientation-3', 'orientation-4',
    'career-test',
    'decision-1', 'decision-2', 'decision-3', 'decision-4',
    'post-assessment', 'ai-chat', 'results', 'report', 'certificate', 'completion',
  ];
  const currentIndex = steps.indexOf(this.currentStep);
  return Math.round(((currentIndex + 1) / steps.length) * 100);
};

// Index for finding active assessment by user
assessmentSchema.index({ user: 1, status: 1 });

const Assessment = mongoose.model('Assessment', assessmentSchema);
export default Assessment;
