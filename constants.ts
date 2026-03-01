
import { Concept, StudentProfile, Course, Exam, ExamResult, Story, Assignment, Lab, CommunityPost } from './types';

export const INITIAL_CONCEPTS: Concept[] = [
  {
    id: 'c1',
    name: 'Asymptotic Analysis',
    mastery: 0.85,
    retention: 0.72,
    dependencies: [],
    lastReviewed: '2024-05-15',
    nextReview: '2024-05-22',
    averageResponseTime: 42,
    confidenceTrend: [4, 4, 5, 4],
    learningState: 'mastered',
    priority: 'high'
  },
  {
    id: 'c2',
    name: 'Dynamic Programming',
    mastery: 0.42,
    retention: 0.35,
    dependencies: ['c1'],
    lastReviewed: '2024-05-18',
    nextReview: '2024-05-19',
    averageResponseTime: 125,
    confidenceTrend: [2, 3, 2, 3],
    learningState: 'review',
    priority: 'high'
  }
];

export const INITIAL_STUDENT: StudentProfile = {
  id: 'st-001',
  name: 'Alex Rivera',
  language: 'en',
  overallMastery: 0.55,
  examReadiness: 0.48,
  predictedRisk: 0.32,
  concepts: INITIAL_CONCEPTS,
  role: 'student'
};

export const SAMPLE_COURSES: Course[] = [
  {
    id: 'course-react',
    title: 'Mastering Modern React',
    description: 'Go from basic components to advanced patterns like Higher Order Components and Compound Components.',
    teacherId: 'teacher-js',
    teacherName: 'Prof. Kent Dodds',
    createdAt: new Date().toISOString(),
    modules: [
      { id: 'r1', title: 'The Virtual DOM Explained', type: 'video', url: 'https://www.youtube.com/embed/BYbgopx44vo' },
      { id: 'r2', title: 'React Hooks Deep Dive', type: 'video', url: 'https://www.youtube.com/embed/TNhaISOUy6Q' },
      { id: 'r3', title: 'State Management Design', type: 'text', content: 'Modern React favors local state and context for global state. Avoid over-complicating with external libraries unless necessary for high-performance data synchronization.' }
    ]
  },
  {
    id: 'course-python-ai',
    title: 'Python for AI Engineers',
    description: 'Master Python syntax, NumPy, and Pandas to prepare for Large Language Model integration.',
    teacherId: 'teacher-py',
    teacherName: 'Dr. Angela Yu',
    createdAt: new Date().toISOString(),
    modules: [
      { id: 'p1', title: 'Python List Comprehensions', type: 'video', url: 'https://www.youtube.com/embed/AhSvKGTh28Q' },
      { id: 'p2', title: 'NumPy for Matrix Ops', type: 'video', url: 'https://www.youtube.com/embed/QUT1VHiLmmI' },
      { id: 'p3', title: 'Pandas Dataframes', type: 'text', content: 'Pandas is the backbone of data manipulation in Python. Using dataframes allows for vectorized operations that are significantly faster than standard loops.' }
    ]
  },
  {
    id: 'course-quantum',
    title: 'Quantum Computing Foundations',
    description: 'Explore the world of qubits, superposition, and quantum algorithms that will define the next era of computation.',
    teacherId: 'teacher-phys',
    teacherName: 'Dr. Michio Kaku',
    createdAt: new Date().toISOString(),
    modules: [
      { id: 'q1', title: 'What is a Qubit?', type: 'video', url: 'https://www.youtube.com/embed/lypnkNm0B4A' },
      { id: 'q2', title: 'Superposition & Entanglement', type: 'video', url: 'https://www.youtube.com/embed/ZuvK-482nv8' },
      { id: 'q3', title: 'Schrödinger\'s Cat Paradox', type: 'text', content: 'The thought experiment illustrates a paradox of quantum superposition in which a cat may be simultaneously both alive and dead...' }
    ]
  },
  {
    id: 'course-ethics-ai',
    title: 'Ethics in Artificial Intelligence',
    description: 'A deep dive into the moral implications of algorithmic decision making and social impact.',
    teacherId: 'teacher-eth',
    teacherName: 'Elena Vossen',
    createdAt: new Date().toISOString(),
    modules: [
      { id: 'e1', title: 'The Alignment Problem', type: 'video', url: 'https://www.youtube.com/embed/h0d_G62Vp6I' },
      { id: 'e2', title: 'Bias in Algorithmic Credit Scoring', type: 'text', content: 'Explore how historical data can reinforce systemic biases in modern financial systems.' }
    ]
  }
];

