import VideoModel from '../models/video.model';

const VideoService = {};

VideoService.videoById = async (videoId) => {
  try {
    if (!videoId) {
      throw new Error('Missing "videoId" field');
    }
    const video = await VideoModel.findOne({ id: videoId });
    return video;
  } catch (error) {
    throw Error(error.message);
  }
};
