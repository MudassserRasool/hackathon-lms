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
}

export default new QuizService();
