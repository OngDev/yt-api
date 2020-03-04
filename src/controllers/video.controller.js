import VideoService from '../services/video.service';

const VideoController = {};

VideoController.videoById = async (req, res) => {
  try {
    const video = await VideoService.videoById(req.body.videoId);
    return res.status(200).json({ status: 200, data: video });
  } catch (error) {
    return res.status(400).json({ status: 400, message: error.message });
  }
};

export default VideoController;
