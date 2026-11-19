import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Question from '../models/Question.js';
import MockTest from '../models/MockTest.js';
import TestPack from '../models/TestPack.js';
import TestAttempt from '../models/TestAttempt.js';
import Bookmark from '../models/Bookmark.js';
import Cart from '../models/Cart.js';

dotenv.config();

const sampleQuestions = [
  {
    category: 'Computer Science',
    topic: 'Data Structures',
    difficulty: 'Easy',
    questionText: 'What is the average time complexity of searching an element in a balanced Binary Search Tree (BST)?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
    correctOptionIndex: 1,
    explanation: 'In a balanced BST, each comparison halves the remaining search space, resulting in O(log n) time complexity.',
  },
  {
    category: 'Computer Science',
    topic: 'Algorithms',
    difficulty: 'Medium',
    questionText: 'Which algorithm is most suitable for finding the shortest path in a weighted graph with non-negative edge weights?',
    options: ['Depth-First Search', 'Dijkstra’s Algorithm', 'Kruskal’s Algorithm', 'Prim’s Algorithm'],
    correctOptionIndex: 1,
    explanation: 'Dijkstra’s Algorithm greedily selects the unvisited vertex with the smallest tentative distance, guaranteeing shortest paths for non-negative weights.',
  },
  {
    category: 'Computer Science',
    topic: 'Operating Systems',
    difficulty: 'Medium',
    questionText: 'Which condition is NOT one of the four Coffman conditions required for a deadlock to occur?',
    options: ['Mutual Exclusion', 'Hold and Wait', 'Preemption', 'Circular Wait'],
    correctOptionIndex: 2,
    explanation: 'Deadlock requires NO preemption (resources cannot be forcibly taken). Preemption prevents deadlock.',
  },
  {
    category: 'Computer Science',
    topic: 'Databases',
    difficulty: 'Easy',
    questionText: 'Which normal form eliminates transitive functional dependencies?',
    options: ['1NF', '2NF', '3NF', 'BCNF'],
    correctOptionIndex: 2,
    explanation: 'Third Normal Form (3NF) requires that a relation is in 2NF and no non-prime attribute is transitively dependent on the primary key.',
  },
  {
    category: 'Computer Science',
    topic: 'Networking',
    difficulty: 'Hard',
    questionText: 'At which OSI layer does the ARP (Address Resolution Protocol) operate?',
    options: ['Physical Layer', 'Data Link Layer', 'Transport Layer', 'Session Layer'],
    correctOptionIndex: 1,
    explanation: 'ARP maps IPv4 addresses to MAC hardware addresses directly over Ethernet frames at the Data Link Layer (Layer 2).',
  },
  {
    category: 'Quantitative Aptitude',
    topic: 'Percentages & Profit',
    difficulty: 'Easy',
    questionText: 'A shopkeeper marks an item 40% above cost price and offers a 20% discount. What is the net profit percentage?',
    options: ['10%', '12%', '15%', '20%'],
    correctOptionIndex: 1,
    explanation: 'Let CP = 100. Marked Price = 140. After 20% discount, SP = 140 * 0.80 = 112. Net profit = 112 - 100 = 12%.',
  },
  {
    category: 'Quantitative Aptitude',
    topic: 'Time & Work',
    difficulty: 'Medium',
    questionText: 'A can complete a task in 12 days and B can complete it in 18 days. Working together, how many days will they take?',
    options: ['6.5 days', '7.2 days', '8.0 days', '9.5 days'],
    correctOptionIndex: 1,
    explanation: 'Combined 1-day work = 1/12 + 1/18 = (3 + 2)/36 = 5/36. Total time = 36/5 = 7.2 days.',
  },
  {
    category: 'Quantitative Aptitude',
    topic: 'Speed & Distance',
    difficulty: 'Medium',
    questionText: 'A train 150 meters long passes a pole in 15 seconds. What is its speed in km/hr?',
    options: ['30 km/hr', '36 km/hr', '40 km/hr', '45 km/hr'],
    correctOptionIndex: 1,
    explanation: 'Speed = 150 m / 15 s = 10 m/s. Converting to km/hr: 10 * (18/5) = 36 km/hr.',
  },
  {
    category: 'Logical Reasoning',
    topic: 'Number Series',
    difficulty: 'Easy',
    questionText: 'Find the next number in the series: 3, 7, 15, 31, 63, ?',
    options: ['125', '127', '129', '131'],
    correctOptionIndex: 1,
    explanation: 'Each term follows the pattern (previous * 2) + 1. So 63 * 2 + 1 = 127.',
  },
  {
    category: 'Logical Reasoning',
    topic: 'Syllogisms',
    difficulty: 'Medium',
    questionText: 'Statements: All coders are thinkers. Some thinkers are artists. Conclusion: Some coders are artists.',
    options: ['Definitely True', 'Definitely False', 'Cannot be determined', 'Partially True'],
    correctOptionIndex: 2,
    explanation: 'There is no direct overlap established between coders and artists, so the conclusion cannot be definitively determined.',
  },
];

