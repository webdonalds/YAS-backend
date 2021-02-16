import { Sequelize, Model, DataTypes } from 'sequelize';

class User extends Model {
    public id!: number;
    public userId!: number;
    public nickname!: string;
    public email!: string;
    public imageFile: string;
    public aboutMe: string;
    public googleRefreshToken: string;
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
                imageFile: {
                    type: DataTypes.TEXT,
                    allowNull: true
                },
                aboutMe: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
                googleRefreshToken: {
                    type: DataTypes.STRING,
                    allowNull: false
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