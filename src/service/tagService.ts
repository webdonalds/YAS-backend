import { Tag, VideoHasTag } from '../model/index';


async function storeTagsIfNewAndGetTagIds(tags: Array<string>): Promise<Array<number>> {
    const ret = [];

    for(let i=0;i<tags.length;i++){
        const result = await Tag.findOrCreate({
            where: { tagName: tags[i] }
        });
        
        ret.push(result[0].getDataValue('id'));
    }

    return ret;
}


function addVideoHasTag(videoId: number, tagIds: Array<number>): void {
    tagIds.forEach((tagId) => {
        VideoHasTag.findOrCreate({
            where: {
                videoId: videoId,
                tagId: tagId
            }
        });
    });
} 


async function deleteVideoHasTag(videoId: number): Promise<void> {
    await VideoHasTag.destroy({
        where: {
            videoId: videoId
        }
    });
}


export default {
    storeTagsIfNewAndGetTagIds,
    addVideoHasTag,
    deleteVideoHasTag
};