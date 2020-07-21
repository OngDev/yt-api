/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable max-len */
import cron from 'node-cron';
import dotenv from 'dotenv';
import _ from 'lodash';

import YoutubeApi from '../configs/yt.config';
import logger from '../logger/logger';
import PlayListService from '../services/playlist.service';
import PlayListEntity from '../entities/playlist.entity';
import { PART } from '../constants';

dotenv.config();

const YoutubePlayListBackgroundTasks = {};

// fetch all playlist from youtube channel
const getAllPlayListFromYoutube = async () => {
  const playListsResult = [];
  try {
    let opts = {
      part: `${PART.SNIPPET}, ${PART.CONTENTDETAILS}, ${PART.PLAYER}, ${PART.STATUS}`,
      channelId: process.env.YOUTUBE_CHANNEL_ID,
      maxResults: 50,
      pageToken: null,
    };
    do {
      opts = _.omitBy(opts, _.isNull);
      const playLists = await YoutubeApi.playlists.list(opts);
      opts.pageToken = playLists.data.nextPageToken || null;
      playListsResult.push(...playLists.data.items);
    } while (opts.pageToken != null);
    return playListsResult;
  } catch (error) {
    throw Error(error.message);
  }
};
// Request every 30 mins: */30 * * * *
// request 10s for test: */10 * * * * *
YoutubePlayListBackgroundTasks.autoUpdateYoutubePlaylist = cron.schedule('*/30 * * * *', async () => {
  try {
    logger.info('Cron-job start');
    const [playListsFromYT, playListsFromDB] = await Promise.all([
      getAllPlayListFromYoutube(),
      PlayListService.getAllPlayList(),
    ]);
    await handlePlayListData(playListsFromYT, playListsFromDB);
  } catch (error) {
    logger.error(error.message);
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

    playListsFromYT.forEach((playList) => {
      const playListConvert = playListEntity.convertDataFromYTToModel(playList);
      mapPlayListYT.set(playListConvert.id, playListConvert);
      keyHash.add(playListConvert.id);
    });

    playListsFromDB.forEach((playList) => {
      mapPlayListDB.set(playList.id, playList);
      keyHash.add(playList.id);
    });

    if (_.isEmpty(playListsFromDB)) {
      // insert to DB sort by publishedAt
      const playListConvertModelSorted = _.sortBy([...mapPlayListYT.values()], [playListEntity.getAttribute().publishedAt]);
      await PlayListService.insertPlayLists(playListConvertModelSorted);
      return;
    }

    const playListDelete = [];
    const playListInsert = [];
    const playListUpdate = [];

    for (const playListId of keyHash) {
      const playListYoutube = mapPlayListYT.get(playListId);
      const playListDB = mapPlayListDB.get(playListId);
      if (_.isEmpty(playListYoutube) && !_.isEmpty(playListDB)) {
        playListDelete.push(playListDB.id);
      }
      if (!_.isEmpty(playListYoutube) && _.isEmpty(playListDB)) {
        playListInsert.push(playListYoutube);
      }
      if (!_.isEmpty(playListYoutube) && !_.isEmpty(playListDB) && !playListEntity.compare2PlayList({ ...playListYoutube }, { ...playListDB })) {
        playListUpdate.push(playListYoutube);
      }
    }

    if (!_.isEmpty(playListDelete)) {
      await PlayListService.deletePlayLists(playListDelete);
    }
    if (!_.isEmpty(playListInsert)) {
      PlayListService.insertPlayList(playListInsert);
    }
    if (!_.isEmpty(playListUpdate)) {
      PlayListService.updatePlayLists(playListUpdate);
    }
    return;
  } catch (error) {
    throw Error(error.message);
  }
};

export default YoutubePlayListBackgroundTasks;
