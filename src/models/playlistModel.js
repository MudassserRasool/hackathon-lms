import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const playlistSchema = new Schema(
  {
    link: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('playlists', playlistSchema);
