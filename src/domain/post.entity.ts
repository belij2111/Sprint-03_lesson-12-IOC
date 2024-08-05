import mongoose, {Schema} from "mongoose";
import {SETTINGS} from "../settings";
import {PostDbType} from "../db/post-db-type";

export const PostSchema = new mongoose.Schema<PostDbType>({
    _id: {type: Schema.Types.ObjectId, required: true},
    title: {type: String, required: true},
    shortDescription: {type: String, required: true},
    content: {type: String, required: true},
    blogId: {type: Schema.Types.ObjectId, required: true},
    blogName: {type: String, required: true},
    createdAt: {type: String, required: true},
})

export const PostModel = mongoose.model<PostDbType>(SETTINGS.POST_COLLECTION_NAME, PostSchema)