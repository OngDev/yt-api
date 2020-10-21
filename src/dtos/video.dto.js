import VideoConst from '../constants/video.constant';

const VideoDTO = {};

VideoDTO.dtoVideo = (video) => {
  if (!video) return null;
  return {
    id: video.id,
    viewCount: video.statistics.viewCount,
    title: video.title,
    thumbnails: video.thumbnails,
  };
};

VideoDTO.dtoListVideo = (videos) => {
  if (!videos) return [];
  return videos.map((video) => VideoDTO.dtoVideo(video));
};

VideoDTO.dtoVideoDetail = (video) => {
  if (!video) return null;
  return {
    id: video.id,
    statistics: video.statistic,
    title: video.title,
    description: video.description,
    url: VideoConst.URL_PREFIX + video.id,
  };
};

export default VideoDTO;