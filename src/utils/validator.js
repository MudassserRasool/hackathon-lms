function isYouTubePlaylist(url) {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.searchParams.has('list');
  } catch (error) {
    return false; // Invalid URL
  }
}

export { isYouTubePlaylist };
