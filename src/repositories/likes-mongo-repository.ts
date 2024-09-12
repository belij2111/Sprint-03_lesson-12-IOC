import {LikeModel} from "../domain/like.entity";
import {LikeDbType} from "../db/like-db-type";
import {InputLikeType} from "../types/like-types";
import {injectable} from "inversify";

@injectable()
export class LikesMongoRepository {
    async create(inputLike: LikeDbType): Promise<{ id: string }> {
        const result = await LikeModel.create(inputLike)
        return {id: result._id.toString()}
    }

    async update(findLike: LikeDbType, inputLike: InputLikeType): Promise<boolean | null> {
        const result = await LikeModel.updateOne({_id: findLike._id}, {$set: {status: inputLike.likeStatus}})
        return result.modifiedCount !== 0
    }

    async find(userId: string, parentId: string): Promise<LikeDbType | null> {
        return LikeModel.findOne({authorId: userId, parentId: parentId})
    }
}