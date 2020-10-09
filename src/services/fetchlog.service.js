import FetchLogModel from '../models/fetchlog.model';

const FetchLogService = {};

FetchLogService.updateLog = async (timeNow) => {
  try {
    return FetchLogModel.updateOne({ id: 1 },
      { time: timeNow, $inc: { version: 1 } },
      { upsert: true });
  } catch (error) {
    throw Error(error.message);
  }
};

FetchLogService.getLogVersion = async () => {
  try {
    const resultLog = await FetchLogModel.findOne({ id: 1 }).lean();
    return resultLog ? resultLog.version : 0;
  } catch (error) {
    throw Error(error.message);
  }
};

export default FetchLogService;
