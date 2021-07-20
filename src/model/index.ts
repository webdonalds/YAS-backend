import { Sequelize } from 'sequelize';

import * as fs from 'fs';

// import models
import User from './User';
import Video from './Video';
import Tag from './Tag';
import Like from './Like';
import Token from './Token';
import VideoHasTag from './VideoHasTag';
import Follow from './Follow';

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
    },
);



// initialize models
const models = [User, Video, Tag, Like, Token, VideoHasTag, Follow];
models.forEach(model => model.initialize(sequelize));


// User - Video Association
User.hasMany(Video, { foreignKey: 'userId' });
Video.belongsTo(User, { foreignKey: 'userId' });


// User - Token Association
User.hasMany(Token, { foreignKey: 'userId' });


// Follow Association
User.hasMany(Follow, {as: 'Followee', foreignKey: 'followeeId'});
Follow.belongsTo(User, {as: 'Followee', foreignKey: 'followeeId'});
User.hasMany(Follow, {as: 'Follower', foreignKey: 'followerId'});
Follow.belongsTo(User, {as: 'Follower', foreignKey: 'followerId'});


// Like Association
User.hasMany(Like, { foreignKey: 'userId' });
Video.hasMany(Like, { foreignKey: 'videoId' });

// video has tag Association
Video.belongsToMany(Tag, { through: VideoHasTag, foreignKey: 'videoId' });
Tag.belongsToMany(Video, { through: VideoHasTag, foreignKey: 'tagId' });
Video.hasMany(VideoHasTag, { as: 'video_has_tag', foreignKey: 'videoId'});

export {
    sequelize as Database,
    User, Video, Tag, Like, Token, VideoHasTag, Follow
};
