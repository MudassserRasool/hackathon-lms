import axios from 'axios';
import { google } from 'googleapis';
import { GOOGLE_CONSOLE_API_KEY } from '../constants/environment.js';
import playlistModel from '../models/playlistModel.js';
import ExceptionHandler from '../utils/error.js';
import { mergeTranscriptText } from '../utils/youtube.js';
import youtubeVideoService from './youtubeVideoService.js';
const YOUTUBE_API_URL = (playlistId) =>
  `https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${playlistId}&key=${GOOGLE_CONSOLE_API_KEY}`;

const youtube = google.youtube({
  version: 'v3',
  auth: GOOGLE_CONSOLE_API_KEY, // Replace with your API key
});
class PlaylistService {
  async getPlaylists(req, res) {
    const userId = req.user._id.toString();

    const playlists = await playlistModel.find({ user: userId });
    return playlists;
  }

  async createPlaylist(req, res) {
    const { link } = req.body;
    const userId = req.user._id.toString();
    const title = await this.getPlaylistTitle(req.body.link);
    const playlistId = await this.extractPlaylistId(link);
    const playlistVideos = await this.getAllPlaylistVideos(playlistId);

    console.log('Playlist Videos:', playlistVideos);
    return;
    const playlist = await playlistModel.create({
      link,
      title,
      user: userId,
      videos: playlistVideos,
    });
    return playlist;
  }

  async getPlaylists(req, res) {
    const userId = req.user._id.toString();
    const playlists = await playlistModel.find({ user: userId });
    return playlists;
  }

  async deletePlaylist(req, res) {
    const { id } = req.params;
    const findPlaylist = await playlistModel.findById(id);
    if (!findPlaylist) {
      ExceptionHandler.NotFound('Playlist not found');
    }
    await playlistModel.findByIdAndDelete(id);
    return { message: 'Playlist deleted successfully' };
  }
  async updatePlaylist(req, res) {
    const { id } = req.params;
    const { link, title } = req.body;
    const playlist = await playlistModel.findByIdAndUpdate(
      id,
      { link, title },
      { new: true }
    );
    if (!playlist) {
      ExceptionHandler.NotFound('Playlist not found');
    }
    return playlist;
  }
  async getPlaylistById(req, res) {
    const { id } = req.params;
    const playlist = await playlistModel.findById(id);
    if (!playlist) {
      ExceptionHandler.NotFound('Playlist not found');
    }
    return playlist;
  }

  async extractPlaylistId(url) {
    try {
      const urlObj = new URL(url);

      // Handle standard YouTube playlist URLs
      if (urlObj.hostname.includes('youtube.com')) {
        const searchParams = new URLSearchParams(urlObj.search);
        return searchParams.get('list');
      }

      // Handle youtu.be short URLs
      if (urlObj.hostname === 'youtu.be') {
        const searchParams = new URLSearchParams(urlObj.search);
        return searchParams.get('list');
      }

      return null;
    } catch (error) {
      console.error('Invalid URL:', error.message);
      return null;
    }
  }

  async getPlaylistTitle(playlistUrl) {
    try {
      const playlistId = await this.extractPlaylistId(playlistUrl);

      if (!playlistId) {
        ExceptionHandler.NotFound('Could not extract playlist ID from URL');
      }

      const response = await axios.get(YOUTUBE_API_URL(playlistId));

      if (response.data.items.length === 0) {
        ExceptionHandler.NotFound('Playlist not found or is private');
      }

      return response.data.items[0].snippet.title;
    } catch (error) {
      throw error;
    }
  }

  async getPlaylistVideos(playlistId, pageToken) {
    try {
      const response = await youtube.playlistItems.list({
        part: 'snippet',
        playlistId: playlistId,
        maxResults: 50, // Adjust as needed, max is 50
        pageToken: pageToken,
      });

      // const transcript =
      //   await youtubeVideoService.extractYoutubeVideoTranscript(
      //     'https://www.youtube.com/watch?v=A2WFReES8CY'
      //   );
      // console.log(
      //   mergeTranscriptText(transcript),
      //   'transcript-----------------------------'
      // );

      const videoPromises = response.data.items.map(async (item) => ({
        title: item.snippet.title,
        videoId: item.snippet.resourceId.videoId,
        thumbnail: item.snippet.thumbnails.default.url,
        videoUrl: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
        transcript: mergeTranscriptText(
          await youtubeVideoService.extractYoutubeVideoTranscript(
            `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`
          )
        ),
      }));
      const videos = await Promise.all(videoPromises);

      const nextPageToken = response.data.nextPageToken;

      return { videos, nextPageToken };
    } catch (error) {
      console.error('Error fetching playlist videos:', error);
      throw error;
    }
  }

  async getAllPlaylistVideos(playlistId) {
    let allVideos = [];
    let pageToken;

    do {
      const { videos, nextPageToken } = await this.getPlaylistVideos(
        playlistId,
        pageToken
      );
      allVideos = allVideos.concat(videos);
      pageToken = nextPageToken;
    } while (pageToken);

    return allVideos;
  }
}

export default new PlaylistService();
