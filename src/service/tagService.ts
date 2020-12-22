import { Tag } from '../model/index';


const TAG_MAX_LENGTH = 10;
const TAG_MAX_NUM = 5;


// validation codes
const TAGS_OKAY = 1;
const TAGS_TOO_LONG = 0;
const TAGS_WITH_FORBIDDEN_CHAR = -1;
const TAGS_TOO_MANY = -2;


// patterns
const TAG_ALLOWED_PATTERN = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-zA-Z|0-9]/;
const TAG_FORBIDDEN_PATTERN = /[~!@#$%^&*()_+|<>?:{}]/;


function validateTags(tags: Array<string>): number {
    if(tags.length > TAG_MAX_NUM) return TAGS_TOO_MANY;

    for(let i=0;i<tags.length;i++){
        if(tags[i].length > TAG_MAX_LENGTH) return TAGS_TOO_LONG;
        if(!(TAG_ALLOWED_PATTERN.test(tags[i]) && !TAG_FORBIDDEN_PATTERN.test(tags[i]))) return TAGS_WITH_FORBIDDEN_CHAR;
    }

    return TAGS_OKAY;   
}


function storeTagsIfNew(tags: Array<string>): void {

    tags.forEach(async (tag) => {
        const result = await Tag.findOne({
            where: { tagName: tag }
        });

        // if no tag name found
        if(result == null){
            await Tag.create({
                tagName: tag
            });
        }
    });
}


export default {
    TAG_MAX_LENGTH,
    TAG_MAX_NUM,
    TAGS_OKAY,
    TAGS_TOO_LONG,
    TAGS_TOO_MANY,
    TAGS_WITH_FORBIDDEN_CHAR,
    validateTags,
    storeTagsIfNew,
};