export const SAMPLE_LABS: Lab[] = [
  { 
    id: 'lab-py-sort', 
    title: 'Python Sorting Engine', 
    type: 'code', 
    language: 'python', 
    prompt: 'Implement a merge sort algorithm that efficiently sorts a list of 1000 random integers.', 
    template: 'def merge_sort(arr):\n    # Write your logic here\n    return sorted(arr)\n\nprint(merge_sort([38, 27, 43, 3, 9, 82, 10]))',
    teacherId: 'teacher-js' 
  },
  { 
    id: 'lab-cpp-mem', 
    title: 'C++ Memory Management', 
    type: 'code', 
    language: 'cpp', 
    prompt: 'Create a simple linked list using pointers and ensure no memory leaks occur during deletion.', 
    template: '#include <iostream>\n\nint main() {\n    std::cout << "List Initialized..." << std::endl;\n    return 0;\n}',
    teacherId: 'teacher-py' 
  }
];

export const SAMPLE_ASSIGNMENTS: Assignment[] = [
  { id: 'a1', title: 'React Lifecycle Benchmarking', description: 'Analyze the performance impact of useEffect cleanup functions in large scale apps.', teacherId: 't1', teacherName: 'Prof. Sarah', deadline: '2024-06-15', createdAt: new Date().toISOString() },
  { id: 'a2', title: 'Zero Trust Network Design', description: 'Create a network diagram for a small corporate office implementing Zero Trust principles.', teacherId: 't1', teacherName: 'Kevin Mitnick', deadline: '2024-06-20', createdAt: new Date().toISOString() }
];

export const SAMPLE_EXAMS: Exam[] = [
  {
    id: 'exam-1',
    title: 'Full Stack Integration Quiz',
    topic: 'Web Development',
    duration: 15,
    published: true,
    createdAt: new Date().toISOString(),
    deadline: new Date(Date.now() + 86400000 * 7).toISOString(),
    questions: [
      { id: 'q1', question: 'What is the purpose of the useEffect hook in React?', options: ['Manage side effects', 'Direct DOM manipulation', 'Styling components', 'Database routing'], answer: 'Manage side effects', hint: 'Think about data fetching or subscriptions.' },
      { id: 'q2', question: 'Which protocol is used for secure shell access?', options: ['SSH', 'FTP', 'HTTP', 'SMTP'], answer: 'SSH', hint: 'Secure Shell Protocol.' }
    ]
  }
];

export const SAMPLE_RESULTS: ExamResult[] = [
  {
    id: 'res-1',
    examId: 'exam-1',
    examTitle: 'Full Stack Integration Quiz',
    studentId: 'st-001',
    studentName: 'Alex Rivera',
    score: 2,
    totalQuestions: 2,
    grade: 'A',
    analysis: 'Strong grasp of foundational web concepts and protocols.',
    timestamp: new Date().toISOString()
  }
];

export const SAMPLE_STORIES: Story[] = [
  {
    id: 'story-1',
    author: 'Prof. Sarah',
    type: 'voice',
    content: 'The new React performance assignment is now live. Focus on memoization.',
    timestamp: new Date().toISOString(),
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    visibility: 'all'
  }
];

export const SAMPLE_COMMUNITY_FEED: CommunityPost[] = [
  { 
    id: 'p1', 
    author: 'Prof. Sarah', 
    authorId: 'teach-001', 
    role: 'teacher', 
    content: 'Global Hackathon starts in 3 days. Ensure your logic paths are verified!', 
    likes: 45, 
    replies: 2, 
    timestamp: '2h ago', 
    isAnnouncement: true 
  }
];
