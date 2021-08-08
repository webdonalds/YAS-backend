import { Sequelize, Model, DataTypes } from 'sequelize';

class Follow extends Model {
    public id!: number;
    public followerId!: number;
    public followeeId!: number;

    public static initialize(sequelize: Sequelize) {
        this.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                    allowNull: false
                },
                followerId: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                followeeId: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
            },
            {
                tableName: 'follows',
                sequelize
            }
        );
    }
}


export default Follow;
