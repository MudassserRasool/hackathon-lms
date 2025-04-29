import { QUIZ_TYPES } from '../constants/quiz.js';
import quizModel from '../models/quizModel.js';
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
    const isQuizExist = await quizModel.findOne({ videoUrl });
    if (isQuizExist) {
      ExceptionHandler.BadRequest('Quiz already exists for this video URL');
    }

    // console.log('Prompt:', prompt);
    const quizContent = await aiService.generateQuizByOpenAI(prompt);
    console.log('Quiz Content inside generateQuiz service:', quizContent);
    await this.saveQuiz(quizContent, userId, videoUrl);
    return quizContent;
  }

  async saveQuiz(quizContent, userId, videoUrl) {
    // return;
    if (!quizContent) {
      ExceptionHandler.BadRequest('Quiz content not found to save in db');
    }
    quizContent['userId'] = userId;
    quizContent['videoUrl'] = videoUrl;
    const newQuiz = await quizModel.create(quizContent);

    return newQuiz;
  }

  async startQuiz(req, res) {
    const { quizType , videoUrl} = req.body;
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
}

export default new QuizService();
