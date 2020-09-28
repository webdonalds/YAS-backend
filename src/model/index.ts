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
let models = [ User, Video, Tag, Follow, Like, VideoHasTag ]
models.forEach(model => model.initialize(sequelize))


// TODO : define relations between tables - ex) Video has many tags;


export {
    sequelize as Database,
    User, Video, Tag, Like, Follow, VideoHasTag
}