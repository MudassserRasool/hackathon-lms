import { Router } from 'express';
import {
  deleteUser,
  forgetPasswordOtp,
  getAllUsers,
  loginUser,
  registerUser,
  resendOtp,
  resetPassword,
  verifyOtp,
  verifyResendOtp,
} from '../controllers/userController.js';
const router = Router();
// login user
router.post('/login', loginUser);

// register user
router.post('/register', registerUser);

// get all users
router.get('/:role', getAllUsers);

// delete user by id
router.delete('/:id', deleteUser);

// verify otp
router.post('/verify-signup-otp', verifyOtp);

// resend otp to email
router.post('/resend-otp', resendOtp);

// verify resend otp
router.post('/verify-resend-otp', verifyResendOtp);

// reset password
router.post('/reset-password', resetPassword);

// get forget password otp
router.post('/forget-password', forgetPasswordOtp);
export default router;
