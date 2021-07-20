import { Sequelize } from 'sequelize';

import * as fs from 'fs';

// import models
import User from './User';
import Video from './Video';
import Tag from './Tag';
import Like from './Like';
import Token from './Token';
import VideoHasTag from './VideoHasTag';

// import config
import * as config from '../config/config.json';

const logStream = fs.createWriteStream(config.database.databaseLogPath, {'flags': 'a'});

const sequelize = new Sequelize(
    config.database.databaseName,
    config.database.databaseId,
    config.database.databasePassword,
    {
        host: config.database.databaseEndpoint,
        dialect: 'mariadb',
        define: {
            charset: 'utf8',
            collate: 'utf8_general_ci',
        },
        logging: msg => {
            const date = new Date();
            logStream.write(`[${date.toISOString()}] - ${msg} \r\n`);
        }
    }
);

// initialize models
const models = [User, Video, Tag, Like, Token, VideoHasTag];
models.forEach(model => model.initialize(sequelize));


// User - Video Association
User.hasMany(Video, { foreignKey: 'userId' });
Video.belongsTo(User, { foreignKey: 'userId' });


// User - Token Association
User.hasMany(Token, { foreignKey: 'userId' });


// Follow Association
User.belongsToMany(User, { as: 'Follower', through: 'follows', foreignKey: 'followerId' });
User.belongsToMany(User, { as: 'Followee', through: 'follows', foreignKey: 'followeeId' });


// Like Association
User.hasMany(Like, { foreignKey: 'userId' });
Video.hasMany(Like, { foreignKey: 'videoId' });

// video has tag Association
Video.belongsToMany(Tag, { through: VideoHasTag, foreignKey: 'videoId' });
Tag.belongsToMany(Video, { through: VideoHasTag, foreignKey: 'tagId' });
Video.hasMany(VideoHasTag, { as: 'video_has_tag', foreignKey: 'videoId'});

export {
    sequelize as Database,
    User, Video, Tag, Like, Token, VideoHasTag
};