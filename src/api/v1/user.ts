import * as express from 'express';
import { User } from '../../model/index';
import userInfoValidation from '../../validation/userInfoValidation';

const router = express.Router();


router.put('/user-info', async (request: express.Request, response: express.Response) => {
    const userId = request.body.userInfo ? request.body.userInfo.userId : null;
    const nickname = request.body.nickname;
    const aboutMe = request.body.aboutMe;

    const parameters = {
        userId: userId,
        nickname: nickname,
        aboutMe: aboutMe
    };


    const error = await userInfoValidation.validateUserInfoParameters(parameters);
    
    if(error){
        response.status(400).json(error);
        return;
    }


    await User.update(
        {
            nickname: nickname,
            aboutMe: aboutMe
        },
        {
            where: {
                id: userId
            }
        }
    );

    response.json({
        nickname: nickname,
        aboutMe: aboutMe
    });

    return;
});


export default router;