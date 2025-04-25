import profileModel from '../models/profileModel.js';
import profileService from '../services/profileService.js';
import ExceptionHandler from '../utils/error.js';
import successResponse from '../utils/successResponse.js';

// get the user profile with the id of the user
const getCurrentProfileInfo = async (req, res, next) => {
  const userId = req.user._id.toString(); // Convert ObjectId to string

  try {
    const profile = await profileModel.findOne({ userId: userId });

    if (!profile) {
      ExceptionHandler.NotFoundError('Profile not found');
    }

    successResponse(res, 'Profile fetched successfully', profile);
  } catch (error) {
    next(error);
  }
};

const updateProfileInfo = async (req, res, next) => {
  try {
    const result = await profileService.updateUserProfile(req);
    successResponse(res, 'Profile updated successfully', result);
  } catch (error) {
    next(error);
  }
};

export { getCurrentProfileInfo, updateProfileInfo };
