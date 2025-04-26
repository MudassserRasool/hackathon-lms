import bcrypt from 'bcryptjs'; // vercel is not supporting it so use olde rversion or js-sha512
import validator from 'validator';
import { otp, salt } from '../constants/index.js';
import messages from '../constants/messages.js';
import profileModel from '../models/profileModel.js';
import userModel from '../models/userModel.js';
import emailService from '../services/emailService.js';
// import twilioService from '../services/twilioService.js';
import { userService } from '../services/userService.js';
import ExceptionHandler from '../utils/error.js';
import { generateToken } from '../utils/helper.js';
import successResponse from '../utils/successResponse.js';

// login user controller to save user data in mongoose database
const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const result = await userService.loginUser(email, password);
    successResponse(res, 'User logged in successfully', result);
  } catch (error) {
    next(error);
  }
};

const registerUser = async (req, res, next) => {
  const { email, phone, password, role } = req.body;
  // Check that both email and password are provided
  if (!email || !password) {
    return res.status(401).send({ message: 'Enter all input fields' });
  }

  if (!validator.isEmail(email)) {
    ExceptionHandler.BadRequest('Invalid Email');
  }

  if (password.length < 6) {
    ExceptionHandler.BadRequest('Password must be at least 6 characters');
  }
  //  validate password is strong
  if (!validator.isStrongPassword(password)) {
    ExceptionHandler.BadRequest(
      'Password must contain at least 1 lowercase, 1 uppercase, 1 numeric, 1 special character and must be at least 8 characters long'
    );
  }

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      if (existingUser.isVerified) {
        ExceptionHandler.Conflict(messages.ALREADY_EXIST_USER);
      } else if (!existingUser.isVerified) {
        ExceptionHandler.Forbidden(messages.NOT_VERIFIED_USER);
      }
    }
    const OTP = otp();
    await emailService.sendEmail(email, OTP);
    // await twilioService.sendSmsOtp(phone, OTP);

    const hash = await bcrypt.hash(password, salt);
    const user = new userModel({
      email,
      password: hash,
      verificationCode: OTP,
      role,
    });

    const token = generateToken(user._id);
    user.token = token;
    const registeredUser = await user.save();
    // registeredUser.token = token;

    successResponse(
      res,
      'User Registered Otp send to your email , Please verify otp to login',
      {
        ...registeredUser.toObject(), // Include user details
        // token, // Include the token explicitly
      }
    );
  } catch (error) {
    next(error);
  }
};

// get all users

const getAllUsers = async (req, res, next) => {
  const { role } = req.params;
  try {
    const users = await userModel.find({ role });
    const reversedUsers = users.reverse(); // Reverse the array
    successResponse(res, 'All users fetched successfully', reversedUsers);
  } catch (error) {
    next(error);
  }
};

// delete user by id
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await userModel.find();
    await userModel.findByIdAndDelete(id);
    await profileModel.findOneAndDelete({ email: user.email });
    successResponse(res, 'User deleted successfully', user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Verify otp
const verifyOtp = async (req, res, next) => {
  const { email, otp } = req.body;
  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      ExceptionHandler.NotFound(messages.NOT_FOUND_USER);
    }

    if (user.verificationCode != otp) {
      ExceptionHandler.BadRequest(messages.INVALID_OTP);
    }

    const token = generateToken(user._id);
    user.isVerified = true;
    const registeredUser = await user.save();

    // Check if profile already exists
    // const existingProfile = await profileModel.findOne({ email });
    // if (existingProfile) {
    //   return ExceptionHandler.Conflict('Profile already exists');
    // }

    await profileModel.create({
      email,
      userId: registeredUser._id,
      password: registeredUser.password,
    });

    successResponse(res, 'Your account is verified', {
      ...registeredUser.toObject(),
      token,
    });
  } catch (error) {
    next(error);
  }
};

// resend otp
const resendOtp = async (req, res, next) => {
  const { email } = req.body;
  console.log(email);

  // vlidte emeil
  if (!validator.isEmail(email)) {
    ExceptionHandler.BadRequest('Invalid Email');
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      ExceptionHandler.NotFound(messages.PLEASE_REGISTER);
    }
    // if (user.isVerified) {
    //   ExceptionHandler.Forbidden(messages.VERIFIED_PLEASE_LOGIN);
    // }
    user.verificationCode = otp();
    await user.save();
    await emailService.sendEmail(email, user.verificationCode);

    successResponse(res, 'OTP sent successfully', otp());
  } catch (error) {
    next(error);
  }
};

// verify resend otp
const verifyResendOtp = async (req, res, next) => {
  const { email, otp } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      ExceptionHandler.NotFound(messages.PLEASE_REGISTER);
    }
    if (user.verificationCode != otp) {
      ExceptionHandler.BadRequest(messages.INVALID_OTP);
    }
    user.isVerified = true;
    await user.save();

    successResponse(res, messages.ACCOUNT_VERIFIED);
  } catch (error) {
    next(error);
  }
};

// reset password by sending otp to the email
const forgetPasswordOtp = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      ExceptionHandler.NotFound(messages.NOT_FOUND_USER);
    }
    const OTP = otp();
    await emailService.sendEmail(email, OTP);
    user.verificationCode = OTP;
    await user.save();

    successResponse(res, messages.OTP_SENT);
  } catch (error) {
    next(error);
  }
};

// reset password by entering email otp and new password
const resetPassword = async (req, res, next) => {
  const { email, otp, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      ExceptionHandler.NotFound(messages.NOT_FOUND_USER);
    }
    if (user.verificationCode != otp) {
      ExceptionHandler.BadRequest(messages.INVALID_OTP);
    }
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    successResponse(res, messages.PASSWORD_RESET, {}, 201);
  } catch (error) {
    next(error);
  }
};
export {
  deleteUser,
  forgetPasswordOtp,
  getAllUsers,
  loginUser,
  registerUser,
  resendOtp,
  resetPassword,
  verifyOtp,
  verifyResendOtp,
};
