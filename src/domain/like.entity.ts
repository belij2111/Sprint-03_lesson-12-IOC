import mongoose, {Schema} from "mongoose";
import {SETTINGS} from "../settings";
import {LikeDbType, LikeStatus} from "../db/like-db-type";

const LikeSchema = new mongoose.Schema<LikeDbType>({
    _id: {type: Schema.Types.ObjectId, required: true},
    createdAt: {type: Date, required: true},
    status: {type: String, enum: LikeStatus, default: LikeStatus.None},
    authorId: {type: String, required: true},
    parentId: {type: String, required: true}
})

export const LikeModel = mongoose.model<LikeDbType>(SETTINGS.COLLECTION_NAME.LIKES, LikeSchema)