import PlaylistService from '../services/playlist.service';
// import PlayDTO from '../dtos/video.dto';

const PlaylistController = {};

PlaylistController.getPlaylists = async (req, res) => {
  try {
    const playlists = await PlaylistService.getAllPlayList();
    return res.status(200).json({ status: 200, data: playlists });
  } catch (error) {
    return res.status(400).json({ status: 400, message: error.message });
  }
};

export default PlaylistController;
