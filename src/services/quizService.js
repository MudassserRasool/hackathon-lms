import { QUIZ_TYPES } from '../constants/quiz.js';
import { quizPayload } from '../helper/payloadMaker.js';
import quizModel from '../models/quizModel.js';
import quizToAttemptModel from '../models/quizToAttemptModel.js';
import ExceptionHandler from '../utils/error.js';
import aiService from './aiService.js';

class QuizService {
  async generateQuiz(prompt, userId, videoUrl) {
    if (!prompt) {
      ExceptionHandler.BadRequest('Prompt is required');
    }
    if (!videoUrl) {
      ExceptionHandler.BadRequest('Video URL is required');
    }

    const isQuizExist = await quizModel
      .findOne({ videoUrl })
      .select('_id title videoUrl description questions');
    if (isQuizExist) {
      console.log('Quiz already exist for this video URL');
      console.log('Quiz:', isQuizExist);
      const quizPayloadFormatted = quizPayload(isQuizExist);
      quizPayloadFormatted['userId'] = userId;
      quizPayloadFormatted['videoUrl'] = videoUrl;
      console.log('Payload:', quizPayloadFormatted);
      const assignedQuiz = await quizToAttemptModel.create(
        quizPayloadFormatted
      );
      return assignedQuiz;
    }

    // console.log('Prompt:', prompt);
    const quizContent = await aiService.generateQuizByOpenAI(prompt);
    console.log('Quiz Content inside generateQuiz service:', quizContent);
    quizContent['userId'] = userId;
    quizContent['videoUrl'] = videoUrl;
    await this.saveQuiz(quizContent);
    return quizContent;
  }

  async saveQuiz(quizContent) {
    // return;
    if (!quizContent) {
      ExceptionHandler.BadRequest('Quiz content not found to save in db');
    }

    console.log(quizContent, 'quizContent');
    const quiz = await quizModel.create(quizContent);
    if (!quiz) {
      ExceptionHandler.BadRequest('Quiz not created');
    }

    const quizPayloadFormatted = quizPayload(quizContent);

    quizPayloadFormatted['userId'] = quizContent.userId;
    quizPayloadFormatted['videoUrl'] = quizContent.videoUrl;
    const assignedQuiz = await quizToAttemptModel.create(quizPayloadFormatted);

    return assignedQuiz;
  }

  async startQuiz(req, res) {
    const { quizType, videoUrl } = req.body;
    const userId = req.user._id.toString();

    if (!quizType) {
      ExceptionHandler.BadRequest('Quiz type is required');
    }
    if (!videoUrl) {
      ExceptionHandler.BadRequest('Video URL is required');
    }

    const findQuiz = await quizModel.findOne({ videoUrl });
    if (!findQuiz) {
      ExceptionHandler.BadRequest('Quiz not found for this video URL');
    }

    const quizToAttemptPayload = {
      userId,
      videoUrl,
    };

    if (quizType === QUIZ_TYPES.GRAND) {
    } else if (quizType === QUIZ_TYPES.PRACTICE) {
    }
  }

  // get random question if practice then get quiestion one by one from quizToAttemptModel
  async getQuestionsByQuizId(req, res) {
    const { quizId, quizType } = req.body;
    const userId = req.user._id.toString();
    if (!quizId) {
      ExceptionHandler.BadRequest('Quiz ID is required');
    }
    if (!quizType) {
      ExceptionHandler.BadRequest('Quiz type is required');
    }
    const findQuiz = await quizToAttemptModel.findOne({ _id: quizId });
    if (!findQuiz) {
      ExceptionHandler.BadRequest('Quiz not found for this video URL');
    }
    const quizToAttemptPayload = {
      userId,
      videoUrl: findQuiz.videoUrl,
    };
    const quizQuestions = findQuiz.questions;
    if (quizType === QUIZ_TYPES.GRAND) {
      // get random 20 questions
      const randomQuestions = quizQuestions
        .sort(() => Math.random() - Math.random())
        .slice(0, 20);
      return randomQuestions;
    } else if (quizType === QUIZ_TYPES.PRACTICE) {
      // get random 5 questions
      const randomQuestions = quizQuestions
        .sort(() => Math.random() - Math.random())
        .slice(0, 5);
      return randomQuestions;
    }

    // if quiz type is not valid
    if (!QUIZ_TYPES[quizType]) {
      ExceptionHandler.BadRequest('Quiz type is not valid');
    }

    // if quiz type is not valid
  }
}

export default new QuizService();
