/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
// factory pattern
import getValues from 'lodash/values';

function Video() {
  /**
   *
   * @param {Object} video: video fetched from YT
   */
  function convertDataFromYTToModel(video) {
    if (!video) return null;
    const {
      snippet: {
        title, description, position, thumbnails, playlistId,
        resourceId: { videoId },
      }, statistics,
    } = video;
    return {
      id: videoId,
      title,
      description,
      statistics,
      thumbnails: getValues(thumbnails),
      playlists: [{ playlistId, position }],
      isRemove: 0,
      version: 1,
    };
  }
  return {
    convertDataFromYTToModel,
  };
}

export default Video;
