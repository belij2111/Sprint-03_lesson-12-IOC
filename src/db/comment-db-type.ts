import {ObjectId} from "mongodb";

export enum LikeStatus {
    None = "None",
    Like = "Like",
    Dislike = "Dislike"
}

export class CommentDbType {
    constructor(
        public _id: ObjectId,
        public content: string,
        public commentatorInfo: {
            userId: string,
            userLogin: string
        },
        public createdAt: string,
        public postId: ObjectId,
        public likesInfo: {
            likesCount: number,
            dislikesCount: number,
            myStatus: LikeStatus
        }
    ) {
    }
}