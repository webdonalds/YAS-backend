import { Sequelize, Model, DataTypes } from 'sequelize';
import { TagResponse } from './dto/Video';

class Tag extends Model {
    public tagId!: number;
    public tagName!: string;

    public static initialize(sequelize: Sequelize):void {
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

    public toTagResponse(): TagResponse {
        return {
            tagName: this.tagName
        };
    }
}


export default Tag;
