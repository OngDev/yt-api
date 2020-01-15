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
    viewCount: Number,
    likeCount: Number,
    dislikeCount: Number,
    commentCount: Number,
  },
  thumbnails: [{
    url: String,
    width: Number,
    height: Number,
  }],
  position: {
    type: Number,
    unique: true,
  },
  playlists: [{ type: String, ref: 'PlaylistModel' }],
});

const VideoModel = mongoose.model('Videos', VideoSchema, 'videos');

export default VideoModel;
