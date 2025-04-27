import quizService from '../services/quizService.js';
import successResponse from '../utils/successResponse.js';

class QuizController {
  async generateQuiz(req, res, next) {
    const { prompt, videoUrl } = req.body;
    const userId = req.user._id;
    try {
      const quiz = await quizService.generateQuiz(prompt, userId, videoUrl);
      return successResponse(res, 'Quiz generated successfully', quiz);
    } catch (error) {
      next(error);
    }
  }
}

export default new QuizController();
