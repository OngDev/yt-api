import PlayListModel from '../models/playlist.model';

const PlayListService = {};

/**
 * @description insertMany a list playlist
 * @param {PlayList} playlists
 */
PlayListService.insertPlayLists = async (playlists) => {
  if (!playlists || playlists.length === 0) {
    throw Error('Missing "playlists" params');
  }
  try {
    return PlayListModel.insertMany(playlists);
  } catch (error) {
    throw Error(error.message);
  }
};

PlayListService.getAllPlayList = async () => {
  try {
    return PlayListModel.find().lean();
  } catch (error) {
    throw Error(error.message);
  }
};

PlayListService.deletePlayLists = async (playListIds) => {
  if (!playListIds || playListIds.length === 0) {
    throw Error('Missing "playListIds" params');
  }
  try {
    const bulkDelete = PlayListModel.collection.initializeUnorderedBulkOp();
    playListIds.forEach((id) => {
      bulkDelete.find({
        id,
      }).updateOne({ $set: { isRemove: 1 } });
    });
    await bulkDelete.execute();
  } catch (error) {
    throw Error(error.message);
  }
};

PlayListService.updatePlayLists = async (playLists) => {
  if (!playLists || playLists.length === 0) {
    throw Error('Missing "playLists" params');
  }
  try {
    const bulkUpdate = PlayListModel.collection.initializeUnorderedBulkOp();
    playLists.forEach((playList) => {
      bulkUpdate.find({
        id: playList.id,
      }).updateOne({ $set: playList });
    });
    await bulkUpdate.execute();
  } catch (error) {
    throw Error(error.message);
  }
};
export default PlayListService;
