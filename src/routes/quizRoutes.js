import { Router } from 'express';
import quizController from '../controllers/quizController.js';
const router = Router();

router.post('/generate-quiz', quizController.generateQuiz);
router.post('/start-quiz', quizController.startQuiz);
router.get('/question/:quizId', quizController.getQuestion);
router.post('/submit-question', quizController.submitQuestion);
router.patch('/finish-quiz/:quizId', quizController.finishQuiz);

export default router;
