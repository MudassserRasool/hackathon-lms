/**
 * Merges transcript segments into a single string
 * @param {Array} transcriptSegments - Array of transcript segment objects
 * @returns {string} - Combined transcript text
 */
function mergeTranscriptText(transcriptSegments) {
  // Sort segments by offset to ensure correct sequence
  const sortedSegments = [...transcriptSegments].sort(
    (a, b) => a.offset - b.offset
  );

  // Extract and join all text fields, preserving newlines
  const mergedText = sortedSegments
    .map((segment) => segment.text)
    .join(' ')
    // Remove extra spaces that might appear when joining segments
    .replace(/\s+/g, ' ')
    // Preserve intentional newlines
    .replace(/ \n /g, '\n')
    .trim();

  return mergedText;
}

export { mergeTranscriptText };
