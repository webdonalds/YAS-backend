import { Sequelize, Model, DataTypes } from 'sequelize';

class User extends Model {
    public id!: number;
    public userId!: number;
    public nickname!: string;
    public email!: string;
    public imagePath: string;
    public aboutMe: string;
    public refreshToken: string;
    public registered: boolean;


    public static initialize(sequelize: Sequelize) {
        this.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                    allowNull: false
                },
                userId: {
                    type: DataTypes.DECIMAL(30),
                    allowNull: false,
                    unique: true
                },
                nickname: {
                    type: DataTypes.STRING(50),
                    allowNull: true,
                    unique: true
                },
                email: {
                    type: DataTypes.STRING(100),
                    allowNull: false,
                    unique: true
                },
                imagePath: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
                aboutMe: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
                googleRefreshToken: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                googleAccessToken: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
                googleTokenExpireTime: {
                    type: DataTypes.BIGINT,
                    allowNull: true
                }
            },
            {
                tableName: 'users',
                sequelize
            }
        );
    }
}


export default User;