import mongoose from 'mongoose';
import PlaylistModel from './playlist.model';

const { Schema } = mongoose;

const VideoSchema = Schema({
  id: {
    type: String,
    unique: true,
  },
  title: String,
  description: String,
  tags: [
    {
      type: String,
    },
  ],
  status: {
    privacyStatus: String,
    publishAt: Date,
  },
  statistics: {
    viewCount: Number,
    likeCount: Number,
    dislikeCount: Number,
    commentCount: Number,
  },
  thumbnails: {
    url: String,
    width: Number,
    height: Number,
  },
  comments: [
    // Do not work on it for now
  ],
  playlists: [{ type: PlaylistModel.id, ref: 'PlaylistModel' }],
}, { _id: false });

const VideoModel = mongoose.model('Videos', VideoSchema, 'videos');

export default VideoModel;
