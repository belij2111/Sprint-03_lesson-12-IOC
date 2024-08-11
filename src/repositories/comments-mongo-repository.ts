import {ObjectId} from "mongodb";
import {CommentDbType} from "../db/comment-db-type";
import {CommentModel} from "../domain/comment.entity";

export class CommentsMongoRepository {
    async create(inputComment: CommentDbType): Promise<{ id: string }> {
        const result = await CommentModel.create(inputComment)
        return {id: result._id.toString()}
    }

    async update(findComment: CommentDbType, updateComment: Object): Promise<boolean | null> {
        await CommentModel.updateOne(findComment, {$set: updateComment})
        return true
    }

    async findById(id: ObjectId): Promise<CommentDbType | null> {
        return CommentModel.findOne({_id: id})
    }

    async deleteById(findComment: CommentDbType): Promise<boolean | null> {
        await CommentModel.deleteOne(findComment)
        return true
    }

    checkObjectId(id: string): boolean {
        return ObjectId.isValid(id)
    }
}