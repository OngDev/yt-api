import VideoService from '../services/video.service';

const VideoController = {};

VideoController.videoById = async (req, res) => {
  const { videoId } = req.query;
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

export default VideoController;
