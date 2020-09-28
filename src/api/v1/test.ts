import * as express from 'express';
import { User, Video } from '../../model';

const router = express.Router();


router.get('/test', (request: express.Request, response: express.Response) => {
    let result = User.create({
        userId: 12,
        nickname: "Gorge",
        email: "asasdf",
        imagePath: "sd"
    })
    console.log(result);
    response.send(result);
});



module.exports = router;

