import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      index: true,
    },
    topic: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
    questionText: {
      type: String,
      required: true,
    },
    options: {
      type: [String],
      required: true,
      validate: [(val) => val.length === 4, 'Question must have exactly 4 options'],
    },
    correctOptionIndex: {
      type: Number,
      required: true,
      min: 0,
      max: 3,
    },
    explanation: {
      type: String,
      default: '',
    },
    isAiGenerated: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Question = mongoose.model('Question', questionSchema);
export default Question;
