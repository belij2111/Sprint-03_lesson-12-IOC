import {ObjectId} from "mongodb";
import {LikeStatus} from "./like-db-type";

export class PostDbType {
    constructor(
        public _id: ObjectId,
        public title: string,
        public shortDescription: string,
        public content: string,
        public blogId: ObjectId,
        public blogName: string,
        public createdAt: string,
        public extendedLikesInfo: {
            likesCount: number,
            dislikesCount: number,
            myStatus: LikeStatus,
            newestLikes: {
                addedAt: string,
                userId: string,
                login: string
            }[]
        }
    ) {
    }
}