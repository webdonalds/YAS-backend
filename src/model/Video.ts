import { Sequelize, Model, DataTypes } from 'sequelize';
import { VideoResponse } from './dto/Video';
import Tag from './Tag';
import User from './User';

class Video extends Model {
    public id!: number;
    public videoId!: string; 
    public userId!: number;
    public title!: string;
    public description: string;
    public totalLikes: number;

    public User: User;
    public Tags: Tag[];

    public createdAt: Date;

    public static initialize(sequelize: Sequelize): void {
        this.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                    allowNull: false
                },
                videoId: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                userId: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                title: {
                    type: DataTypes.STRING(100),
                    allowNull: false
                },
                description: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
                totalLikes: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    defaultValue: 0
                }
            },
            {
                tableName: 'videos',
                sequelize
            }
        );
    }

    public toVideoResponse(): VideoResponse {
        return {
            id: this.id,
            videoId: this.videoId,
            userId: this.userId,
            title: this.title,
            description: this.description,
            totalLikes: this.totalLikes,
            createdAt: this.createdAt,
            Tags: this.Tags.map((tag) => {
                return tag.toTagResponse();
            }),
            User: this.User.toUserInfoResponse(),
        };
    }
}


export default Video;
