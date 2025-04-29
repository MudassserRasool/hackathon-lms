import playlistService from '../services/playlistService.js';
import successResponse from '../utils/successResponse.js';
class PlaylistController {
  async getPlaylists(req, res, next) {
    try {
      console.log(req.user._id.toString());
      const playlists = await playlistService.getPlaylists(req, res);
      console.log(playlists);
      successResponse(res, 'Playlists fetched successfully', playlists);
    } catch (error) {
      next(error);
    }
  }
  async createPlaylist(req, res, next) {
    try {
      const playlist = await playlistService.createPlaylist(req, res);
      successResponse(res, 'Playlist created successfully', true);
    } catch (error) {
      next(error);
    }
  }

  async enrollToPlaylist(req, res, next) {
    try {
      const playlist = await playlistService.enrollToPlaylist(req, res);
      successResponse(res, 'Enrolled to playlist successfully', playlist);
    } catch (error) {
      next(error);
    }
  }

  async getEnrolledPlaylists(req, res, next) {
    try {
      const playlists = await playlistService.getEnrolledPlaylists(req, res);
      successResponse(
        res,
        'Enrolled playlists fetched successfully',
        playlists
      );
    } catch (error) {
      next(error);
    }
  }

  async deletePlaylist(req, res, next) {
    try {
      const message = await playlistService.deletePlaylist(req, res);
      successResponse(res, message.message, null);
    } catch (error) {
      next(error);
    }
  }

  async updatePlaylist(req, res, next) {
    try {
      const playlist = await playlistService.updatePlaylist(req, res);
      successResponse(res, 'Playlist updated successfully', playlist);
    } catch (error) {
      next(error);
    }
  }

  async getPlaylistById(req, res, next) {
    try {
      const playlist = await playlistService.getPlaylistById(req, res);
      successResponse(res, 'Playlist fetched successfully', playlist);
    } catch (error) {
      next(error);
    }
  }
}

export default new PlaylistController();
