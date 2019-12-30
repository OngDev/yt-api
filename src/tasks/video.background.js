import cron from 'node-cron';
import dotenv from 'dotenv';

import YoutubeApi from '../configs/yt.config';

dotenv.config();

const YoutubeBackgroundTasks = {};

YoutubeBackgroundTasks.getAllAvailableVideosFromYoutube = async () => {
  try {
    const res = await YoutubeApi.playlistItems.list({
      part: 'snippet',
      playlistId: process.env.YOUTUBE_UPLOAD_PLAYLIST_ID,
    });
    return res.data.items;
  } catch (error) {
    throw Error(error.message);
  }
};

// Request every 10 mins
YoutubeBackgroundTasks.auloUpdateYoutubeVideos = cron.schedule('*/10 * * * *', () => {
  console.log('running a task every 10 minutes');
});

export default YoutubeBackgroundTasks;