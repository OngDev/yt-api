import moment from 'moment';
import VideoMapper from '../mappers/video.mapper';

const VideoDTO = {};

VideoDTO.toVideo = (video) => {
  if (!video) return null;
  return {
    id: video.id,
    viewCount: video.statistics.viewCount,
    title: video.title,
    thumbnails: video.thumbnails,
    publishedAt: moment(video.publishedAt).format('DD/MM/YYYY'),
  };
};

VideoDTO.toVideoDtoList = (videos) => {
  if (!videos) return [];
  return videos.map((video) => VideoDTO.toVideo(video));
};

VideoDTO.toVideoDtoDetail = (video) => {
  if (!video) return null;
  return {
    id: video.id,
    statistics: video.statistic,
    title: video.title,
    description: video.description,
    url: VideoMapper.urlPrefix + video.id,
  };
};

export default VideoDTO;
