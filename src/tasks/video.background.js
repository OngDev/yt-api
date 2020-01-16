import cron from 'node-cron';
import dotenv from 'dotenv';

import YoutubeApi from '../configs/yt.config';
import VideoModel from '../models/video.model';

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

YoutubeBackgroundTasks
  .saveAllVideosToDatabase = async (videos) => videos && videos.forEach(async (video) => {
    const {
      title, description, thumbnails, position,
    } = video.snippet;
    await VideoModel.deleteMany({});
    const newVideo = new VideoModel({
      id: video.id,
      title,
      description,
      thumbnails,
      position,
    });
    newVideo.save();
  });

// Request every 10 mins
YoutubeBackgroundTasks.autoUpdateYoutubeVideos = cron.schedule('*/10 * * * *', async () => {
  const videos = await YoutubeBackgroundTasks.getAllAvailableVideosFromYoutube();
  await YoutubeBackgroundTasks.saveAllVideosToDatabase(videos);
});

export default YoutubeBackgroundTasks;
