import {ObjectId} from "mongodb";
import {OutputCommentType} from "../types/comment-types";
import {commentCollection} from "../db/mongo-db";
import {CommentDbType} from "../db/comment-db-type";

export const commentsMongoQueryRepository = {
    async getCommentsById(id: string): Promise<OutputCommentType | null> {
        if (!this.checkObjectId(id)) return null
        const comment = await this.findById(new ObjectId(id))
        if (!comment) return null
        return this.commentMapToOutput(comment)
    },

    async findById(id: ObjectId): Promise<CommentDbType | null> {
        return await commentCollection.findOne({_id: id})
    },

    commentMapToOutput(comment: CommentDbType): OutputCommentType {
        return {
            id: comment._id.toString(),
            content: comment.content,
            commentatorInfo: comment.commentatorInfo,
            createdAt: comment.createdAt
        }
    },

    checkObjectId(id: string): boolean {
        return ObjectId.isValid(id)
    }
}