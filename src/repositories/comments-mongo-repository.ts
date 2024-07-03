import {ObjectId} from "mongodb";
import {CommentDbType} from "../db/comment-db-type";
import {commentCollection} from "../db/mongo-db";

export const commentsMongoRepository = {
    async create(inputComment: CommentDbType): Promise<{ id: string }> {
        const result = await commentCollection.insertOne(inputComment)
        return {id: result.insertedId.toString()}
    },

    async update(findComment: CommentDbType, updateComment: Object): Promise<boolean | null> {
        await commentCollection.updateOne(findComment, {$set: updateComment})
        return true
    },

    async findById(id: ObjectId): Promise<CommentDbType | null> {
        return await commentCollection.findOne({_id: id})
    },

    checkObjectId(id: string): boolean {
        return ObjectId.isValid(id)
    }
}