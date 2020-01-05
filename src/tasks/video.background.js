import cron from 'node-cron';

const YoutubeBackgroundTasks = {};

// Request every 10 mins
YoutubeBackgroundTasks.auloUpdateYoutubeVideos = cron.schedule('*/10 * * * *', () => {
  console.log('running a task every 10 minutes');
});

export default YoutubeBackgroundTasks;