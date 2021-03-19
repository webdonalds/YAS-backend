import { Sequelize, Model, DataTypes } from 'sequelize';

class Like extends Model {
    public userId!: number;
    public videoId!: number;

    public static initialize(sequelize: Sequelize) {
        this.init(
            {
                userId: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    allowNull: false
                },
                videoId: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    allowNull: false
                }
            },
            {
                tableName: 'likes',
                sequelize
            }
        );
    }
}


export default Like;