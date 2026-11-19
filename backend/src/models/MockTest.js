import mongoose from 'mongoose';

const mockTestSchema = new mongoose.Schema(
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
      default: '',
    },
    durationMinutes: {
      type: Number,
      default: 15,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    isAiGenerated: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const MockTest = mongoose.model('MockTest', mockTestSchema);
export default MockTest;
