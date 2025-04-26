import quizService from '../services/quizService.js';
import successResponse from '../utils/successResponse.js';

class QuizController {
  async generateQuiz(req, res, next) {
    const { prompt } = req.body;
    try {
      const quiz = await quizService.generateQuiz(prompt);
      return successResponse(res, 'Quiz generated successfully', quiz);
    } catch (error) {
      next(error);
    }
  }
}

export default new QuizController();
