import TestPack from '../models/TestPack.js';
import Cart from '../models/Cart.js';
import User from '../models/User.js';

export const getStorePacks = async (req, res, next) => {
  try {
    const packs = await TestPack.find().sort({ createdAt: 1 });
    res.json(packs);
  } catch (error) {
    next(error);
  }
};

export const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.testPack');
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const { testPackId } = req.body;
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const alreadyInCart = cart.items.some((item) => String(item.testPack) === String(testPackId));
    if (!alreadyInCart) {
      cart.items.push({ testPack: testPackId });
      await cart.save();
    }

    const populated = await Cart.findById(cart._id).populate('items.testPack');
    res.json(populated);
  } catch (error) {
    next(error);
  }
};

export const removeFromCart = async (req, res, next) => {
  try {
    const { packId } = req.params;
    const cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
      cart.items = cart.items.filter((item) => String(item.testPack) !== String(packId));
      await cart.save();
    }

    const populated = await Cart.findById(cart._id).populate('items.testPack');
    res.json(populated);
  } catch (error) {
    next(error);
  }
};

// Placeholder checkout endpoint (Final payment gateway integration scheduled for Phase 2)
export const checkoutCartPlaceholder = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart || cart.items.length === 0) {
      res.status(400);
      throw new Error('Your cart is empty');
    }

    const user = await User.findById(req.user._id);
    const packIds = cart.items.map((item) => item.testPack);

    packIds.forEach((id) => {
      if (!user.purchasedPacks.includes(id)) {
        user.purchasedPacks.push(id);
      }
    });

    await user.save();
    cart.items = [];
    await cart.save();

    res.json({
      status: 'PENDING_PAYMENT_GATEWAY',
      message: 'Order reserved! Live Payment Gateway integration will be enabled in the final release phase.',
      unlockedPacks: user.purchasedPacks,
    });
  } catch (error) {
    next(error);
  }
};
