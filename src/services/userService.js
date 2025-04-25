import bcrypt from 'bcryptjs';
import validator from 'validator';
import { otp, salt } from '../constants/index.js';
import messages from '../constants/messages.js';
import profileModel from '../models/profileModel.js';
import userModel from '../models/userModel.js';
import ExceptionHandler from '../utils/error.js';
import { createTransporter, generateToken } from '../utils/helper.js';

const loginUser = async (email, password) => {
  const user = await userModel.findOne({ email });
  if (!user) {
    ExceptionHandler.NotFound(messages.NOT_FOUND_USER);
  }
  if (!user.isVerified) {
    ExceptionHandler.Forbidden(messages.NOT_VERIFIED_USER);
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    ExceptionHandler.BadRequest(messages.INVALID_CREDENTIALS);
  }

  const token = generateToken(user._id);
  user.token = token;
  await user.save();
  return {
    email: user.email,
    token,
    role: user.role,
  };
};

const registerUser = async (email, password, role) => {
  if (!email || !password) {
    throw new Error(messages.MISSING_FIELDS);
  }
  // Check if the user already exists
  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    throw new Error(messages.ALREADY_EXIST_USER);
  }

  // Validate email format
  if (!validator.isEmail(email)) {
    throw new Error(messages.INVALID_CREDENTIALS);
  }

  // Validate password length
  if (password.length < 6) {
    throw new Error(messages.INVALID_CREDENTIALS);
  }

  // Hash the password

  const hash = await bcrypt.hash(password, salt);

  // Prepare email options
  const mailOptions = {
    to: email,
    from: `"Foodie" <mudasserasool@gmail.com>`,
    subject: 'OTP for account verification',
    text: otp().toString(),
  };

  // Send email
  const sendMail = async (mailOptions) => {
    const transporter = createTransporter();

    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject(error);
        } else {
          resolve('Email sent successfully: ' + info.response);
        }
      });
    });
  };

  try {
    await sendMail(mailOptions);
  } catch (error) {
    throw new Error(error.message);
  }

  // Create new user
  const user = new userModel({
    email,
    password: hash,
    verificationCode: otp,
    role,
  });
  const registeredUser = await user.save();

  return {
    id: registeredUser._id,
  };
};
const verifyOtp = async (email, otp) => {
  const user = await userModel.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }
  if (user.verificationCode !== otp) {
    throw new Error('Invalid OTP');
  }

  user.isVerified = true;
  const registeredUser = await user.save();

  await profileModel.create({
    email,
    userId: registeredUser._id,
    password: registeredUser.password,
  });

  const token = generateToken(registeredUser._id);

  return {
    email,
    token,
    id: registeredUser._id,
    role: registeredUser.role,
  };
};

const userService = {
  loginUser,
  verifyOtp,
  registerUser,
};
export { userService };
