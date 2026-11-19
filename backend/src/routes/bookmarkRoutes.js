import express from 'express';
import { getBookmarks, toggleBookmark } from '../controllers/bookmarkController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/bookmarks:
 *   get:
 *     summary: Get all bookmarked questions for user
 *     tags: [Bookmarks]
 *     responses:
 *       200:
 *         description: List of bookmarks
 */
router.get('/', protect, getBookmarks);

/**
 * @swagger
 * /api/bookmarks/toggle:
 *   post:
 *     summary: Bookmark or unbookmark a question
 *     tags: [Bookmarks]
 *     responses:
 *       200:
 *         description: Updated bookmark status
 */
router.post('/toggle', protect, toggleBookmark);

export default router;
