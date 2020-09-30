import { expect, assert } from 'chai';
import PlayListBackground from '../tasks/playlist.background';

const kind = 'youtube#playlist';
describe('Unit test info playlist', () => {
  describe('playlist background', async () => {
    it('Should return list fetched from youtube', async () => {
      const playListFetched = await PlayListBackground.getAllPlayListFromYoutube([], null);
      const playList = playListFetched[0];
      assert.typeOf(playListFetched, 'array');
      expect(playList.kind).to.equal(kind);
    });
  });
});
