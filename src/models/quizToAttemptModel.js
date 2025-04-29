// quizToAttemptModel.js

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const quizToAttempt = new Schema(
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
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('quizToAttempt', quizToAttempt);
