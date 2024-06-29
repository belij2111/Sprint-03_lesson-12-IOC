import {ObjectId} from "mongodb";

export interface CommentDbType {
    _id: ObjectId,
    content: string,
    commentatorInfo: {
        userId: string,
        userLogin: string
    },
    createdAt: string,
    postId: ObjectId
}