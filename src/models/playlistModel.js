import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const playlistSchema = new Schema(
  {
    link: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    videoCount: {
      type: Number,
      required: false,
      default: 0,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    category: {
      type: String,
      required: false,
    },
    thumbnail: {
      type: String,
      required: false,
    },
    category: {
      type: String,
      required: false,
      default: 'Web Development',
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    enrollments: {
      type: Number,
      default: 0,
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
        // isWatched: {
        //   type: Boolean,
        //   default: false,
        // },
      },
    ],
    playlistUsers: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'users',
        },
        completedVideos: {
          type: Number,
          default: 0,
        },
        isEnrolled: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Add pre-save middleware to update videoCount
playlistSchema.pre('save', function (next) {
  this.videoCount = this.videos ? this.videos.length : 0;
  next();
});

export default mongoose.model('playlists', playlistSchema);
