/* eslint-disable no-param-reassign */
import VideoModel from '../models/video.model';
import PlayList from '../entities/playlist.entity';

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

VideoService.insertVideos = async (videos) => {
  if (!videos || videos.length === 0) {
    throw Error('Missing "videos" params');
  }
  try {
    return VideoModel.insertMany(videos);
  } catch (error) {
    throw Error(error.message);
  }
};


/**
 * nếu video đã được update, version đang là version hiện tại
 * => push playlistId vào mảng playlist hiện có
 * => 1 video có thể tồn tại trong nhiều playlist.
 */
const updateVideosNextVersion = async (videos, nextVersion) => {
  try {
    const bulkUpdateVideoNextVerion = VideoModel.collection.initializeUnorderedBulkOp();
    videos.forEach((video) => {
      bulkUpdateVideoNextVerion.find({
        id: video.id,
        version: nextVersion,
      }).updateOne({ $push: { playlists: video.playlists[0] } });
    });
    return bulkUpdateVideoNextVerion;
  } catch (error) {
    throw Error(error.message);
  }
};

/**
 * Update những video có version cũ => empty playlist của video và push playlistId hiện tại vào mảng playlist
 */
const updateVideosCurrentVersion = async (videos, nextVersion) => {
  try {
    const bulkUpdateCurrentVideos = VideoModel.collection.initializeOrderedBulkOp();
    videos.forEach((video) => {
      video.version = nextVersion;
      bulkUpdateCurrentVideos.find({
        id: video.id,
        version: { $lt: nextVersion },
      }).updateOne({ $set: { playlists: video.playlists, version: nextVersion } });
    });
    return bulkUpdateCurrentVideos;
  } catch (error) {
    throw Error(error.message);
  }
};

/**
 *
 * @param {*} videos
 * @param {*} resUpdatedVideosNextVersion result when updated video has version = next version
 * @param {*} resUpdatedVideosCurrentVeriosn result when updated video has version = current version
 */
const insertVideoAfterUpdate = async (videos, resUpdatedVideosNextVersion, resUpdatedVideosCurrentVeriosn) => {
  try {
    const totalUpdate = resUpdatedVideosNextVersion.nMatched + resUpdatedVideosCurrentVeriosn.nMatched;
    if (totalUpdate < videos.length) {
      const videosInsert = videos.slice(0, videos.length - totalUpdate);
      await VideoService.insertVideos(videosInsert);
    }
  } catch (error) {
    throw Error(error.message);
  }
};
VideoService.upsertVideosPlayList = async (videos, nextVersion) => {
  if (!videos || videos.length === 0) throw Error('Missing "videos" params');
  try {
    // ưu tiên update video có version mới trước tránh bị trùng lặp playlistId
    const bulkUpdateVideosNextVerion = updateVideosCurrentVersion(videos, nextVersion);
    const bulkUpdateVideosCurrentVersion = updateVideosCurrentVersion(videos, nextVersion);
    const resultUpdate2 = await (await bulkUpdateVideosNextVerion).execute();
    const resultUpdate1 = await (await bulkUpdateVideosCurrentVersion).execute();

    // khi có 1 video mới thêm vào mà không matched với 2 bulkUpdate trên, sẽ thực hiện insert video đó.
    // với cách này sẽ chỉ insert những video được thêm vào nằm ở vị trí đầu của playlist
    await insertVideoAfterUpdate(videos, resultUpdate2, resultUpdate1);
  } catch (error) {
    throw Error(error.message);
  }
};

VideoService.getVideosInPlayList = async (playListId) => {
  if (!playListId) throw Error('Missing "playListId" params');
  try {
    return VideoModel.find({ playlists: { $elemMatch: { playlistId: { $eq: playListId } } } });
  } catch (error) {
    throw Error(error.message);
  }
};

VideoService.getListVideo = async (skip, limit) => {
  skip = skip ? parseInt(skip, 10) : 0;
  limit = limit ? parseInt(limit, 10) : 0;
  try {
    return VideoModel.find({}).skip(skip).limit(limit).lean();
  } catch (error) {
    throw Error(error.message);
  }
};

VideoService.updateStatisticVideos = async (videos) => {
  if (!videos || videos.length === 0) throw Error('Missing "videos" params');
  try {
    const bulktUpdateStatistic = VideoModel.collection.initializeOrderedBulkOp();
    videos.forEach((video) => {
      bulktUpdateStatistic.find({
        id: video.id,
      }).updateOne({ $set: { statistics: video.statistics } });
    });
    return bulktUpdateStatistic.execute();
  } catch (error) {
    throw Error(error.message);
  }
};
export default VideoService;
