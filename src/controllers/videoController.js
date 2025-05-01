import videoService from '../services/videoService.js';
import successResponse from '../utils/successResponse.js';

class VideoController {
  async addVideoProgress(req, res, next) {
    try {
      const videoProgress = await videoService.addVideoProgress(req, res);
      successResponse(res, 'Video progress added successfully', videoProgress);
    } catch (error) {
      next(error);
    }
  }

  async getVideoById(req, res, next) {
    try {
      const video = await videoService.getVideoById(req, res);
      successResponse(res, 'Video fetched successfully', video);
    } catch (error) {
      next(error);
    }
  }
}

export default new VideoController();
