import { Sequelize, Model, DataTypes } from 'sequelize';

class Video extends Model {
    public id!: number;
    public videoId!: string; 
    public userId!: number;
    public title!: string;
    public description: string;


    public static initialize(sequelize: Sequelize) {
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
                }
            },
            {
                tableName: 'videos',
                sequelize
            }
        );
    }
}


export default Video;