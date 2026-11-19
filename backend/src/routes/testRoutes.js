import express from 'express';
import {
  getAllMockTests,
  getMockTestById,
  generateAiMockTest,
  submitTestAttempt,
  getUserAnalytics,
  getAiQuestionExplanation,
  getOfflineBundle,
} from '../controllers/testController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/tests:
 *   get:
 *     summary: Get all available mock tests
 *     tags: [Mock Tests]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of mock tests
 */
router.get('/', protect, getAllMockTests);

/**
 * @swagger
 * /api/tests/offline-bundle:
 *   get:
 *     summary: Download mock tests & questions for offline caching
 *     tags: [Mock Tests]
 *     responses:
 *       200:
 *         description: Offline bundle JSON
 */
router.get('/offline-bundle', protect, getOfflineBundle);

/**
 * @swagger
 * /api/tests/analytics:
 *   get:
 *     summary: Get performance analytics for current user
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Performance summary & history
 */
router.get('/analytics', protect, getUserAnalytics);

/**
 * @swagger
 * /api/tests/generate-ai:
 *   post:
 *     summary: Generate a new custom mock test using Groq AI
 *     tags: [AI Engine]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category: { type: string }
 *               topic: { type: string }
 *               difficulty: { type: string }
 *               questionCount: { type: number }
 *               durationMinutes: { type: number }
 *     responses:
 *       201:
 *         description: AI Mock Test created
 */
router.post('/generate-ai', protect, generateAiMockTest);

/**
 * @swagger
 * /api/tests/ai-explain:
 *   post:
 *     summary: Get Groq AI step-by-step explanation for a question
 *     tags: [AI Engine]
 *     responses:
 *       200:
 *         description: AI explanation text
 */
router.post('/ai-explain', protect, getAiQuestionExplanation);

/**
 * @swagger
 * /api/tests/submit:
 *   post:
 *     summary: Submit timed exam answers and compute analytics
 *     tags: [Mock Tests]
 *     responses:
 *       201:
 *         description: Evaluated test attempt
 */
router.post('/submit', protect, submitTestAttempt);

/**
 * @swagger
 * /api/tests/{id}:
 *   get:
 *     summary: Get full mock test with questions by ID
 *     tags: [Mock Tests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Mock test object
 */
router.get('/:id', protect, getMockTestById);

export default router;
