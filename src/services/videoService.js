import playlistModel from '../models/playlistModel.js';
import playlistProgressModel from '../models/playlistProgressModel.js';
import ExceptionHandler from '../utils/error.js';
class VideoService {
  async addVideoProgress(req, res) {
    const userId = req.user._id.toString();
    const { videoId, playlistId } = req.body;

    // const existingProgress = await playlistProgressModel.findOne({
    //   userId,
    //   playlistId,
    // });
    const existingProgress = await this.getVideoProgress(req, res);

    let videoProgress;
    if (existingProgress) {
      if (!existingProgress.videosWatched.includes(videoId)) {
        existingProgress.videosWatched.push(videoId);
      }
      existingProgress.progress = Math.min(existingProgress.progress + 1, 100);
      existingProgress.lastWatched = Date.now();
      videoProgress = await existingProgress.save();
    } else {
      videoProgress = await playlistProgressModel.create({
        userId,
        playlistId,
        videosWatched: [videoId],
        progress: 1,
        isCompleted: true,
        lastWatched: Date.now(),
      });
    }
    //
    return videoProgress;
  }

  async getVideoProgress(req, res) {
    const userId = req.user._id.toString();
    const { playlistId } = req.body;

    const videoProgress = await playlistProgressModel.findOne({
      userId,
      playlistId,
    });

    if (!videoProgress) {
      ExceptionHandler.NotFound('No progress found for this playlist');
    }

    return videoProgress;
  }

  async getVideoById(req, res) {
    const { videoId, playlistId } = req.params;
    console.log('==============================');

    console.log('videoId', videoId);
    console.log('playlistId', playlistId);
    console.log('==============================');
    const playlist = await playlistModel.findOne(
      { _id: playlistId, 'videos._id': videoId },
      { 'videos.$': 1 }
    );

    // Extract the video object from the array
    const video = playlist ? playlist.videos[0] : null;
    if (!video) {
      ExceptionHandler.NotFound('Video not found');
    }
    return video;
  }
}

export default new VideoService();
