/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import getValues from 'lodash/values';

const VideoMapper = {};

VideoMapper.convertYtDataToModel = (ytVideo) => {
  if (!ytVideo) return null;
  const {
    snippet: {
      title, description, position, thumbnails, playlistId, publishedAt,
      resourceId: { videoId },
    }, statistics,
  } = ytVideo;

  return {
    id: videoId,
    title,
    description,
    statistics,
    publishedAt,
    thumbnails: getValues(thumbnails),
    playlists: [{ playlistId, position }],
    isRemove: 0,
    version: 1,
  };
};

VideoMapper.urlPrefix = 'https://www.youtube.com/watch?v=';

export default VideoMapper;
