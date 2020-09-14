/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import isEqual from 'lodash/isEqual';

const PlayListMapper = {};

PlayListMapper.convertYtDataToModel = (ytPlayList) => {
  if (!ytPlayList) return null;
  const {
    id, snippet: { title, description, publishedAt },
    status: { privacyStatus },
    contentDetails: { itemCount },
  } = ytPlayList;
  return {
    id,
    title,
    description,
    status: privacyStatus,
    videosTotal: itemCount || 0,
    publishedAt,
    isRemove: 0,
  };
};

/**
   *
   * @param {Object} playListYT: playList from YT converted model.
   * @param {Object} playListDB: playList get DB.
   * @returns false if 2 object not equal || true
   */
PlayListMapper.compare2PlayList = (ytPlayList, dbPlayList) => {
  if (!dbPlayList || !dbPlayList) return false;
  delete dbPlayList._id;
  delete dbPlayList.__v;
  delete dbPlayList.publishedAt;
  delete ytPlayList.publishedAt;
  return isEqual(ytPlayList, dbPlayList);
};

export default PlayListMapper;
