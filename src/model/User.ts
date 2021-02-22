import { Sequelize, Model, DataTypes, TextDataTypeOptions } from 'sequelize';

class User extends Model {
    public id!: number;
    public userId!: number;
    public nickname!: string;
    public email!: string;
    public imagePath: string;
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
                imagePath: {
                    type: DataTypes.TEXT('medium' as unknown as TextDataTypeOptions),
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