import playlistService from '../services/playlistService.js';
import successResponse from '../utils/successResponse.js';
class PlaylistController {
  async getPlaylists(req, res, next) {
    try {
      const playlists = await playlistService.getPlaylists(req, res);
      successResponse(res, 'Playlists fetched successfully', playlists);
    } catch (error) {
      next(error);
    }
  }
  async createPlaylist(req, res, next) {
    try {
      const playlist = await playlistService.createPlaylist(req, res);
      successResponse(res, 'Playlist created successfully', playlist);
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
