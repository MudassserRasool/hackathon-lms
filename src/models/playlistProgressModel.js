import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const playlistProgressSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  playlistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'playlists',
    required: true,
  },
  videosWatched: {
    type: [String],
    default: [],
  },
  progress: {
    type: Number,
    default: 0,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  lastWatched: {
    type: Date,
    default: Date.now,
  },
});

playlistProgressSchema.index({ userId: 1, playlistId: 1 }, { unique: true });

export default mongoose.model('playlistProgress', playlistProgressSchema);
