import mongoose from 'mongoose';

const { Schema } = mongoose;

const PlaylistSchema = Schema({
  id: {
    type: String,
    unique: true,
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
  },
  videosTotal: {
    type: Number,
  },
  publishedAt: {
    type: Date,
  },
  isRemove: {
    type: Number,
    default: 0,
  },

}, { _id: false, versionKey: false });

const PlaylistModel = mongoose.model('Playlists', PlaylistSchema, 'playlists');

export default PlaylistModel;
