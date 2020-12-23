import { Sequelize, Model } from 'sequelize';

class VideoHasTag extends Model {

    public static initialize(sequelize: Sequelize) {
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