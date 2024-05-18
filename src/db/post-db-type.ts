import {ObjectId} from "mongodb";

export interface PostDbType {
    _id: ObjectId,
    title: string,
    shortDescription: string,
    content: string,
    blogId: ObjectId,
    blogName: string,
    createdAt: string
}