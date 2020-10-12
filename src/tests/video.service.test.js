/* eslint-disable no-underscore-dangle */
import httpMocks from 'node-mocks-http';
import { assert, expect } from 'chai';
import mongoose from 'mongoose';
import VideoService from '../services/video.service';
import logger from '../logger/logger';

describe('test Video service', () => {
  before(async () => {
    // connect DB
    mongoose.Promise = global.Promise;
    await mongoose
      .connect(`mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      })
      .then(() => {
        logger.info('Successfully connected to the database');
      })
      .catch((err) => {
        logger.info(`Could not connect to the database. Exiting now...\n${err}`);
        process.exit();
      });
  });

  it('Should return video list most views', async () => {
    const videoNumber = 6;
    const listVideo = await VideoService.getMostViewVideos(videoNumber);
    assert.typeOf(listVideo, 'array');
    expect(listVideo).with.lengthOf.at.most(videoNumber);
  });

  it('Should throw Error missing videoNumber params', async () => {
    const videoNumber = null;
    try {
      await VideoService.getMostViewVideos(videoNumber);
    } catch (error) {
      expect(error.message).to.equal('Missing "videoNumber" params');
    }
  });
});
