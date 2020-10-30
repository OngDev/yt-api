/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable max-len */
import cron from 'node-cron';
import dotenv from 'dotenv';
import _ from 'lodash';

import YoutubeApi from '../configs/yt.config';
import logger from '../logger/logger';
import PlayListService from '../services/playlist.service';
import playListMapper from '../mappers/playlist.mapper';
import { PART, PLAYLIST } from '../constants';

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

const handleMapPlayList = (playListsFromYT, playListsFromDB) => {
  const playListYtMap = new Map();
  const playListDbMap = new Map();
  const playListIdSet = new Set();
  try {
    playListsFromYT.forEach((playListFromYt) => {
      const playList = playListMapper.convertYtDataToModel(playListFromYt);
      playListYtMap.set(playList.id, playList);
      playListIdSet.add(playList.id);
    });

    playListsFromDB.forEach((playListFromDb) => {
      playListDbMap.set(playListFromDb.id, playListFromDb);
      playListIdSet.add(playListFromDb.id);
    });
    return { playListYtMap, playListDbMap, playListIdSet };
  } catch (error) {
    throw Error(error.message);
  }
};

const getDataChanged = (mapPlayListYT, mapPlayListDB, playListIdSet) => {
  try {
    const playListsToDelete = [];
    const playListsToInsert = [];
    const playListsToUpdate = [];

    for (const playListId of playListIdSet) {
      const playListYoutube = mapPlayListYT.get(playListId);
      const playListDB = mapPlayListDB.get(playListId);
      if (_.isEmpty(playListYoutube) && !_.isEmpty(playListDB)) {
        playListsToDelete.push(playListDB.id);
      }
      if (!_.isEmpty(playListYoutube) && _.isEmpty(playListDB)) {
        playListsToInsert.push(playListYoutube);
      }
      if (!_.isEmpty(playListYoutube) && !_.isEmpty(playListDB) && !playListMapper.compare2PlayList({ ...playListYoutube }, { ...playListDB })) {
        playListsToUpdate.push(playListYoutube);
      }
    }
    return { playListsToDelete, playListsToInsert, playListsToUpdate };
  } catch (error) {
    throw Error(error.message);
  }
};

const handlePlayListData = async (playListsFromYT, playListsFromDB) => {
  try {
    const { playListYtMap, playListDbMap, playListIdSet } = handleMapPlayList(playListsFromYT, playListsFromDB);
    if (_.isEmpty(playListsFromDB)) {
      // insert to DB sort by publishedAt
      const sortedPlaylistModel = _.sortBy([...playListYtMap.values()], [PLAYLIST.publishedAt]);
      await PlayListService.insertPlayLists(sortedPlaylistModel);
      return;
    }

    const { playListsToDelete, playListsToInsert, playListsToUpdate } = getDataChanged(playListYtMap, playListDbMap, playListIdSet);

    if (!_.isEmpty(playListsToDelete)) {
      await PlayListService.deletePlayLists(playListsToDelete);
    }
    if (!_.isEmpty(playListsToInsert)) {
      await PlayListService.insertPlayList(playListsToInsert);
    }
    if (!_.isEmpty(playListsToUpdate)) {
      await PlayListService.updatePlayLists(playListsToUpdate);
    }
  } catch (error) {
    throw Error(error.message);
  }
};
// Request every 30 mins: */30 * * * *
// request 10s for test: */10 * * * * *
YoutubePlayListBackgroundTasks.autoUpdateYoutubePlaylist = cron.schedule('*/30 * * * *', async () => {
  try {
    logger.info('start cron-job update playlist');
    const [playListsFromYT, playListsFromDB] = await Promise.all([
      getAllPlayListFromYoutube(),
      PlayListService.getAllPlayList(),
    ]);
    await handlePlayListData(playListsFromYT, playListsFromDB);
  } catch (error) {
    logger.error(error.message);
  }
});

export default YoutubePlayListBackgroundTasks;
