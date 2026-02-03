import apiClient from './client.js';

export const assessmentAPI = {
  start: () => apiClient.post('/assessment/start', {}),
  getCurrent: () => apiClient.get('/assessment/current'),
  saveStudentInfo: (data) => apiClient.put('/assessment/student-info', data),
  savePreAnswers: (answers) => apiClient.put('/assessment/pre-answers', { answers }),
  markVideoWatched: (videoId, duration) => apiClient.put('/assessment/video-watched', { videoId, duration }),
  saveCareerAnswers: (answers) => apiClient.put('/assessment/career-answers', { answers }),
  savePostAnswers: (answers) => apiClient.put('/assessment/post-answers', { answers }),
  sendChatMessage: (message) => apiClient.post('/assessment/chat', { message }),
  updateStep: (step) => apiClient.put('/assessment/step', { step }),
  getResults: () => apiClient.get('/assessment/results'),
  getHistory: () => apiClient.get('/assessment/history'),
};
