import { Router } from 'express';
import quizController from '../controllers/quizController.js';
const router = Router();

router.post('/generate-quiz', quizController.generateQuiz);

export default router;
