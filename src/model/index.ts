import { Options, Sequelize } from 'sequelize'

// import models
import User from './User';
import Video from './Video';
import Tag from './Tag';
import Like from './Like';

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
let models = [ User, Video, Tag, Like ]
models.forEach(model => model.initialize(sequelize))


// User - Video Association
User.hasMany(Video, {foreignKey: 'userId'});


// Follow Association
User.belongsToMany(User, {as: 'Follower', through: 'follows', foreignKey: 'followerId'});
User.belongsToMany(User, {as: 'Followee', through: 'follows', foreignKey: 'followeeId'});


// Like Association
User.hasMany(Like, {foreignKey: 'userId'});
Video.hasMany(Like, {foreignKey: 'videoId'});

// video has tag Association
Video.belongsToMany(Tag, {through: 'video_has_tag', foreignKey: 'videoId'});
Tag.belongsToMany(Video, {through: 'video_has_tag', foreignKey: 'tagId'});


export {
    sequelize as Database,
    User, Video, Tag, Like
}