import {ObjectId} from "mongodb";

export class CommentDbType {
    constructor(
        public _id: ObjectId,
        public content: string,
        public commentatorInfo: {
            userId: string,
            userLogin: string
        },
        public createdAt: string,
        public postId: ObjectId
    ) {
    }
}