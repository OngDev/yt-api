import mongoose from 'mongoose';
// eslint-disable-next-line no-unused-vars
import PlaylistModel from './playlist.model';

const { Schema } = mongoose;

const VideoSchema = Schema({
  id: {
    type: String,
    unique: true,
  },
  title: String,
  description: String,
  statistics: {
    viewCount: { type: Number, default: 0 },
    likeCount: { type: Number, default: 0 },
    dislikeCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
  },
  thumbnails: [{
    url: String,
    width: Number,
    height: Number,
  }],
  position: Number,
  playlists: [{
    playlistId: { type: String, ref: 'PlaylistModel' },
    position: Number,
  }],
  version: {
    type: Number,
    default: 1,
  },
});

const VideoModel = mongoose.model('Videos', VideoSchema, 'videos');

export default VideoModel;
