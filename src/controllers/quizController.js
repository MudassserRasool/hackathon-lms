import quizService from '../services/quizService.js';
import successResponse from '../utils/successResponse.js';

class QuizController {
  async generateQuiz(req, res, next) {
    const { prompt, videoUrl } = req.body;
    const userId = req.user._id;
    try {
      const quizId = await quizService.generateQuiz(prompt, userId, videoUrl);
      return successResponse(res, 'Quiz generated successfully', { quizId });
    } catch (error) {
      next(error);
    }
  }

  async startQuiz(req, res, next) {
    const quiz = await quizService.startQuiz(req, res);
  }

  async getQuestion(req, res, next) {
    try {
      const questions = await quizService.getQuestion(req, res);
      return successResponse(res, 'Question fetched successfully', questions);
    } catch (error) {
      next(error);
    }
  }

  async submitQuestion(req, res, next) {
    try {
      const result = await quizService.submitQuestion(req, res);
      return successResponse(res, 'Question submitted successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async finishQuiz(req, res, next) {
    try {
      const result = await quizService.finishQuiz(req, res);
      return successResponse(res, 'Quiz finished successfully', result);
    } catch (error) {
      next(error);
    }
  }
}

export default new QuizController();
