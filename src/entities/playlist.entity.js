// constructor pattern
import isEqual from 'lodash/isEqual'

function PlayList() {
  /**
   *
   * @param {Object} playListYT: playlist fetched from YT
   */
  this.convertDataFromYTToModel = (playListYT) => {
    if (!playListYT) return null;
    return {
      id: playListYT.id,
      title: playListYT.snippet.title || null,
      description: playListYT.snippet.description || null,
      status: playListYT.status.privacyStatus || null,
      videosTotal: playListYT.contentDetails.itemCount || 0,
      publishedAt: playListYT.snippet.publishedAt || null,
      isRemove: 0
    };
  };

  /**
   *
   * @param {Object} playListYT: playList from YT converted model.
   * @param {Object} playListDB: playList get DB.
   * @returns false if 2 object not equal || true
   */
  this.compare2PlayList = (playListYT, playListDB) => {
    if (!playListDB || !playListDB) return false;
    delete playListDB._id
    delete playListDB.__v
    delete playListDB.publishedAt
    delete playListYT.publishedAt
    return isEqual(playListYT, playListDB)
  };

  this.getAttribute = () => ({
    id: 'id',
    title: 'title',
    description: 'description',
    status: 'status',
    videosTotal: 'videosTotal',
    publishedAt: 'publishedAt',
    isRemove: 'isRemove'
  });
}

export default PlayList;
