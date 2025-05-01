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
      const quizPayloadFormatted = quizPayload(isQuizExist);
      quizPayloadFormatted['userId'] = userId;
      quizPayloadFormatted['videoUrl'] = videoUrl;
      const assignedQuiz = await quizToAttemptModel.create(
        quizPayloadFormatted
      );
      return assignedQuiz._id;
    }

    // console.log('Prompt:', prompt);
    const quizContent = await aiService.generateQuizByOpenAI(prompt);
    console.log('Quiz Content inside generateQuiz service:', quizContent);
    quizContent['userId'] = userId;
    quizContent['videoUrl'] = videoUrl;
    const savedQuiz = await this.saveQuiz(quizContent);
    return savedQuiz._id;
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
    console.log('******************************************');
    console.log(quizPayloadFormatted, 'questions');
    console.log('******************************************');

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
  // async getQuestionsByQuizId(req, res) {
  //   const { quizId, quizType } = req.body;
  //   const userId = req.user._id.toString();
  //   if (!quizId) {
  //     ExceptionHandler.BadRequest('Quiz ID is required');
  //   }
  //   if (!quizType) {
  //     ExceptionHandler.BadRequest('Quiz type is required');
  //   }
  //   console.log(first);
  //   console.log('quizId:', quizId);
  //   const findQuiz = await quizToAttemptModel.findOne({ _id: quizId });
  //   if (!findQuiz) {
  //     ExceptionHandler.BadRequest('Quiz not found for this video URL');
  //   }

  //   const quizQuestions = findQuiz.questions;
  //   if (quizType === QUIZ_TYPES.GRAND) {
  //     // get random 20 questions
  //     const randomQuestions = quizQuestions
  //       .sort(() => Math.random() - Math.random())
  //       .slice(0, 20);
  //     return randomQuestions;
  //   } else if (quizType === QUIZ_TYPES.PRACTICE) {
  //     // get random 5 questions
  //     const randomQuestions = quizQuestions
  //       .sort(() => Math.random() - Math.random())
  //       .slice(0, 5);
  //     return randomQuestions;
  //   }

  //   // if quiz type is not valid
  //   if (!QUIZ_TYPES[quizType]) {
  //     ExceptionHandler.BadRequest('Quiz type is not valid');
  //   }

  //   // if quiz type is not valid
  // }

  async getQuestion(req, res) {
    const { quizId } = req.params;
    // from query params get quiztype
    const { quizType } = req.query;
    const userId = req.user._id.toString();
    if (!quizId) {
      ExceptionHandler.BadRequest('Quiz ID is required');
    }
    const findQuiz = await quizToAttemptModel.findOne({ _id: quizId, userId });
    if (!findQuiz) {
      ExceptionHandler.BadRequest('Quiz not found for this video URL');
    }
    if (findQuiz.isCompleted === true) {
      ExceptionHandler.BadRequest('Quiz is already completed');
    }
    console.log('findQuiz:', findQuiz);
    const questions = findQuiz.quiz.questions;

    let questionsArray;
    if (quizType === QUIZ_TYPES.GRAND) {
      //  get random 20 questions
      questionsArray = questions
        .sort(() => Math.random() - Math.random())
        .slice(0, 20);
    } else if (quizType === QUIZ_TYPES.PRACTICE) {
      // get random 5 questions
      questionsArray = questions
        .sort(() => Math.random() - Math.random())
        .slice(0, 5);
    }

    // return question on by one randomally whose isAttempted is false
    questionsArray = questionsArray.filter((question) => {
      return question.isAttempted === false;
    });
    if (questionsArray.length === 0) {
      ExceptionHandler.BadRequest('No questions available');
    }
    // get random question from questionsArray
    const randomQuestion =
      questionsArray[Math.floor(Math.random() * questionsArray.length)];
    return randomQuestion;
  }

  async submitQuestion(req, res) {
    const { quizId, questionId, answer } = req.body;
    if (!quizId || !questionId) {
      ExceptionHandler.BadRequest('Quiz ID and Question ID are required');
    }
    const findQuiz = await quizToAttemptModel.findOne({ _id: quizId });
    if (!findQuiz) {
      ExceptionHandler.BadRequest('Quiz not found');
    }
    const quizQuestions = findQuiz.quiz.questions;
    console.log(
      quizQuestions,
      'findQuiz',
      'quiz id = ',
      quizId,
      'questionId = ',
      questionId
    );

    const question = findQuiz.quiz.questions.find(
      (question) => question._id.toString() == questionId
    );
    if (!question) {
      ExceptionHandler.BadRequest('Question not found');
    }

    const optionsOfQuestion = question.options;
    const correctOption = optionsOfQuestion.find(
      (option) => option.isCorrect === true
    );
    const result = {
      questionId: question._id,
      answer: answer,
      correctOption,
      isCorrect: correctOption.optionText === answer ? true : false,
    };
    question.answer = answer;
    question.isAttempted = true;
    await findQuiz.save();

    return result;
  }

  async finishQuiz(req, res) {
    const { quizId } = req.params;
    if (!quizId) {
      ExceptionHandler.BadRequest('Quiz ID is required');
    }
    const findQuiz = await quizToAttemptModel.findOne({ _id: quizId });
    if (!findQuiz) {
      ExceptionHandler.BadRequest('Quiz not found');
    }
    const quizQuestions = findQuiz.quiz.questions;
    const totalMarks = quizQuestions.reduce((acc, question) => {
      if (question.isAttempted === true) {
        acc += 1;
      }
      return acc;
    }, 0);
    findQuiz.isCompleted = true;
    findQuiz.totalQuestions = findQuiz.quiz.questions.length;
    findQuiz.totalAttempted = totalMarks;

    // findQuiz.totalMarks = totalMarks;
    await findQuiz.save();
    return totalMarks;
  }
}

export default new QuizService();
