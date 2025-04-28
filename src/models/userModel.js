import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: true,
  },
  verificationCode: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    enum: ['student'],
    default: 'student',
  },
});
userSchema.index({ email: 1 });

export default mongoose.model('users', userSchema);
