import {ObjectId} from "mongodb";
import {CommentDbType} from "../db/comment-db-type";
import {CommentModel} from "../domain/comment.entity";
import {injectable} from "inversify";

@injectable()
export class CommentsMongoRepository {
    async create(inputComment: CommentDbType): Promise<{ id: string }> {
        const result = await CommentModel.create(inputComment)
        return {id: result._id.toString()}
    }

    async update(findComment: CommentDbType, updateComment: Object): Promise<boolean | null> {
        const result = await CommentModel.updateOne({_id: findComment._id}, {$set: updateComment})
        return result.modifiedCount !== 0
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