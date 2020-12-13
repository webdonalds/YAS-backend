import * as express from 'express';
import googleService from '../../service/googleService';

const router = express.Router();

router.get('/playlists', async (req: express.Request, res: express.Response) => {
  const accessToken: string = req.body.userInfo.accessToken;
  const pageToken: string = req.query.pageToken as string;
  res.json(await googleService.getMyPlaylist(accessToken, pageToken));
});

router.get('/playlist', async (req: express.Request, res: express.Response) => {
  const accessToken: string = req.body.userInfo.accessToken;
  const id: string = req.query.id as string;
  const pageToken: string = req.query.pageToken as string;

  if(id === undefined || id === '') {
    res.status(400).json({
      error: {
        message: 'Lack of parameter : id',
        code: 400
      }
    });
    return;
  }

  try {
    res.json(await googleService.getPlaylistItems(accessToken, id, pageToken));
  } catch(e) {
    res.status(400).json(e);
  }
});

export default router;