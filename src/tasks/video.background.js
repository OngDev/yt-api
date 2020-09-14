/* eslint-disable no-loop-func */
/* eslint-disable no-use-before-define */
/* eslint-disable no-await-in-loop */
import cron from 'node-cron';
import dotenv from 'dotenv';
import _ from 'lodash';

import YoutubeApi from '../configs/yt.config';
import videoMapper from '../mappers/video.mapper';
import VideoService from '../services/video.service';
import FetchLogService from '../services/fetchlog.service';
import { PART, CRON_STATUS } from '../constants';
import helper from '../utils/helper';
import logger from '../logger/logger';


dotenv.config();

const YoutubeVideoBackgroundTasks = {};

const handleVideoFromYoutube = async (nextVersion) => {
  try {
    let opts = {
      part: `${PART.ID}`,
      channelId: process.env.YOUTUBE_CHANNEL_ID,
      maxResults: 50,
      pageToken: null,
    };
    do {
      opts = _.omitBy(opts, _.isNull);
      const playLists = await YoutubeApi.playlists.list(opts);
      if (!playLists) break;
      opts.pageToken = playLists.data.nextPageToken || null;
      const arrPlayListIds = _.map(playLists.data.items, 'id');
      // fetch video in a playist
      await fetchVideosByPlayListId(arrPlayListIds, nextVersion);
    } while (opts.pageToken != null);
    return [];
  } catch (error) {
    throw Error(error.message);
  }
};

const fetchVideosByPlayListId = async (playListIds, nextVersion) => {
  try {
    await Promise.all(playListIds.map(async (id) => {
      let listVideos = [];
      let opts = {
        part: PART.SNIPPET,
        playlistId: id,
        maxResults: 50,
        pageToken: null,
      };
      do {
        opts = _.omitBy(opts, _.isNull);
        const resultPlayList = await YoutubeApi.playlistItems.list(opts);

        const videos = resultPlayList.data.items;
        videos.forEach((video) => {
          listVideos.push(videoMapper.convertYtDataToModel(video));
        });

        opts.pageToken = resultPlayList.data.nextPageToken || null;
      } while (opts.pageToken != null);
      // tồn tại 2 video trong 1 playlist
      listVideos = _.uniqBy(listVideos, 'id');
      // xử lý lưu video
      await VideoService.upsertVideosPlayList(listVideos, nextVersion);
    }));
  } catch (error) {
    throw Error(error.message);
  }
};

const updateLogFetchVideo = async () => {
  try {
    const timeNow = helper.getDateNowISOLocal();
    await FetchLogService.updateLog(timeNow);
  } catch (error) {
    throw Error(error.message);
  }
};

// Request every 10 mins
YoutubeVideoBackgroundTasks.autoUpdateYoutubeVideos = cron.schedule('*/10 * * * *', async () => {
  logger.info('start cron-job update videos');
  const currentVersion = await FetchLogService.getLogVersion();
  const nextVersion = currentVersion + 1;
  await handleVideoFromYoutube(nextVersion);

  // fetch statistics
  const cronStatus = updateStatisticsVideo.getStatus();
  if (cronStatus !== CRON_STATUS.SCHEDULED && cronStatus !== CRON_STATUS.RUNNING) {
    updateStatisticsVideo.start();
  }

  // update log when fetched data
  await updateLogFetchVideo();
});

// Request every 5 mins
const updateStatisticsVideo = cron.schedule('*/5 * * * *', async () => {
  logger.info('start cron-job update video statistics');
  let skip = 0;
  const limit = 50; // max 50 videoId
  let videos = await VideoService.getListVideo(skip, limit);

  while (videos && videos.length !== 0) {
    const arrVideoIds = _.map(videos, 'id');
    const statisticVideos = await YoutubeApi.videos.list({
      part: PART.STATISTICS,
      id: arrVideoIds,
    });
    await VideoService.updateStatisticVideos(statisticVideos.data.items);
    skip += limit;
    videos = await VideoService.getListVideo(skip, limit);
  }
}, {
  scheduled: false,
});

export default YoutubeVideoBackgroundTasks;
