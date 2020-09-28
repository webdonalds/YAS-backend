import { Sequelize, Model, DataTypes } from "sequelize";

class VideoHasTag extends Model {
    public videoId!: number; 
    public tagId!: number;

    public static initialize(sequelize: Sequelize) {
        this.init(
            {
                videoId: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                tagId: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                }
            },
            {
                tableName: "video_has_tag",
                sequelize
            }
        )
    }
}


export default VideoHasTag;