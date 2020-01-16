import dotenv from 'dotenv';
import { google } from 'googleapis';

dotenv.config();

const YoutubeApi = google.youtube({
  version: 'v3',
  auth: `${process.env.YOUTUBE_API_KEY}`,
});

export default YoutubeApi;
