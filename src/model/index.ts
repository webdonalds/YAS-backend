import { Options, Sequelize } from 'sequelize'

// import models
import User from './User';
import Video from './Video';
import Tag from './Tag';
import Follow from './Follow';
import Like from './Like';
import VideoHasTag from './VideoHasTag'

// import config
import * as config from '../config/config.json';

console.log(config);

const sequelize = new Sequelize(
    config.database.databaseName,
    config.database.databaseId,
    config.database.databasePassword,
    {
        host: config.database.databaseEndpoint,
        dialect: "mariadb"
    }
)

// initialize models
let models = [ User, Video, Tag, Like, Follow ]
models.forEach(model => model.initialize(sequelize))


// User - Video Association
User.hasMany(Video, {foreignKey: 'userId'});

// Follow Association
User.hasMany(Follow, {foreignKey: 'userId', as: 'followerId'});
User.hasMany(Follow, {foreignKey: 'userId', as: 'followeeId'});

// Like Association
User.hasMany(Like, {foreignKey: 'userId'});
Video.hasMany(Like, {foreignKey: 'videoId'});

// video has tag Association
Video.belongsToMany(Tag, {through: 'video_has_tag'});
Tag.belongsToMany(Video, {through: 'video_has_tag'});

export {
    sequelize as Database,
    User, Video, Tag, Like, Follow, VideoHasTag
}