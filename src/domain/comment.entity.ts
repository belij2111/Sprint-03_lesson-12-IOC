import mongoose, {Schema} from "mongoose";
import {SETTINGS} from "../settings";
import {CommentDbType} from "../db/comment-db-type";

const CommentatorInfoSchema = new mongoose.Schema({
    userId: {type: String, required: true},
    userLogin: {type: String, required: true}
})

export const CommentSchema = new mongoose.Schema<CommentDbType>({
    _id: {type: Schema.Types.ObjectId, required: true},
    content: {type: String, required: true},
    commentatorInfo: {type: CommentatorInfoSchema},
    createdAt: {type: String, required: true},
    postId: {type: Schema.Types.ObjectId, required: true},

})

export const CommentModel = mongoose.model<CommentDbType>(SETTINGS.COMMENT_COLLECTION_NAME, CommentSchema)