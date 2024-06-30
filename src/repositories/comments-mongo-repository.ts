import {ObjectId} from "mongodb";
import {CommentDbType} from "../db/comment-db-type";
import {commentCollection} from "../db/mongo-db";

export const commentsMongoRepository = {
    async create(inputComment: CommentDbType): Promise<{ id: string }> {
        const result = await commentCollection.insertOne(inputComment)
        return {id: result.insertedId.toString()}
    },

    checkObjectId(id: string): boolean {
        return ObjectId.isValid(id)
    }
}