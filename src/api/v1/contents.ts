import * as express from 'express';
import googleService from '../../service/googleService';

const router = express.Router();

router.get('/playlists', async (req: express.Request, res: express.Response) => {
  const accessToken: string = req.body.userInfo.accessToken;
  const pageToken: string = req.query.pageToken as string;
  try {
    res.json(await googleService.getMyPlaylist(accessToken, pageToken));
  } catch(e) {
    res.status(400).json(e);
  }
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

router.get('/likelist', async (req: express.Request, res: express.Response) => {
  const accessToken: string = req.body.userInfo.accessToken;
  const pageToken: string = req.query.pageToken as string;
  try {
    res.json(await googleService.getLikeVideos(accessToken, pageToken));
  } catch(e) {
    res.status(400).json(e);
  }
});

router.get('/search', async (req: express.Request, res: express.Response) => {
  const keyword: string = req.query.keyword as string;
  const pageToken: string = req.query.pageToken as string;

  if(keyword === undefined || keyword === '') {
    res.status(400).json({
      error: {
        message: 'Lack of parameter : keyword',
        code: 400
      }
    });
    return;
  }

  try {
    res.json(await googleService.search(keyword, pageToken));
  } catch(e) {
    res.status(400).json(e);
  }
});

export default router;