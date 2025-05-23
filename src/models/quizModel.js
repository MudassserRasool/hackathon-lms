import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const quizSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: false,
    },
    difficulty: {
      type: String,
      // enum: ['easy', 'medium', 'hard'],
      required: true,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    totalMarks: {
      type: Number,
      required: true,
    },

    questions: [
      {
        question: {
          type: String,
          required: true,
        },
        difficulty: {
          type: String,
          enum: ['easy', 'medium', 'hard'],
          required: true,
        },
        options: [
          {
            optionText: {
              type: String,
              required: true,
            },
            isCorrect: {
              type: Boolean,
              default: false,
            },
          },
        ],
        hint: {
          type: String,
          required: false,
        },
        isAttempted: {
          type: Boolean,
          default: false,
        },
        answer: {
          type: String,
          required: false,
        },
        isCorrect: {
          type: Boolean,
          default: false,
        },
      },
    ],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const quizModel = mongoose.model('quiz', quizSchema);
export default quizModel;
