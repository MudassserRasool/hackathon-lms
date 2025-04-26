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
      required: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    videos: [
      {
        title: {
          type: String,
          required: true,
        },
        videoId: {
          type: String,
          required: true,
        },
        thumbnail: {
          type: String,
          required: true,
        },
        videoUrl: {
          type: String,
          required: true,
        },
        transcript: {
          type: String,
          required: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('playlists', playlistSchema);
