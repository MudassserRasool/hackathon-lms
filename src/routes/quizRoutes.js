import { Router } from 'express';
import quizController from '../controllers/quizController.js';
const router = Router();

router.post('/generate-quiz', quizController.generateQuiz);
router.post('/start-quiz', quizController.startQuiz);

export default router;
