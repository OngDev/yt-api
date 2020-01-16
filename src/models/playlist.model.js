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

}, { _id: false });

const PlaylistModel = mongoose.model('Playlists', PlaylistSchema, 'playlists');

export default PlaylistModel;
