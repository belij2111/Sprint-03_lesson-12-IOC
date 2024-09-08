import mongoose, {Schema} from "mongoose";
import {SETTINGS} from "../settings";
import {PostDbType} from "../db/post-db-type";
import {LikeStatus} from "../db/like-db-type";

const NewestLikesSchema = new mongoose.Schema({
    addedAt: {type: String, required: true},
    userId: {type: String, required: true},
    login: {type: String, required: true}
})

const ExtendedLikesInfoSchema = new mongoose.Schema({
    likesCount: {type: Number, default: 0},
    dislikesCount: {type: Number, default: 0},
    myStatus: {type: String, enum: LikeStatus, default: LikeStatus.None},
    newestLikes: ({type: [NewestLikesSchema], required: true})
})

export const PostSchema = new mongoose.Schema<PostDbType>({
    _id: {type: Schema.Types.ObjectId, required: true},
    title: {type: String, required: true},
    shortDescription: {type: String, required: true},
    content: {type: String, required: true},
    blogId: {type: Schema.Types.ObjectId, required: true},
    blogName: {type: String, required: true},
    createdAt: {type: String, required: true},
    extendedLikesInfo: ({type: ExtendedLikesInfoSchema, required: true})
})

export const PostModel = mongoose.model<PostDbType>(SETTINGS.COLLECTION_NAME.POST, PostSchema)