import MockTest from '../models/MockTest.js';
import Question from '../models/Question.js';
import TestAttempt from '../models/TestAttempt.js';
import { generateMockQuestionsWithGroq, generateAiExplanationWithGroq } from '../services/groqService.js';
import { getCache, setCache, deleteCache } from '../config/redis.js';

export const getAllMockTests = async (req, res, next) => {
  try {
    const { category } = req.query;
    const cacheKey = `mock_tests:${category || 'all'}`;
    const cached = await getCache(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const filter = category && category !== 'All' ? { category } : {};
    const tests = await MockTest.find(filter)
      .select('-questions')
      .sort({ createdAt: -1 });

    // Attach question count cleanly
    const formatted = await Promise.all(
      tests.map(async (test) => {
        const full = await MockTest.findById(test._id).select('questions');
        return {
          ...test.toObject(),
          questionCount: full?.questions?.length || 0,
        };
      })
    );

    await setCache(cacheKey, formatted, 300);
    res.json(formatted);
  } catch (error) {
    next(error);
  }
};

export const getMockTestById = async (req, res, next) => {
  try {
    const test = await MockTest.findById(req.params.id).populate('questions');
    if (!test) {
      res.status(404);
      throw new Error('Mock test not found');
    }
    res.json(test);
  } catch (error) {
    next(error);
  }
};

export const generateAiMockTest = async (req, res, next) => {
  try {
    const { category = 'Computer Science', topic = 'Data Structures', difficulty = 'Medium', questionCount = 5, durationMinutes = 10 } = req.body;

    const generatedQuestions = await generateMockQuestionsWithGroq({
      category,
      topic,
      difficulty,
      count: Math.min(Number(questionCount) || 5, 15),
    });

    const savedQuestions = await Question.insertMany(generatedQuestions);

    const mockTest = await MockTest.create({
      title: `AI Mock: ${topic} (${difficulty})`,
      category,
      description: `Custom Groq AI generated mock test covering ${topic}.`,
      durationMinutes: Number(durationMinutes) || 10,
      difficulty,
      questions: savedQuestions.map((q) => q._id),
      createdBy: req.user._id,
      isAiGenerated: true,
    });

    await deleteCache('mock_tests:all');
    await deleteCache(`mock_tests:${category}`);

    const populated = await MockTest.findById(mockTest._id).populate('questions');
    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

export const submitTestAttempt = async (req, res, next) => {
  try {
    const { mockTestId, answers, timeTakenSeconds } = req.body;

    const mockTest = await MockTest.findById(mockTestId).populate('questions');
    if (!mockTest) {
      res.status(404);
      throw new Error('Mock test not found');
    }

    let correctCount = 0;
    let wrongCount = 0;
    let unansweredCount = 0;

    const evaluatedAnswers = mockTest.questions.map((question) => {
      const userAns = answers.find((a) => String(a.questionId) === String(question._id));
      const selectedOptionIndex = userAns && userAns.selectedOptionIndex !== undefined ? userAns.selectedOptionIndex : null;

      let isCorrect = false;
      if (selectedOptionIndex === null || selectedOptionIndex === -1) {
        unansweredCount++;
      } else if (selectedOptionIndex === question.correctOptionIndex) {
        correctCount++;
        isCorrect = true;
      } else {
        wrongCount++;
      }

      return {
        question: question._id,
        selectedOptionIndex,
        isCorrect,
        timeSpentSeconds: userAns?.timeSpentSeconds || 0,
      };
    });

    const totalQuestions = mockTest.questions.length;
    const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    const attempt = await TestAttempt.create({
      user: req.user._id,
      mockTest: mockTest._id,
      testTitle: mockTest.title,
      category: mockTest.category,
      score: correctCount * 4 - wrongCount * 1, // +4 / -1 competitive marking
      totalQuestions,
      correctCount,
      wrongCount,
      unansweredCount,
      accuracy,
      timeTakenSeconds: timeTakenSeconds || 0,
      answers: evaluatedAnswers,
    });

    const populatedAttempt = await TestAttempt.findById(attempt._id).populate('answers.question');
    res.status(201).json(populatedAttempt);
  } catch (error) {
    next(error);
  }
};

export const getUserAnalytics = async (req, res, next) => {
  try {
    const attempts = await TestAttempt.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('answers.question');

    const totalTests = attempts.length;
    const totalQuestionsSolved = attempts.reduce((acc, a) => acc + a.totalQuestions, 0);
    const totalCorrect = attempts.reduce((acc, a) => acc + a.correctCount, 0);
    const averageAccuracy = totalTests > 0
      ? Math.round(attempts.reduce((acc, a) => acc + a.accuracy, 0) / totalTests)
      : 0;

    // Category-wise breakdown
    const categoryMap = {};
    attempts.forEach((attempt) => {
      if (!categoryMap[attempt.category]) {
        categoryMap[attempt.category] = { category: attempt.category, tests: 0, totalAccuracy: 0 };
      }
      categoryMap[attempt.category].tests += 1;
      categoryMap[attempt.category].totalAccuracy += attempt.accuracy;
    });

    const categoryBreakdown = Object.values(categoryMap).map((item) => ({
      category: item.category,
      tests: item.tests,
      averageAccuracy: Math.round(item.totalAccuracy / item.tests),
    }));

    res.json({
      summary: {
        totalTests,
        totalQuestionsSolved,
        totalCorrect,
        averageAccuracy,
      },
      categoryBreakdown,
      recentAttempts: attempts.slice(0, 10),
    });
  } catch (error) {
    next(error);
  }
};

export const getAiQuestionExplanation = async (req, res, next) => {
  try {
    const { questionId, userSelectedIndex } = req.body;
    const question = await Question.findById(questionId);

    if (!question) {
      res.status(404);
      throw new Error('Question not found');
    }

    const explanation = await generateAiExplanationWithGroq({
      questionText: question.questionText,
      options: question.options,
      correctOptionIndex: question.correctOptionIndex,
      userSelectedIndex,
    });

    res.json({ questionId, explanation });
  } catch (error) {
    next(error);
  }
};

export const getOfflineBundle = async (req, res, next) => {
  try {
    const tests = await MockTest.find().populate('questions').limit(10);
    res.json({
      syncedAt: new Date().toISOString(),
      tests,
    });
  } catch (error) {
    next(error);
  }
};
