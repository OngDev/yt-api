/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
// factory pattern
import isEqual from 'lodash/isEqual';

function PlayList() {
  /**
   *
   * @param {Object} playListYT: playlist fetched from YT
   */
  function convertDataFromYTToModel(playListYT) {
    if (!playListYT) return null;
    const {
      id, snippet: { title, description, publishedAt },
      status: { privacyStatus },
      contentDetails: { itemCount },
    } = playListYT;
    return {
      id,
      title,
      description,
      status: privacyStatus,
      videosTotal: itemCount || 0,
      publishedAt,
      isRemove: 0,
    };
  }

  /**
   *
   * @param {Object} playListYT: playList from YT converted model.
   * @param {Object} playListDB: playList get DB.
   * @returns false if 2 object not equal || true
   */
  function compare2PlayList(playListYT, playListDB) {
    if (!playListDB || !playListDB) return false;
    delete playListDB._id;
    delete playListDB.__v;
    delete playListDB.publishedAt;
    delete playListYT.publishedAt;
    return isEqual(playListYT, playListDB);
  }

  function getAttribute() {
    return {
      id: 'id',
      title: 'title',
      description: 'description',
      status: 'status',
      videosTotal: 'videosTotal',
      publishedAt: 'publishedAt',
      isRemove: 'isRemove',
    };
  }

  return {
    convertDataFromYTToModel,
    compare2PlayList,
    getAttribute,
  };
}

export default PlayList;
