import mongoose from 'mongoose';

const testPackSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    originalPrice: {
      type: Number,
      required: true,
    },
    testCount: {
      type: Number,
      default: 10,
    },
    questionCount: {
      type: Number,
      default: 250,
    },
    badge: {
      type: String,
      default: 'Bestseller',
    },
    features: [String],
  },
  { timestamps: true }
);

const TestPack = mongoose.model('TestPack', testPackSchema);
export default TestPack;
