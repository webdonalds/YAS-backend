import { Sequelize, Model, DataTypes } from "sequelize";

class User extends Model {
    public id!: number;
    public userId!: number; 
    public nickname!: string;
    public email!: string;
    public imagePath: string;
    public aboutMe: string;


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
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    unique: true
                },
                nickname: {
                    type: DataTypes.STRING(50),
                    allowNull: false,
                    unique: true
                },
                email: {
                    type: DataTypes.STRING(100),
                    allowNull: false,
                    unique: true
                },
                imagePath: {
                    type: DataTypes.STRING(150),
                    allowNull: true
                },
                aboutMe: {
                    type: DataTypes.STRING(200),
                    allowNull: true
                }
            },
            {
                tableName: "users",
                sequelize
            }
        )
    }
}


export default User;