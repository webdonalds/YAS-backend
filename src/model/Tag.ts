import { Sequelize, Model, DataTypes } from 'sequelize';

class Tag extends Model {
    public tagId!: number;
    public tagName!: string;

    public static initialize(sequelize: Sequelize) {
        this.init(
            {
                tagName: {
                    type: DataTypes.STRING(20),
                    allowNull: false,
                    unique: true
                }
            },
            {
                tableName: 'tags',
                sequelize
            }
        );
    }
}


export default Tag;