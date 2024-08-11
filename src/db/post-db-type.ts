import {ObjectId} from "mongodb";

export class PostDbType {
    constructor(
        public _id: ObjectId,
        public title: string,
        public shortDescription: string,
        public content: string,
        public blogId: ObjectId,
        public blogName: string,
        public createdAt: string
    ) {
    }
}