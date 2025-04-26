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
    default: false,
  },
  verificationCode: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['rider', 'customer', 'admin'],
    default: 'customer',
  },
});
// userSchema.index({ email: 1 });

export default mongoose.model('users', userSchema);
