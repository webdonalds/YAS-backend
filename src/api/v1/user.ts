import * as express from 'express';

import { User } from '../../model/index';

const router = express.Router();



router.put('/nickname', async (request: express.Request, response: express.Response) => {
    const userId = request.body.userInfo.userId;
    const newNickname = request.body.newNickname;
    
    if(newNickname==null){
        response.json({
            error : {
                message : 'require_parameter_newNickname',
                code : 403
            }
        });
        return;
    }

    if(newNickname.length >= 50){
        response.json({
            error : {
                message : 'nickname_too_long',
                specific : 'nickname length should be less then 50',
                code : 401
            }
        });
        return;
    }

    await User.update({
        nickname: newNickname
    },
    {
        where:{
            id: userId
        }
    });

    response.json({
        message: 'success'
    });

    return;
});











export default router;