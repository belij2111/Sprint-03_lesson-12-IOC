import {ObjectId} from "mongodb";

export interface UserDbType {
    _id: ObjectId,
    login: string,
    email: string,
    createdAt: string
}