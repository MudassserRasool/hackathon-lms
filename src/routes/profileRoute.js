import { Router } from 'express';
import {
  getCurrentProfileInfo,
  updateProfileInfo,
} from '../controllers/profileController.js';
import upload from '../middlewares/multer.js';
const router = Router();

router.get('/', getCurrentProfileInfo);
router.put('/', upload.single('image'), updateProfileInfo);

export default router;
