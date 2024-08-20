import {ObjectId} from "mongodb";

export enum LikeStatus {
    None = "None",
    Like = "Like",
    Dislike = "Dislike"
}

export class LikeDbType {
    constructor(
        public _id: ObjectId,
        public createdAt: Date,
        public status: LikeStatus,
        public authorId: string,
        public parentId: string
    ) {
    }
}