const sampleTestPacks = [
  {
    title: 'CS & IT Officer Mega Test Series',
    category: 'Computer Science',
    description: '25 full-length timed mock tests covering DSA, OS, DBMS, Computer Networks & System Design.',
    price: 499,
    originalPrice: 1299,
    testCount: 25,
    questionCount: 1500,
    badge: 'Bestseller',
    features: ['Detailed AI Explanations', 'All-India Percentile Rank', 'Offline Download Access'],
  },
  {
    title: 'Banking & SSC Quantitative Booster',
    category: 'Quantitative Aptitude',
    description: 'High-speed arithmetic, data interpretation, and shortcut tricks with sectional timers.',
    price: 349,
    originalPrice: 899,
    testCount: 20,
    questionCount: 1000,
    badge: 'Popular',
    features: ['Speed Analytics', 'Topic-wise Weak Area Detection', '1 Year Validity'],
  },
  {
    title: 'Ultimate Reasoning & Puzzle Vault',
    category: 'Logical Reasoning',
    description: 'Master seating arrangements, syllogisms, blood relations, and critical reasoning sets.',
    price: 299,
    originalPrice: 799,
    testCount: 15,
    questionCount: 750,
    badge: 'New',
    features: ['Step-by-step Visual Solutions', 'Unlimited Re-attempts'],
  },
];

export const seedDatabase = async () => {
  try {
    await connectDB();

    await Promise.all([
      User.deleteMany({}),
      Question.deleteMany({}),
      MockTest.deleteMany({}),
      TestPack.deleteMany({}),
      TestAttempt.deleteMany({}),
      Bookmark.deleteMany({}),
      Cart.deleteMany({}),
    ]);

    const demoUser = await User.create({
      name: 'Rohan Rawat',
      email: 'demo@preppilot.ai',
      password: 'password123',
      targetExam: 'IT Officer & Banking Mains 2026',
      phone: '+91 9876543210',
      bio: 'Focused on cracking competitive technical and aptitude exams.',
      streakDays: 7,
    });

    const createdQuestions = await Question.insertMany(sampleQuestions);
    const csQuestions = createdQuestions.filter((q) => q.category === 'Computer Science');
    const quantQuestions = createdQuestions.filter((q) => q.category !== 'Computer Science');

    const test1 = await MockTest.create({
      title: 'Core Computer Science Foundation Mock',
      category: 'Computer Science',
      description: 'Essential CS fundamentals test covering DSA, OS, DBMS, and Networks.',
      durationMinutes: 10,
      difficulty: 'Medium',
      questions: csQuestions.map((q) => q._id),
    });

    const test2 = await MockTest.create({
      title: 'Aptitude & Reasoning Speed Challenge',
      category: 'Quantitative Aptitude',
      description: 'Timed speed test for quantitative aptitude and logical reasoning.',
      durationMinutes: 10,
      difficulty: 'Easy',
      questions: quantQuestions.map((q) => q._id),
    });

    await TestPack.insertMany(sampleTestPacks);

    // Seed one sample attempt for instant analytics preview
    await TestAttempt.create({
      user: demoUser._id,
      mockTest: test1._id,
      testTitle: test1.title,
      category: test1.category,
      score: 15,
      totalQuestions: 5,
      correctCount: 4,
      wrongCount: 1,
      unansweredCount: 0,
      accuracy: 80,
      timeTakenSeconds: 340,
      answers: csQuestions.map((q, idx) => ({
        question: q._id,
        selectedOptionIndex: idx === 4 ? 0 : q.correctOptionIndex,
        isCorrect: idx !== 4,
        timeSpentSeconds: 68,
      })),
    });

    // Seed one bookmark
    await Bookmark.create({
      user: demoUser._id,
      question: csQuestions[1]._id,
      note: 'Review Dijkstra vs Bellman-Ford complexity before exam.',
    });

    console.log('Seed Data Populated Successfully!');
    console.log('Demo Login -> Email: demo@preppilot.ai | Password: password123');
    process.exit(0);
  } catch (error) {
    console.error('Seed Error:', error);
    process.exit(1);
  }
};

seedDatabase();
