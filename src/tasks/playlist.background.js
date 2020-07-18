/* eslint-disable max-len */
import cron from 'node-cron';
import dotenv from 'dotenv';
import _ from 'lodash';

import YoutubeApi from '../configs/yt.config';
import logger from '../logger/logger';
import PlayListService from '../services/playlist.service';
import PlayListEntity from '../entities/playlist.entity';
import CONSTANTS from '../constants';

dotenv.config();

const YoutubePlayListBackgroundTasks = {};

// fetch all playlist from youtube channel
const getAllPlayListFromYoutube = async (playListsResult, pageToken = null) => {
  try {
    let opts = {
      part: `${CONSTANTS.PART.SNIPPET}, ${CONSTANTS.PART.CONTENTDETAILS}, ${CONSTANTS.PART.PLAYER}, ${CONSTANTS.PART.STATUS}`,
      channelId: process.env.YOUTUBE_CHANNEL_ID,
      maxResults: 50,
      pageToken,
    };

    opts = _.omitBy(opts, _.isNull);
    const playLists = await YoutubeApi.playlists.list(opts);
    const nextPageToken = playLists.data.nextPageToken || null;
    playListsResult.push(...playLists.data.items);
    if (nextPageToken) return getAllPlayListFromYoutube(playListsResult, nextPageToken);
    return playListsResult;
  } catch (error) {
    throw Error(error.message);
  }
};
// Request every 30 mins
// request 10s for test: */10 * * * * *
YoutubePlayListBackgroundTasks.autoUpdateYoutubePlaylist = cron.schedule('*/30 * * * *', async () => {
  try {
    const [playListsFromYT, playListsFromDB] = await Promise.all([
      getAllPlayListFromYoutube([], null),
      PlayListService.getAllPlayList(),
    ]);
    await handlePlayListData(playListsFromYT, playListsFromDB)
  } catch (error) {
    logger.error(error.message);
    return
  }
});

/**
 * @description process to return 3 list: listDataDelete, listDataInsert, listDataUpdate. Then update to DB.
 * @param {List<PlayListModel>} playListsFromYT 
 * @param {List<PlayListModel>} playListsFromDB
 */
const handlePlayListData = async (playListsFromYT, playListsFromDB) => {
  try {
    const mapPlayListYT = new Map();
    const mapPlayListDB = new Map();
    const keyHash = new Set();
    const playListEntity = new PlayListEntity();

    playListsFromYT.forEach(playList => {
      const playListConvert = playListEntity.convertDataFromYTToModel(playList)
      mapPlayListYT.set(playListConvert.id, playListConvert)
      keyHash.add(playListConvert.id)
    });

    playListsFromDB.forEach(playList => {
      mapPlayListDB.set(playList.id, playList)
      keyHash.add(playList.id)
    })

    if (_.isEmpty(playListsFromDB)) {
      // insert to DB sort by publishedAt
      const playListConvertModelSorted = _.sortBy([...mapPlayListYT.values()], [playListEntity.getAttribute().publishedAt]);
      await PlayListService.insertPlayList(playListConvertModelSorted);
      return
    }

    const playListDelete = []
    const playListInsert = []
    const playListUpdate = []

    for (let playListId of keyHash) {
      const playListYoutube = mapPlayListYT.get(playListId)
      const playListDB = mapPlayListDB.get(playListId)
      if (_.isEmpty(playListYoutube) && !_.isEmpty(playListDB)) {
        playListDelete.push(playListDB.id)
      }
      if (!_.isEmpty(playListYoutube) && _.isEmpty(playListDB)) {
        playListInsert.push(playListYoutube)
      }
      if (!_.isEmpty(playListYoutube) && !_.isEmpty(playListDB) && !playListEntity.compare2PlayList({ ...playListYoutube }, { ...playListDB })) {
        playListUpdate.push(playListYoutube)
      }
    }

    if (!_.isEmpty(playListDelete)) {
      await PlayListService.deletePlayLists(playListDelete)
    }
    if (!_.isEmpty(playListInsert)) {
      PlayListService.insertPlayList(playListInsert)
    }
    if (!_.isEmpty(playListUpdate)) {
      PlayListService.updatePlayLists(playListUpdate)
    }
    return
  } catch (error) {
    throw Error(error.message)
  }
}

export default YoutubePlayListBackgroundTasks;
