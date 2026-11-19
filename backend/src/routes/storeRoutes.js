import express from 'express';
import {
  getStorePacks,
  getCart,
  addToCart,
  removeFromCart,
  checkoutCartPlaceholder,
} from '../controllers/storeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/store/packs:
 *   get:
 *     summary: Get premium exam test packs
 *     tags: [Store & Cart]
 *     responses:
 *       200:
 *         description: List of test packs
 */
router.get('/packs', protect, getStorePacks);

/**
 * @swagger
 * /api/store/cart:
 *   get:
 *     summary: Get current user cart
 *     tags: [Store & Cart]
 *     responses:
 *       200:
 *         description: Cart items
 *   post:
 *     summary: Add test pack to cart
 *     tags: [Store & Cart]
 *     responses:
 *       200:
 *         description: Updated cart
 */
router.route('/cart').get(protect, getCart).post(protect, addToCart);

/**
 * @swagger
 * /api/store/cart/{packId}:
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Store & Cart]
 *     responses:
 *       200:
 *         description: Updated cart
 */
router.delete('/cart/:packId', protect, removeFromCart);

/**
 * @swagger
 * /api/store/checkout:
 *   post:
 *     summary: Checkout cart (Payment gateway integration in final phase)
 *     tags: [Store & Cart]
 *     responses:
 *       200:
 *         description: Order reservation response
 */
router.post('/checkout', protect, checkoutCartPlaceholder);

export default router;
