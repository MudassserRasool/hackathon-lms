// quizToAttemptModel.js

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const quizToAttemptSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    videoUrl: {
      type: String,
      required: false,
    },
    score: {
      type: Number,
      default: 0,
    },
    totalQuestions: {
      type: Number,
      default: 0,
    },
    isPaper: {
      type: Boolean,
      default: false,
    },
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'quiz',
      required: false,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    quiz: {
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
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
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

const quizToAttemptModel = mongoose.model('quizToAttempt', quizToAttemptSchema);
export default quizToAttemptModel;
