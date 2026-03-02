
export type UserRole = 'student' | 'teacher';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface Attachment {
  name: string;
  type: string;
  url?: string;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  answer: string;
  hint: string;
}

export interface Exam {
  id: string;
  title: string;
  topic: string;
  questions: Question[];
  duration: number;
  published: boolean;
  createdAt: string;
  deadline?: string;
}

export interface ExamResult {
  id: string;
  examId: string;
  examTitle: string;
  studentId: string;
  studentName: string;
  score: number;
  totalQuestions: number;
  grade: string;
  analysis: string;
  timestamp: string;
}

export interface Story {
  id: string;
  author: string;
  type: 'video' | 'voice' | 'link';
  content: string;
  timestamp: string;
  url?: string;
  visibility: 'all' | 'groups' | 'private';
}

export interface CommunityPost {
  id: string;
  author: string;
  authorId: string;
  role: UserRole;
  content: string;
  likes: number;
  replies: number;
  timestamp: string;
  isAnnouncement?: boolean;
  isVoiceAnnouncement?: boolean;
  voiceUrl?: string;
  attachments?: Attachment[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'exam' | 'post' | 'story' | 'assignment';
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  teacherId: string;
  teacherName: string;
  deadline: string;
  createdAt: string;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  content: string;
  attachments: Attachment[];
  submittedAt: string;
  feedback?: SubmissionFeedback;
}

export interface Lab {
  id: string;
  title: string;
  type: 'code' | 'essay' | 'presentation';
  language?: 'python' | 'cpp' | 'c' | 'java';
  prompt: string;
  template?: string;
  teacherId: string;
}

export interface LabSubmission {
  id: string;
  labId: string;
  studentId: string;
  content: string;
  output?: string;
  timestamp: string;
}

export interface Module {
  id: string;
  title: string;
  type: 'video' | 'file' | 'text';
  content?: string;
  url?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  teacherId: string;
  teacherName: string;
  modules: Module[];
  createdAt: string;
}

export interface UserProgress {
  userId: string;
  courseId: string;
  completedModuleIds: string[];
  examScore?: number;
  isExamTaken?: boolean;
}

export interface Certificate {
  id: string;
  courseId: string;
  courseTitle: string;
  studentName: string;
  issueDate: string;
  verificationId: string;
  poeticContent: string;
}

export interface Concept {
  id: string;
  name: string;
  mastery: number;
  retention: number;
  dependencies: string[];
  lastReviewed: string;
  nextReview: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  learningState: 'new' | 'learning' | 'review' | 'mastered';
  averageResponseTime: number;
  confidenceTrend: number[];
}

export interface StudentProfile {
  id: string;
  name: string;
  language: 'en' | 'hi' | 'ta' | 'te' | 'bn';
  overallMastery: number;
  examReadiness: number; 
  predictedRisk: number; 
  concepts: Concept[];
  role: UserRole;
}

export interface SubmissionFeedback {
  originalityScore: number;
  overallGrade: string;
  criteria: { label: string; score: number; feedback: string }[];
  suggestions: string[];
  citations: string[];
  cheatRisk: 'low' | 'medium' | 'high';
}
