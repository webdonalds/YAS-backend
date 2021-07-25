import { Sequelize, Model } from 'sequelize';

class VideoHasTag extends Model {

    public static initialize(sequelize: Sequelize): void {
        this.init(
            {
            },
            {
                tableName: 'video_has_tag',
                sequelize
            }
        );
    }
}


export default VideoHasTag;
