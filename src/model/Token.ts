import { Sequelize, Model, DataTypes } from 'sequelize';

class Token extends Model {
    public userId!: number;
    public yasToken!: string;
    public yasSecretKey!: string;

    public static initialize(sequelize: Sequelize) {
        this.init(
            {
                userId: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                yasToken: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                yasSecretKey: {
                    type: DataTypes.STRING,
                    allowNull: false
                }
            },
            {
                tableName: 'tokens',
                sequelize
            }
        );
    }
}


export default Token;