import quizModel from '../models/quizModel.js';
import ExceptionHandler from '../utils/error.js';
import aiService from './aiService.js';

class QuizService {
  async generateQuiz(prompt) {
    if (!prompt) {
      ExceptionHandler.BadRequest('Prompt is required');
    }
    // console.log('Prompt:', prompt);
    const quizContent = await aiService.generateQuizByGemini(prompt);
    return quizContent;
  }

  async saveQuiz(quiz, userId) {
    const quizContent = await this.generateQuiz(quiz);
    console.log('***********************************************************');

    console.log(quizContent);
    console.log('***********************************************************');

    // return;
    if (!quizContent) {
      ExceptionHandler.BadRequest('Failed to generate quiz content');
    }
    quizContent['userId'] = userId;
    const newQuiz = await quizModel.create(quizContent);

    return newQuiz;
  }
}

export default new QuizService();
