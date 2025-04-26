import { YoutubeTranscript } from 'youtube-transcript';

class YoutubeVideoService {
  async extractYoutubeVideoTranscript(url) {
    const transcript = await YoutubeTranscript.fetchTranscript(url);
    return transcript;
  }
}

export default new YoutubeVideoService();
