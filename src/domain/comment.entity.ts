import mongoose, {Schema} from "mongoose";
import {SETTINGS} from "../settings";
import {CommentDbType, LikeStatus} from "../db/comment-db-type";

const CommentatorInfoSchema = new mongoose.Schema({
    userId: {type: String, required: true},
    userLogin: {type: String, required: true}
})

const LikesInfoSchema = new mongoose.Schema({
    likesCount: {type: Number, default: 0},
    dislikesCount: {type: Number, default: 0},
    myStatus: {type: String, enum: LikeStatus, default: LikeStatus.None},
})

export const CommentSchema = new mongoose.Schema<CommentDbType>({
    _id: {type: Schema.Types.ObjectId, required: true},
    content: {type: String, required: true},
    commentatorInfo: {type: CommentatorInfoSchema, required: true},
    createdAt: {type: String, required: true},
    postId: {type: Schema.Types.ObjectId, required: true},
    likesInfo: {type: LikesInfoSchema, required: true}
})

export const CommentModel = mongoose.model<CommentDbType>(SETTINGS.COLLECTION_NAME.COMMENT, CommentSchema)