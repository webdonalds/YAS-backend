import { Sequelize, Model, DataTypes } from "sequelize";

class Follow extends Model {
    public followerId!: number; 
    public followeeId!: number;

    public static initialize(sequelize: Sequelize) {
        this.init(
            {
                followerId: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                followeeId: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                }
            },
            {
                tableName: "follows",
                sequelize
            }
        )
    }
}


export default Follow;