import VideoService from '../services/video.service';
import VideoDTO from '../dtos/video.dto';

const VideoController = {};

VideoController.videoById = async (req, res) => {
  const videoId = req.params.id;
  try {
    const video = await VideoService.videoById(videoId);
    return res.status(200).json({ status: 200, data: video });
  } catch (error) {
    return res.status(400).json({ status: 400, message: error.message });
  }
};

VideoController.getMostViewVideos = async (req, res) => {
  let { videoNumber } = req.query;
  try {
    videoNumber = parseInt(videoNumber, 10) || 3; // default = 3
    const videos = await VideoService.getMostViewVideos(videoNumber);
    return res.status(200).json({ status: 200, data: videos });
  } catch (error) {
    return res.status(500).json({ status: 500, message: error.message });
  }
};


VideoController.getVideos = async (req, res) => {
  const { playlistId } = req.query;
  let { skip, limit } = req.query;
  try {
    skip = parseInt(skip, 10) || 0;
    limit = parseInt(limit, 10) || 10;
    let videos = {};
    if (playlistId) {
      videos = await VideoService.getVideosInPlayList(playlistId, skip, limit);
    } else {
      videos = await VideoService.getVideos(skip, limit);
    }
    const videosDTO = VideoDTO.toVideoDtoList(videos);
    return res.status(200).json({ status: 200, data: videosDTO });
  } catch (error) {
    return res.status(500).json({ status: 500, message: error.message });
  }
};

export default VideoController;
