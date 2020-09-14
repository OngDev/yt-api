import mongoose from 'mongoose';

const { Schema } = mongoose;

const FetchLogSchema = Schema({
  id: {
    type: String,
    unique: true,
    default: 1,
  },
  version: {
    type: Number,
    default: 1,
  },
  time: Date,
}, { _id: false, versionKey: false });

const FetchLog = mongoose.model('fetchlog', FetchLogSchema, 'fetchlog');

export default FetchLog;
