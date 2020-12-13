import * as express from 'express';
import googleService from '../../service/googleService';

const router = express.Router();

router.get('/playlists', async (req: express.Request, res: express.Response) => {
  const accessToken: string = req.body.userInfo.accessToken;
  const pageToken: string = req.query.pageToken as string;
  res.json(await googleService.getMyPlaylist(accessToken, pageToken));
});

export default router;