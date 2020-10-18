/* eslint-disable no-underscore-dangle */
import httpMocks from 'node-mocks-http';
import { assert, expect } from 'chai';
import mongoose from 'mongoose';
import VideoController from '../controllers/video.controller';
import logger from '../logger/logger';

describe('test Video controller', () => {
  let req = null;
  let res = null;

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

  beforeEach(async () => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
  });

  describe('test api get video', () => {
    it('Should return a video status 200', async () => {
      const videoId = '0-j4eHY0osc';
      req.query = { videoId };
      await VideoController.videoById(req, res);
      const result = JSON.parse(res._getData());
      assert.typeOf(result, 'object');
      assert.typeOf(result.data, 'object');
      expect(result.status).to.equal(200);
    });

    it('Should return error 400', async () => {
      const videoId = null;
      req.query = { videoId };
      await VideoController.videoById(req, res);
      const result = JSON.parse(res._getData());
      assert.typeOf(result, 'object');
      assert.typeOf(result.message, 'string');
      expect(result.status).to.equal(400);
    });
  });

  describe('test api get list video most views', () => {
    it('Should return video list most views', async () => {
      const videoNumber = 3;
      req.query = { videoNumber };
      await VideoController.getMostViewVideos(req, res);
      const result = JSON.parse(res._getData());
      assert.typeOf(result, 'object');
      expect(result).to.have.property('data').with.lengthOf.at.most(videoNumber);
    });
  });
});
