/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
// constructor pattern
import isEqual from 'lodash/isEqual';
import getValues from 'lodash/values';

function Video() {
  /**
   *
   * @param {Object} video: video fetched from YT
   */
  this.convertDataFromYTToModel = (video) => {
    if (!video) return null;
    const {
      snippet: {
        title, description, position, thumbnails, resourceId: { videoId }, playlistId,
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
  };
}

export default Video;
