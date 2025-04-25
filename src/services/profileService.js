import fs from 'fs';
import mongoose from 'mongoose';
import path from 'path';
import profileModel from '../models/profileModel.js';
import ExceptionHandler from '../utils/error.js';

const updateUserProfile = async (req) => {
  const userId = req.user._id.toString();
  const profile = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    ExceptionHandler(`No user with id: ${userId}`);
  }

  const oldProfile = await profileModel.findOne({ userId });
  const oldImagePath = oldProfile?.image || '';

  let image = oldImagePath;

  if (req.file) {
    image = req.file.path;

    if (oldImagePath && fs.existsSync(path.resolve(oldImagePath))) {
      fs.unlinkSync(path.resolve(oldImagePath));
    }
  }

  const cleanedProfile = Object.fromEntries(
    Object.entries(profile).filter(([_, value]) => value !== undefined)
  );

  const updatedProfile = await profileModel.findOneAndUpdate(
    { userId },
    { ...cleanedProfile, image },
    { new: true, upsert: true }
  );

  return updatedProfile;
};

const profileService = {
  updateUserProfile,
};

export default profileService;
