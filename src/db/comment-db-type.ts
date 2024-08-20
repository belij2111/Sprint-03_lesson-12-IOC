import {ObjectId} from "mongodb";
import {LikeStatus} from "./like-db-type";

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