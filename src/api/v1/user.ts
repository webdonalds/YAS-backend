import * as express from 'express';

import { User } from '../../model/index';

const router = express.Router();


// modify nickname
router.put('/nickname', async (request: express.Request, response: express.Response) => {
    const userId = request.body.userInfo.userId;
    const newNickname = request.body.newNickname;

    if (newNickname == null) {
        response.status(400).json({
            error: {
                message: 'require_body_parameter_newNickname',
            }
        });
        return;
    }

    if (newNickname.length >= 50) {
        response.status(400).json({
            error: {
                message: 'nickname_too_long',
                specific: 'nickname length should be less than 50',
            }
        });
        return;
    }

    await User.update(
        {
            nickname: newNickname
        },
        {
            where: {
                id: userId
            }
        }
    );

    response.json({
        message: 'success'
    });

    return;
});


//modify aboutme
router.put('/about-me', async (request: express.Request, response: express.Response) => {
    const userId = request.body.userInfo.userId;
    const newAboutMe = request.body.newAboutMe;

    if (newAboutMe == null) {
        response.status(400).json({
            error: {
                message: 'require_body_parameter_newAboutMe',
            }
        });
        return;
    }

    if (newAboutMe.length >= 100) {
        response.status(400).json({
            error: {
                message: 'about_me_too_long',
                specific: 'about me length should be less than 100',
            }
        });
        return;
    }

    await User.update(
        {
            aboutMe: newAboutMe
        },
        {
            where: {
                id: userId
            }
        }
    );

    response.json({
        message: 'success'
    });

    return;
});








export default router;